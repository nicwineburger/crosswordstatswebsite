function csvChanged(event, setPlotData) {
    console.log('csv changed')
    var reader = new FileReader();
    reader.onload = function(readFile) {
        if(readFile.target.readyState != 2) {
            console.error('target wasn\'t ready')
            console.log(readFile.target.readyState)
            return;
        };
        if(readFile.target.error) {
            alert('Error while reading file');
            return;
        }
        console.log('loading file content')

        let filecontent = readFile.target.result;
        // turn filecontent into array of lines
        let lines = filecontent.split(/[\r\n]+/g)
        setPlotData(lines);
    };
    reader.readAsText(event.target.files[0]);
}

function CsvUpload(props) {
    return (
        <form id="myform" onChange={(event) => {csvChanged(event, props.setPlotData)}}>
            <p>
                <input id="myfile" type="file" />
            </p>
        </form>
    );
}

export default CsvUpload;
