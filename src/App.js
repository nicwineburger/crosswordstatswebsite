import { useState } from 'react';
import './App.css';
import Plot from 'react-plotly.js';
import Papa from 'papaparse';


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

const runScript = async (key, date) => {
    let dataBuffer = [];

    let thirtyDays = 1000*60*60*24*30;
    let oneDay = 1000*60*60*24;

    let inputDate = new Date(date);
    let currentDate = new Date();

    let numChunks = determineNumChunks(inputDate, currentDate);

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
        document.getElementById('chunkLoading').value = 100 / numChunks;
        numChunks--;

        incrementDate = new Date(incrementDate.getTime() +  thirtyDays);

        if (incrementDate >= currentDate) {
            // We probably overshot so we need to get the last chunk up to today
            startDate = new Date(endDate).toISOString().slice(0,10);
            endDate = new Date(currentDate.getTime() - oneDay).toISOString().slice(0,10);
            request = {"auth_key": key, "earliest_date": startDate, "end_date": endDate};
            let lastChunkJson = await getData(request);
            dataBuffer.push(lastChunkJson["content"]);
            document.getElementById('chunkLoading').value = 100;
            break;
        }
    }
    
    console.log(dataBuffer);
    
  	return dataBuffer;
}



const App = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [authKey, setAuthKey] = useState("");
    const [date, setDate] = useState("");
    const [isSubmit, setIsSubmit] = useState(false);
    const [isError, setIsError] = useState(false);
    const [plotData, setPlotData] = useState([]);

    async function afterSubmission(event) {
        setIsSubmit(true)
        event.preventDefault()
        let out;
        out = await runScript(authKey, date);
        if (out.hasOwnProperty('message')) {
            setIsError(true);
        } else {
            let parsedArray = [];
            for (var i = 0; i < out.length; i++) {
                let chunkJson = Papa.parse(out[i], {
                    header: true,
                    dynamicTyping: true
                });
                console.log(chunkJson);
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
            
            
            let lineData = [];
        
            for (var day of DAYS) {
                let dayArray = byDayArray[day];
                let xArr = [];
                let yArr = [];
                for (var solve of dayArray) {
                    xArr.push(solve["date"]);
                    yArr.push(solve["solve_time_secs"] / 60);
                }
                lineData.push({x: xArr, y: yArr, mode: 'lines', name: day})
            }

            
            console.log(byDayArray);
            console.log(lineData);
            setPlotData(lineData);
            setIsLoading(false);
        }
    }

    return (
        <div className="App">
        <header className="App-header">
            <div>
                {isSubmit && !isError && (
                    <div>
                        {isLoading && (
                            <progress id="chunkLoading" value="0" max="100">0 % of data downloaded</progress>
                        )}
                        {!isLoading && (
                            <Plot
                                data={plotData}
                                layout={{
                                    width: 740, 
                                    height: 580, 
                                    title: 'NYT Crossword Solves Over Time',
                                    colorway: ['#377eb8', '#ff7f00', '#4daf4a', '#f781bf', '#a65628', '#984ea3', '#999999']
                                }}
                          />
                        )}
                    </div>
                )}

                {!isSubmit && (
                    <div>
                        <p>
                        <a href="https://github.com/nicwineburger/crosswordstatswebsite/wiki/Getting-Your-NYT-Auth-Token">Click here for instructions on how to get your auth-key from the NYT</a>
                        </p>
                        <form onSubmit={(e) => afterSubmission(e)}>
                            <label>Enter your auth-key:
                            <br/>
                            <input
                                type="text"
                                value={authKey}
                                onChange={(e) => setAuthKey(e.target.value)}
                            />
                            </label>
                            <br/>
                            <label>Enter earliest date (YYYY-MM-DD):
                            <br/>
                            <input
                                type="text"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                            </label>
                            <br/>
                            <input type="submit"/>
                        </form>
                    </div>
                )}

                {isError && isSubmit && (
                    <div>
                        <p>
                            Sorry, something went wrong. Please try again.
                        </p>
                    </div>
                )}
            </div>
        </header>
        </div>
    );
}

export default App;