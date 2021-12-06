import { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';


const runScript = async (key, date) => {

    if (date === "0") {
        // let gameId = "19722" // TODO: Need a way to get this programatically. If user hasn't started the puzzle with this ID then everything will break
        // let gameIdUrl = `https://nyt-games-prd.appspot.com/svc/crosswords/v6/game/${gameId}.json`
        // let userIdRequest = await fetch(gameIdUrl, {
        //     method: "GET",
        //     mode: "cors", 
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'nyt-s': key,
        //         'dnt': 1,
        //         'Accept': 'application/json' 
        //     }
        // })
        // let userIdResponse = await userIdRequest.json()
        let userId = "36569100" //userIdResponse["userID"]
        let streakUrl = `https://nyt-games-prd.appspot.com/svc/crosswords/v3/${userId}/stats-and-streaks.json?date_start=2014-01-01&start_on_monday=true`
        let streakRequest = await fetch(streakUrl, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'nyt-s': key
            },
            mode: "cors"
        })
        let streakResponse = await streakRequest.json()
        let streakDate = streakResponse["results"]["streaks"]["dates"][0][0]
        date = streakDate
    }


    let url = "https://h9e25h7oj8.execute-api.us-east-1.amazonaws.com/default/nic-crossword-lambda"
    let request = {"auth_key": key, "earliest_date": date}
	let response = await fetch(url, {
        method: "POST",
        header: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
    }) 
	let image = await response.json()
    console.log(image);
    if (image["message"] !== "auth key or date not provided" && image["message"] !== "sorry, something went wrong") {
        let returnString = Buffer.from(image["content"], 'base64').toString('utf8')
        return returnString
    }
  	return 
}



const App = () => {
    const [output, setOutput] = useState("");
    const [authKey, setAuthKey] = useState("");
    const [date, setDate] = useState("");
    const [isSubmit, setIsSubmit] = useState(false);

    // useEffect(() => {
    //     const run = async () => {
    //         let out;
    //         if (localStorage.getItem("token") !== null) {
    //             out = await runScript(localStorage.getItem("token"))
    //         } else {
    //             out = await runScript(authKey, date);
    //         }

    //         if (out != null) {
    //             let img = out.indexOf("<svg ")
    //             let blob = new Blob([out.substr(img)], {type: 'image/svg+xml'})
    //             let url = URL.createObjectURL(blob)
    //             let image = document.createElement('img')
    //             image.addEventListener('load', () => URL.revokeObjectURL(url), {once: true})
    //             setOutput(url);
                
    //         }         
			
    //     }
    //     run();

    // }, [authKey, date]);

    async function afterSubmission(event) {
        event.preventDefault()
        setIsSubmit(true)
        localStorage.setItem("token", authKey)
        localStorage.setItem("date", date)
        
        let out = await runScript(authKey, date)
        let img = out.indexOf("<svg ")
        let blob = new Blob([out.substr(img)], {type: 'image/svg+xml'})
        let url = URL.createObjectURL(blob)
        let image = document.createElement('img')
        image.addEventListener('load', () => URL.revokeObjectURL(url), {once: true})
        setOutput(url);
    }

    return (
        <div className="App">
        <header className="App-header">
            <div>
                {isSubmit && (
                    <div>
                        {output === "" && (
                            <p>
                                loading... (this might take a minute or two)
                            </p>
                        )}
                        {output !== "" && (
                            <p>
                                <img alt="plot" src={output} width="1000" height="700" />
                            </p>
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
            </div>
        </header>
        </div>
    );
}

export default App;