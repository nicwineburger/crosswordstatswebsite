import { useState } from 'react';
import './App.css';
import Papa from 'papaparse';
import ErrorPage from './pages/ErrorPage';
import LandingPage from './pages/LandingPage';
import LoadingPage from './pages/LoadingPage';
import PlotPage from './pages/PlotPage';
import CsvDownloader from 'react-csv-downloader';

function cumulativeRollingAverage(data) {
    var cmaData = [];
    for (var weekDay of data) {
        var newData = JSON.parse(JSON.stringify(weekDay));

        var cma = [];
        var acc = [];
        for (var daySolveTime of newData.y) {
            acc.push(daySolveTime);
            var currAvg = acc.reduce((a, b) => a + b, 0);
            var cmaToday = currAvg / acc.length;
            cma.push(cmaToday);
        }
        newData.y = cma;
        newData['visible'] = false;
        cmaData.push(newData);
    }

    return cmaData;

}


function determineNumChunks(inputDate, currentDate) {
    let thirtyDays = 1000*60*60*24*30;

    let incrementDate = new Date(inputDate.getTime() + thirtyDays);
    let numChunks = 0;

    while (incrementDate < currentDate) {
        numChunks++;
        incrementDate = new Date(incrementDate.getTime() +  thirtyDays);
        if (incrementDate >= currentDate) {
            numChunks++;
            break;
        }
    }

    return numChunks;
}

async function getData(requestObject) {
    let url = "https://h9e25h7oj8.execute-api.us-east-1.amazonaws.com/default/nic-crossword-lambda"
    let response = await fetch(url, {
        method: "POST",
        header: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestObject)
    }) 
    
    return await response.json();
}

const runScript = async (key, date, setProgressBar, setFileName) => {
    let dataBuffer = [];

    let oneDay = 1000*60*60*24;
    let thirtyDays = 30 * oneDay;

    let inputDate = new Date(date);
    let currentDate = new Date();

    let fileName = `CrosswordData_${inputDate.toISOString().slice(0,10)}_to_${currentDate.toISOString().slice(0,10)}`;
    setFileName(fileName);

    let initialNumChunks = determineNumChunks(inputDate, currentDate);
    let curNumChunks = 1;

    let incrementDate = new Date(inputDate.getTime() + thirtyDays);

    while (incrementDate < currentDate) {
        let startDate = new Date(incrementDate.getTime() - thirtyDays).toISOString().slice(0,10);
        let endDate = new Date(incrementDate).toISOString().slice(0,10);

        let request = {"auth_key": key, "earliest_date": startDate, "end_date": endDate};
        let responseJson = await getData(request);
        if (responseJson.hasOwnProperty('message')) {
            return responseJson;
        }
        dataBuffer.push(responseJson["content"]);
        setProgressBar(Math.floor((curNumChunks / initialNumChunks) * 100));
        curNumChunks += 1;

        incrementDate = new Date(incrementDate.getTime() +  thirtyDays);

        if (incrementDate >= currentDate) {
            // We probably overshot so we need to get the last chunk up to today
            startDate = new Date(endDate).toISOString().slice(0,10);
            endDate = new Date(currentDate.getTime()).toISOString().slice(0,10);
            request = {"auth_key": key, "earliest_date": startDate, "end_date": endDate};
            let lastChunkJson = await getData(request);
            dataBuffer.push(lastChunkJson["content"]);
            setProgressBar(100);
            break;
        }
    }
    
  	return dataBuffer;
}

