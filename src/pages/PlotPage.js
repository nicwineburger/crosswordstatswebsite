import Plot from 'react-plotly.js';

function PlotPage(props) {
    return (
        <Plot
            data={props.plotData}
            layout={{
                width: props.width, 
                height: props.height,
                title: 'NYT Crossword Solves Over Time',
                colorway: ['#377eb8', '#ff7f00', '#4daf4a', '#f781bf', '#a65628', '#984ea3', '#999999']
            }}
        />
    );
}

export default PlotPage;
