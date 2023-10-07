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


// Function Updates demographic info
function updateDemographicInfo(metadata) {
    // Select 'sample-metadata" div
    const metadataDiv = document.getElementById("sample-metadata");
    // Existing content cleared in div
    metadataDiv.innerHTML = "";
    // for loop creating paragraphs for key-value pairs
    for (const [key, value] of Object.entries(metadata)) {
        const paragraph = document.createElement("p");
        paragraph.textContent = `${key}: ${value}` ;
        metadataDiv.appendChild(paragraph);
    }
}

// /**
//  * BONUS Solution
//  * */
// function buildGauge(wfreq) {
//     // Enter the washing frequency between 0 and 180
//     let level = parseFloat(wfreq) * 20;
//   ​
//     // Trig to calc meter point
//     let degrees = 180 - level;
//     let radius = 0.5;
//     let radians = (degrees * Math.PI) / 180;
//     let x = radius * Math.cos(radians);
//     let y = radius * Math.sin(radians);
//   ​
//     // Path: may have to change to create a better triangle
//     let mainPath = "M -.0 -0.05 L .0 0.05 L ";
//     let pathX = String(x);
//     let space = " ";
//     let pathY = String(y);
//     let pathEnd = " Z";
//     let path = mainPath.concat(pathX, space, pathY, pathEnd);
//   ​
//     let data = [
//       {
//         type: "scatter",
//         x: [0],
//         y: [0],
//         marker: { size: 12, color: "850000" },
//         showlegend: false,
//         name: "Freq",
//         text: level,
//         hoverinfo: "text+name"
//       },
//       {
//         values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
//         rotation: 90,
//         text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
//         textinfo: "text",
//         textposition: "inside",
//         marker: {
//           colors: [
//             "rgba(0, 105, 11, .5)",
//             "rgba(10, 120, 22, .5)",
//             "rgba(14, 127, 0, .5)",
//             "rgba(110, 154, 22, .5)",
//             "rgba(170, 202, 42, .5)",
//             "rgba(202, 209, 95, .5)",
//             "rgba(210, 206, 145, .5)",
//             "rgba(232, 226, 202, .5)",
//             "rgba(240, 230, 215, .5)",
//             "rgba(255, 255, 255, 0)"
//           ]
//         },
//         labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
//         hoverinfo: "label",
//         hole: 0.5,
//         type: "pie",
//         showlegend: false
//       }
//     ];
//   ​
//     let layout = {
//       shapes: [
//         {
//           type: "path",
//           path: path,
//           fillcolor: "850000",
//           line: {
//             color: "850000"
//           }
//         }
//       ],
//       title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
//       height: 500,
//       width: 500,
//       xaxis: {
//         zeroline: false,
//         showticklabels: false,
//         showgrid: false,
//         range: [-1, 1]
//       },
//       yaxis: {
//         zeroline: false,
//         showticklabels: false,
//         showgrid: false,
//         range: [-1, 1]
//       }
//     };
//   ​
//     let GAUGE = document.getElementById("gauge");
//     Plotly.newPlot(GAUGE, data, layout);
//   }

// function for dropdown menu selection
function optionChanged(selectedSampleID) {
    // find selected sample metadata in data
    d3.json(dataURL).then(data => {
      const samples = data.samples;
      const metadata = data.metadata;
  
      // Find the selected sample data and metadata
      const selectedSample = samples.find(sample => sample.id === selectedSampleID);
      const selectedMetadata = metadata.find(item => item.id === parseInt(selectedSampleID));
      
      // Update Demographicinfo, Bar Chart, and Bubble Chart  
      updateDemographicInfo(selectedMetadata);
      updateBarChart(selectedSample);
      updateBubbleChart(selectedSample);
    });

}

// Default data is initialized in page 
function init() {
    d3.json(dataURL).then(data => {
        const samples = data.samples;
        const metadata = data.metadata;
        // Populate dropdown menu with sample ID's
        const select = document.getElementById("selDataset");
        samples.forEach(sample => {
            const option = document.createElement("option");
            option.value = sample.id;
            option.text = sample.id;
            select.appendChild(option);
    });
        // Initialize page with first sample
        const defaultSampleID = samples[0].id;
        optionChanged(defaultSampleID);
    });
}

init(); // Initialize Page 


