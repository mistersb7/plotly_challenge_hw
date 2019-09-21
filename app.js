
  function buildMetadata(sample) {
  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
  var url = `/metadata/${sample}`;
  d3.json(url).then(function(sample){
    // Use d3 to select the panel with id of `#sample-metadata`
    var sample_metadata = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    sample_metadata.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(sample).forEach(function ([key, value]) {
      var row = sample_metadata.append("p");
      row.text(`${key}: ${value}`);

});
  }
)};


function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var plotData = `/samples/${sample}`;
  d3.json(plotData).then(function(data) {

    // @TODO: Build a Bubble Chart using the sample data
    var xvalue = data.otu_ids;
    var yvalue = data.sample_values;
    var markersize = data.sample_values;
    var markercolors = data.otu_ids; 
    var textvalues = data.otu_labels;

    var bubbledata = [{
      x: xvalue,
      y: yvalue,
      text: textvalues,
      mode: 'markers',
      marker: {
        color: markercolors,
        size: markersize,
        width: 750
      }
    }];
  
    var layout = {
      xaxis: { title: "OTU ID'S"},
    };

    Plotly.newPlot('bubble', bubbledata, layout);
   

    // @TODO: Build a Pie Chart
    d3.json(plotData).then(function(data) {  
      var pievalues = data.sample_values.slice(0,10);
      var pielabels = data.otu_ids.slice(0,10);
      var piehover = data.otu_labels.slice(0,10);

      var data = [{
        values: pievalues,
        labels: pielabels,
        hovertext: piehover,
        type: "pie"
      }];

      Plotly.newPlot("pie", data);
    });
  });   
}


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();