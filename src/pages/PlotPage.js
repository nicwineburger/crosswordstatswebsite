import Plot from 'react-plotly.js';


function createTraces(data) {
    var traceArray = [];
    var max = 0;
    for (var dataSet of data) {
        for (var trace of dataSet) {
            traceArray.push(trace);
            var traceMax = Math.max(trace.y);
            if (traceMax > max) { max = traceMax; }
        }
    }
    
    return traceArray;
}

var rawVisible = [true, true, true, true, true, true, true, false, false, false, false, false, false, false]
var cmaVisible = [false, false, false, false, false, false, false, true, true, true, true, true, true, true]

function PlotPage(props) {

    var data = createTraces(props.plotData);

    var updatemenus = [
        {
            buttons: [
                {
                    args: [{'visible': rawVisible},
                           {'title': 'NYT Crossword Solve Times: Raw Data'}],
                    label: 'Raw Data',
                    method: 'update'
                },
                {
                    args: [{'visible': cmaVisible},
                           {'title': 'NYT Crossword Solve Times: Cumulative Moving Average'}],
                    label: 'Moving Average',
                    method: 'update'
                }
            ],
            direction: 'left',
            showactive: true,
            type: 'buttons',
            x: 0.33,
            y: 1.1,
            xanchor: 'left',
            yanchor: 'top'
        }
    ]
    
    var layout = {
        title: "NYT Crossword Solve Times: Raw Data ",
        width: props.width, 
        height: props.height,
        updatemenus: updatemenus,
        colorway: ['#377eb8', '#ff7f00', '#4daf4a', '#f781bf', '#a65628', '#984ea3', '#999999'],
        xaxis: {
            title: "Date",
            zeroline: true
            //autorange: true
        },
        yaxis: {
            title: "Minutes to Solve",
            zeroline: true
            //autorange: true,
        }
    }

    return (
        <Plot
            data={data}
            layout={layout}
        />
        // <Plot
        //     data={props.plotData}
        //     layout={{
        //         width: props.width, 
        //         height: props.height,
        //         title: 'NYT Crossword Solves Over Time',
        //         colorway: ['#377eb8', '#ff7f00', '#4daf4a', '#f781bf', '#a65628', '#984ea3', '#999999'],
        //         xaxis: {
        //             title: "Date",
        //             zeroline: false
        //         },
        //         yaxis: {
        //             title: "Minutes to Solve",
        //             zeroline: false
        //         }
        //     }}
        // />
    );
}

export default PlotPage;