function parseData(incomingData, setCsvData) {
    let parsedArray = [];
    for (var i = 0; i < incomingData.length; i++) {
        let chunkJson = Papa.parse(incomingData[i], {
            header: true,
            dynamicTyping: true
        });

        let lastDate; 
        for (var j = 0; j < chunkJson["data"].length; j++) {
            if (chunkJson["data"][j]["date"] !== null) {
                if (j !== 0) {
                    if (chunkJson["data"][j]["date"] !== lastDate["date"]) {
                        parsedArray.push(chunkJson["data"][j]);
                    }
                }
                lastDate = chunkJson["data"][j];
            }
        }
    }

    const csvData = [];
    csvData.push(...parsedArray);
    setCsvData(csvData);
    
    let DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    let byDayArray = [];
    for (var l = 0; l < DAYS.length; l++) {
        let dayArray = [];
        for (var k = 0; k < parsedArray.length; k++) {
            if (parsedArray[k]["weekday"] === DAYS[l]) {
                dayArray.push(parsedArray[k])
            }
        }
        byDayArray[DAYS[l]] = dayArray;
    }

    // To plot our data, we need an array of numbers of solve times
    // and an array of dates they're from. Now we have every day of
    // the week as seperate arrays of JSON.
    // The format of this byDayArray is:
    // byDayArray = {Mon: [0: {date: 'YYYY-MM-DD', solve_time_sec: 0, ...}, 1: {...}, ...], Tue: [...], ...}
    
    
    const rawData = [];

    for (var day of DAYS) {
        let dayArray = byDayArray[day];
        let xArr = [];
        let yArr = [];
        for (var solve of dayArray) {
            xArr.push(solve["date"]);
            yArr.push(solve["solve_time_secs"] / 60);
        }
        rawData.push({x: xArr, y: yArr, mode: 'lines', name: day})
    }
    
    const cmaData = cumulativeRollingAverage(rawData);
    const allData = [rawData, cmaData];
    
    return allData;
}

function parseDataAndDisplay(rawCsvString, setCsvData, setPlotData,
    setIsLoading, setIsFileParse) {
    console.log('Parsing and displaying')
    let allData = parseData(rawCsvString, setCsvData);
    setPlotData(allData);
    setIsLoading(false);
    setIsFileParse(true);
}

const App = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [authKey, setAuthKey] = useState("");
    const [date, setDate] = useState("");
    const [isSubmit, setIsSubmit] = useState(false);
    const [isError, setIsError] = useState(false);
    const [plotData, setPlotData] = useState([]);
    const [progressBar, setProgressBar] = useState(0);
    const [csvData, setCsvData] = useState([]);
    const [fileName, setFileName] = useState("");
    const [isFileParse, setIsFileParse] = useState(false); 

    async function afterSubmission(event) {
        setIsSubmit(true)
        event.preventDefault()
        let out;
        out = await runScript(authKey, date, setProgressBar, setFileName);
        if (out.hasOwnProperty('message')) {
            setIsError(true);
        } else {
            let allData = parseData(out, setCsvData)
            
            setPlotData(allData);
            setIsLoading(false);
        }
    }

    return (
        <div className="App">
        <header className="App-header">
            <div>
                {isSubmit && !isError && isLoading &&
                    <LoadingPage progressBar={progressBar} />
                }
                {isSubmit && !isError && !isLoading && (
                    <div> 
                        <CsvDownloader 
                            id='downloadButton'
                            filename={fileName}
                            extension='.csv'
                            datas={csvData}
                            text='Download data as CSV'
                            hidden
                        />
                        <PlotPage plotData={plotData} csvData={csvData} width={740} height={580} />
                    </div>
                )}

                {!isSubmit && !isFileParse && (
                    <LandingPage afterSubmission={afterSubmission}
                        authKey={authKey} setAuthKey={setAuthKey}
                        date={date} setDate={setDate} isFileParse={isFileParse}
                        setIsFileParse={setIsFileParse}
                        parseDataAndDisplay={
                            (rawCsvData) => parseDataAndDisplay(rawCsvData, setCsvData,
                                setPlotData, setIsLoading, setIsFileParse)
                        }
                    />
                )}

                {isFileParse && (
                    <PlotPage plotData={plotData} width={740} height={540} isFileParse={isFileParse} 
                              parseData={parseData} setCsvData={setCsvData}/>
                )}

                {isError && isSubmit && (
                    <ErrorPage />
                )}
            </div>
        </header>
        </div>
    );
}

export default App;