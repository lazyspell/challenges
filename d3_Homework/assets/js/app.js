var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")

  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("assets/data/data.csv").then(function(incomeData){
    
    incomeData.forEach(function(data){
        data.id = +data.id;
//        data.abbr = +data.abbr;
        data.poverty = +data.poverty;
		data.povertyMoe = +data.povertyMoe;
		data.age = +data.age;
		data.ageMoe = +data.ageMoe;
		data.income = +data.income;
		data.incomeMoe = +data.incomeMoe;
		data.healthcare = +data.healthcare;
		data.healthcareLow = +data.healthcareLow;
		data.healthcareHigh = +data.healthcareHigh;
		data.obesity = +data.obesity;
		data.obesityLow = +data.obesityLow;
		data.obesityHigh = +data.obesityHigh;
		data.smokes = +data.smokes;
		data.smokesLow = +data.smokesLow;
		data.smokesHigh = +data.smokesHigh;
    });
    var xLinearScale = d3.scaleLinear()
        .domain([8, d3.max(incomeData, d => d.poverty)])
        .range([8, width]);
    
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(incomeData, d => d.healthcare)])
        .range([height, 0]);
    
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);
    
    
    var circlesGroup = chartGroup.selectAll("g")
        .data(incomeData)
        .enter()
        .append("circle")
        .attr("value","ABC")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "15")
        .attr("fill", "blue")
        .attr("opacity", "2");
    
    
    
      circlesGroup.append("text")
        .text(function(d){return d.abbr;})
        .attr("x",  d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))
        .attr("z-index",-1)
        .attr("position","relative");
    

//    Initialize Tooltip
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d){
            return(`${d.abbr}<br> Poverty: ${d.poverty}%<br>Healthcare: ${d.healthcare}%`);
            });
    
//    Create the tooltip in chartGroup
    chartGroup.call(toolTip);
    
    circlesGroup.on("mouseover", function(data){
        toolTip.show(data,this);
    })
        .on("mouseout", function(data,index){
        toolTip.hide(data);
    });
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");
    
    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");
  }).catch(function(error) {
    console.log(error);
  });



