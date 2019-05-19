
// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 560;

// Define the chart's margins as an object
var chartMargin = {
  top: 30,
  right: 40,
  bottom: 120,
  left: 200
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;


// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`)
  .attr('width', chartWidth)
  .attr('height', chartHeight)
  .attr('class', 'main');


// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare"

// function used for updating x-scale var upon click on axis label
function xScale(Data, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(Data, d => d[chosenXAxis]) * 0.8,
        d3.max(Data, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, chartWidth]);

    return xLinearScale;
}

// function used for updating x-scale var upon click on axis label
function yScale(Data, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(Data, d => d[chosenYAxis]) * 0.8,
      d3.max(Data, d => d[chosenYAxis]) * 1.2
    ])
    .range([chartHeight, 0]);

  return yLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXaxis, newYScale, chosenYaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]))

  return circlesGroup;
}

// function used for updating state labels with a transition 
function renderLabels(circleLabels, newXScale, chosenXaxis, newYScale, chosenYaxis) {

  circleLabels.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]))
    .attr("y", d => newYScale(d[chosenYAxis])+3)

  return circleLabels;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-8, 0])
    .html(function(d) {return (`${d[chosenXAxis]}`)});

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}



d3.csv('assets/data/data.csv')
  .then(function(data) {
      // data is now whole data set
      console.log(data)
      
      // Step 1: Parse Data/Cast as numbers
      data.forEach(function(data){
        //convert each string to data type integer
        data.poverty = +data.poverty
        data.povertyMoe = +data.povertyMoe
        data.age = +data.age
        data.ageMoe = +data.ageMoe
        data.income = +data.income
        data.incomeMoe = +data.incomeMoe
        data.healthcare = +data.healthcare
        data.healthcareLow = +data.healthcareLow
        data.healthcareHigh = +data.healthcareHigh
        data.obesity = +data.obesity
        data.obesityLow = +data.obesityLow
        data.obesityHigh = +data.obesityHigh
        data.smokes = +data.smokes
        data.smokesLow = +data.smokesLow
        data.smokesHigh = +data.smokesHigh
      });

      //scaler for X var
      var xLinearScale = xScale(data, chosenXAxis)
      var yLinearScale = yScale(data, chosenYAxis)
      
      // Step 3: Create axis functions   
      var bottomAxis = d3.axisBottom(xLinearScale);
      var leftAxis = d3.axisLeft(yLinearScale);

     
      // Step 4: Append Axes to the chart
      var xAxis = chartGroup.append("g")
        .attr("transform", "translate(0, "+ chartHeight +")")
        .call(bottomAxis)
      var yAxis = chartGroup.append('g')
        .call(leftAxis)
        
      // Create group for x- axis labels
      var labelsGroupX = chartGroup.append("g")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);
      
      var povertyLabel = labelsGroupX.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .attr("font-size", 20)
        .attr("font-weight", "bold")
        .text("In Poverty (%)");

      var ageLabel = labelsGroupX.append("text")
        .attr("x", 0)
        .attr("y", 50)
        .attr("value", "age") // value to grab for event listener
        .classed("inactive", true)
        .attr("font-size", 20)
        .attr("font-weight", "bold")
        .text("Age(Median)");

      var incomeLabel = labelsGroupX.append("text")
        .attr("x", 0)
        .attr("y", 80)
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .attr("font-size", 20)
        .attr("font-weight", "bold")
        .text("Household Income(Median)");

      // Create group for  y- axis labels
      var labelsGroupY = chartGroup.append("g")
        .attr("transform", "rotate(-90)");
      
      var healthcareLabel = labelsGroupY.append("text")
        .attr("x", -190)
        .attr("y", -35)
        .attr("value", "healthcare") // value to grab for event listener
        .classed("active", true)
        .classed("axis-text", true)
        .text("Lacks Healthcare(%)");

      var smokesLabel = labelsGroupY.append("text")
        .attr("x", -190)
        .attr("y", -60)
        .attr("value", "smokes") // value to grab for event listener
        .classed("inactive", true)
        .attr("font-size", 20)
        .attr("font-weight", "bold")
        .text("Smokes(%)");

      var obeseLabel = labelsGroupY.append("text")
        .attr("x", -190)
        .attr("y", -85)
        .attr("value", "obesity") // value to grab for event listener
        .classed("inactive", true)
        .attr("font-size", 20)
        .attr("font-weight", "bold")
        .text("Obese(%)");


      //tooltip description
      var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-8, 0])
      .html(function(d) {return (`${d.state}<br>${chosenXAxis}: ${d[chosenXAxis]}<br>${chosenYAxis}: ${d[chosenYAxis]}`)});
      chartGroup.call(toolTip);

      // Step 5: Create Circles
      var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", 12)
        .attr("fill", "steelblue")
				.attr("fill-opacity", .7)
				.on('mouseover', toolTip.show)
        .on('mouseout', toolTip.hide);
      
      // Appending a label to each data point
			var circleLabels = chartGroup.append("text")
				.style("text-anchor", "middle")
				.selectAll("circle")
				.data(data)
				.enter()
				.append("tspan")
				.attr("x", d => xLinearScale(d.poverty))
				.attr("y", d => yLinearScale(d.healthcare)+3)
				.text(d => d.abbr)
				.attr("font-size", 12)
				.attr("fill", "black")
        .attr("font-weight", "bold")
        

      // x axis labels event listener
      labelsGroupX.selectAll("text")
      .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {

          // replaces chosenXAxis with value
          chosenXAxis = value;

          // functions here found above csv import
          // updates x scale for new data
          xLinearScale = xScale(data, chosenXAxis);

          // updates x axis with transition
          xAxis = renderXAxes(xLinearScale, xAxis);

          // updates circles with new x values
          circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

          circleLabels = renderLabels(circleLabels, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

          // // updates tooltips with new info
          //circlesGroup = updateToolTip(chosenXAxis, chosenYaxis, circlesGroup);

          // changes classes to change bold text
          if (chosenXAxis === "poverty") {
            povertyLabel
              .classed("active", true)
              .classed("inactive", false);
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenXAxis === "age") {
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
            ageLabel
              .classed("active", true)
              .classed("inactive", false);
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else{
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            incomeLabel
              .classed("active", true)
              .classed("inactive", false);
          }
        }
      });

      // y axis labels event listener
      labelsGroupY.selectAll("text")
      .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenYAxis) {

          // replaces chosenYAxis with value
          chosenYAxis = value;

          // functions here found above csv import
          // updates y scale for new data
          yLinearScale = yScale(data, chosenYAxis);

          // updates y axis with transition
          yAxis = renderYAxes(yLinearScale, yAxis);

          // updates circles with new y values
          circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

          circleLabels = renderLabels(circleLabels, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

          // changes classes to change bold text
          if (chosenYAxis === "healthcare") {
            healthcareLabel
              .classed("active", true)
              .classed("inactive", false);
            smokesLabel
              .classed("active", false)
              .classed("inactive", true);
            obeseLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenYAxis === "smokes") {
            healthcareLabel
              .classed("active", false)
              .classed("inactive", true);
            smokesLabel
              .classed("active", true)
              .classed("inactive", false);
            obeseLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else{
            healthcareLabel
              .classed("active", false)
              .classed("inactive", true);
            smokesLabel
              .classed("active", false)
              .classed("inactive", true);
            obeseLabel
              .classed("active", true)
              .classed("inactive", false);
          }
        }

      });

});