import CsvUpload from '../components/CsvUpload';
import githublogo from '../github-logo.svg';

function LandingPage(props) {
    return (
        <div>
            <a href="https://github.com/nicwineburger/crosswordstatswebsite/wiki/Getting-Your-NYT-Auth-Token">
                Click here for instructions on how to get your auth-key from the NYT
            </a>
            <br/>
            <br/>
            <div className="FlexContainer">
                <div>
                    <form onSubmit={(e) => props.afterSubmission(e)}>
                        <label>Enter your auth-key:
                        <br/>
                        <input
                            type="text"
                            value={props.authKey}
                            onChange={(e) => props.setAuthKey(e.target.value)}
                        />
                        </label>
                        <br/>
                        <label>Enter earliest date (YYYY-MM-DD):
                        <br/>
                        <input
                            type="text"
                            value={props.date}
                            onChange={(e) => props.setDate(e.target.value)}
                        />
                        </label>
                        <br/>
                        <input type="submit"/>
                    </form>
                </div>
                <CsvUpload setPlotData={props.parseDataAndDisplay} />
            </div>
            <p><a href="https://github.com/nicwineburger/crosswordstatswebsite#downloading-a-csv-of-your-data">CSV Download/Upload Instructions</a></p>
            <br/>
            <p>
                <a href="https://github.com/nicwineburger/crosswordstatswebsite">
                    <img src={githublogo} width={100} height={100}/>
                </a>
            </p>
        </div>
    );
}

export default LandingPage;
