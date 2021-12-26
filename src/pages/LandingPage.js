import CsvUpload from '../components/CsvUpload';

function LandingPage(props) {
    return (
        <div>
            <a href="https://github.com/nicwineburger/crosswordstatswebsite/wiki/Getting-Your-NYT-Auth-Token">
                Click here for instructions on how to get your auth-key from the NYT
            </a>
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
        </div>
    );
}

export default LandingPage;
