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

function simulateClick(e) {
    e.click();
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
        // TODO: Get plot to auto-resize so mobile isn't broken
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
        },
        modbardisplay: false
    }

    var downloadIcon = {
        // TODO: Flip this icon 180 degrees so it doesn't look like an upload icon
        'width': 1792,
        'path': 'M1344 1344q0-26-19-45t-45-19-45 19-19 45 19 45 45 19 45-19 19-45zm256 0q0-26-19-45t-45-19-45 19-19 45 19 45 45 19 45-19 19-45zm128-224v320q0 40-28 68t-68 28h-1472q-40 0-68-28t-28-68v-320q0-40 28-68t68-28h465l135 136q58 56 136 56t136-56l136-136h464q40 0 68 28t28 68zm-325-569q17 41-14 70l-448 448q-18 19-45 19t-45-19l-448-448q-31-29-14-70 17-39 59-39h256v-448q0-26 19-45t45-19h256q26 0 45 19t19 45v448h256q42 0 59 39z',
        'ascent': 1792,
        'descent': 0
    }

    var config = {
        modeBarButtonsToAdd: [
            {
                name: 'Download data to CSV',
                icon: downloadIcon,
                click: function(gd) {
                    var csvButton = document.getElementById("downloadButton");
                    csvButton.click();
                }
            }
        ]
    }

    return (
        <Plot
            data={data}
            layout={layout}
            config={config}
        />
        
    );
}

export default PlotPage;
