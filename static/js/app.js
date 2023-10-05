// Define Belly Buttons URL
const dataURL = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Function
function init() {
    //Get data from URL
    d3.json(dataURL).then(data => {
        //Sample data
        const samples = data.samples;
        // First Sample from data
        const defaultSample = samples[0];
        // Drop down menu
        const select = d3.select("#selDataset");
        samples.forEach(sample => {
            select
                .append("option")
                .attr("value", sample.id)
                .text(sample.id);

        });
        updateBarChart(defaultSample);
    });


}
//Update Bar Chart
function updateBarChart(sampleData) {
    //Top 10 OTU's
    const top100TUs = sampleData.otu_ids.slice(0,10);
    const top10Values = sampleData.sample_values.slice(0, 10);
    const top10Labels = sampleData.otu_labels.slice(0,10);

    // Trace for Bar Chart
    const trace = {
        x: top10Values.reverse(),
        y: top100TUs.map(otu => `OTU ${otu}`),
        text: top10Labels,
        type: "bar",
        orientation: "h"
    };
    // Layout
    const layout = {
        title: "Top 10 OTUs Found",
        xaxis: { title: "Sample Values"},
        yaxis: { title: "OTU ID"}
    };
    // Create new bar chart
    Plotly.newPlot("bar", [trace], layout);
    
}
// Dropdown Selection
function optionChanged(selectedSampleID) {
    // Data for Sample Selection
    d3.json(dataURL).then(data => {
        const samples = data.samples;
        const selectedSample = samples.find(sample => sample.id === selectedSampleID)
        // Update bar chart
        updateBarChart(selectedSample);
    });
}

init();

function updateBubbleChart(sampleData) {

    const trace = {
        x: sampleData.otu_ids,
        y: sampleData.sample_values,
        text: sampleData.otu_labels,
        mode: 'markers',
        marker: {
            size: sampleData.sample_values,
            color: sampleData.otu_ids,
            colorscale: "jet"
        }

    };

    const layout = {
        title: 'Bubble Chart for Sample',
        xaxis: { title: 'OTU ID' },
        yaxis: { title: 'Sample Values' },
        showlegend: false,
        height: 600,
        width: 1000
    };
    Plotly.newPlot('bubble', [trace], layout);
}

function optionChanged(selectedSampleID) {

    d3.json(dataURL).then(data => {
        const samples = data.samples;
        const selectedSample = samples.find(sample => sample.id === selectedSampleID)

        updateBubbleChart(selectedSample)
    });
}

function initBubbleChart() {

    d3.json(dataURL).then(data => {
        const samples = data.samples;

        const defaultSample = samples[0];

        updateBubbleChart(defaultSample);
    
    });
}

initBubbleChart();