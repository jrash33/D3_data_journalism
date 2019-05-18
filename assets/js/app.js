
// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 560;

// Define the chart's margins as an object
var chartMargin = {
  top: 30,
  right: 40,
  bottom: 60,
  left: 100
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;


// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("body")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`)
  .attr('width', chartWidth)
  .attr('height', chartHeight)
  .attr('class', 'main');


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
      var x = d3.scaleLinear()
        .domain([d3.min(data, d => d.poverty)-2, d3.max(data, d => d.poverty)])
        .range([0, chartWidth]);

      // Step 2: Create scale functions
      var y = d3.scaleLinear()
        .domain([d3.min(data, d => d.healthcare)-2, d3.max(data, d => d.healthcare)])
        .range([chartHeight, 0 ]);
      
      // Step 3: Create axis functions   
      var xAxis = d3.axisBottom(x);
      var yAxis = d3.axisLeft(y);

     
      // Step 4: Append Axes to the chart
      chartGroup.append("g")
        .attr("transform", "translate(0, "+ chartHeight +")")
        .call(xAxis)
      chartGroup.append('g')
		.call(yAxis)
		
	  // create tool tip	
	  var tool_tip = d3.tip()
		.attr("class", "d3-tip")
		.offset([-8, 0])
		.html(function(d) { return (`${d.state}<br>Poverty (%): ${d.poverty}<br>healthcare (%): ${d.healthcare}`)});
	  chartGroup.call(tool_tip);

      // Step 5: Create Circles
      var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.poverty))
        .attr("cy", d => y(d.healthcare))
        .attr("r", 12)
        .attr("fill", "steelblue")
		.attr("fill-opacity", .7)
		.on('mouseover', tool_tip.show)
		.on('mouseout', tool_tip.hide);

	//   //create text for each circle
	//   chartGroup.selectAll("text")
	// 	.data(data)
	// 	.enter()
	// 	.append("text")
	// 	// Add your code below this line
	// 	.attr("x", d => x(d.poverty)-6)
	// 	.attr("y", d => y(d.healthcare)+3)
	// 	.text(d => d.abbr)
	// 	.attr("font-size", 10)
	// 	.attr("fill", "black")
	// 	.attr("font-weight", "bold")

      // Appending a label to each data point
      chartGroup.append("text")
        .style("text-anchor", "middle")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("tspan")
		.attr("x", d => x(d.poverty))
		.attr("y", d => y(d.healthcare)+3)
		.text(d => d.abbr)
		.attr("font-size", 12)
		.attr("fill", "black")
		.attr("font-weight", "bold")
	
	  // // Create axes labels
	  chartGroup.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 0 - chartMargin.left + 40)
		.attr("x", 0 - (chartHeight / 2) - chartMargin.bottom)
		.attr("dy", "1em")
		.attr("class", "axisText")
		.attr("font-size", 20)
		.attr("font-weight", "bold")
		.text("Lacks Healthcare (%)");
  
	  chartGroup.append("text")
		.attr("transform", `translate(${chartWidth/ 2 - chartMargin.right}, ${chartHeight + chartMargin.top + 20})`)
		.attr("class", "axisText")
		.attr("font-size", 20)
		.attr("font-weight", "bold")
		.text("In Poverty (%)");
        
   
});