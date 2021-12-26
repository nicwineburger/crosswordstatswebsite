import {Dropzone, FileItem} from '@dropzone-ui/react';

function LandingPage(props) {
    const updateFiles = (incomingFiles, setFiles, setIsFileParse) => {
        console.log(incomingFiles);

        setFiles(incomingFiles);
        setIsFileParse(true);

    }

    return (
        <div>
            <div>
                <p>
                <a href="https://github.com/nicwineburger/crosswordstatswebsite/wiki/Getting-Your-NYT-Auth-Token">
                    Click here for instructions on how to get your auth-key from the NYT
                </a>
                </p>
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
            <div>
                <Dropzone
                    style={{width: "500px", minHeight: "50px", display: "inline-block"}}
                    label="Or upload a CSV file here:"
                    footer={false}
                    header={false}
                    onChange={(files) => updateFiles(files, props.setFiles, props.setIsFileParse)}
                    value={props.files}
                >
                    {props.files.map((file) => (
                        <FileItem {...file} key={file.id} info />
                    ))}

                </Dropzone>
            </div>
        </div>
    );
}

export default LandingPage;
