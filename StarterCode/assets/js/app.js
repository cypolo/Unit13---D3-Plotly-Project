// D3 Animated Scatter Plotly

// Part I. Initiate the chart interface

// Set up the dimensions
var margin = {top: 20, bottom: 100, left: 80, right: 50};
var svgWidth = 800
var svgHeight = 700
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var x = "poverty"
var y = "healthcareLow"

// create an svg element and variables
var svg = d3.select("#scatter")
    .append('svg')
    .attr("width", svgHeight)
    .attr("height", svgWidth)
    .attr("class", "chart");

// appengind a chart group
var chartGroup = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

chartBuilder(x, y);



// Part II. Build teh Plot Charts

function chartBuilder(x, y) { 
    // Read data from csv file
    d3.csv("assets/data/data.csv").then((Data) => {
    // Load data to x & y
        Data.forEach((data) => {
            data[x] = +data[x];
            data[y] = +data[y];
        });
    
    // Define x axis and y axis range
        var xExtent = d3.extent(Data, d => d[x]);
        var xRange = xExtent[1] - xExtent[0];
        
        var yExtent = d3.extent(Data, d => d[y]);
        var yRange = yExtent[1] - yExtent[0];

        var xScale = d3.scaleLinear()
            .domain([xExtent[0] - (xRange * 0.05), xExtent[1] + (xRange * 0.05)])
            .range([0, width]);
        var yScale = d3.scaleLinear()
            .domain([yExtent[0] - (yRange * 0.05), yExtent[1] + (yRange * 0.05)])
            .range([height, 0]);

        var bottomAxis = d3.axisBottom(xScale);
        var leftAxis = d3.axisLeft(yScale);

        // append a new group to the chartGroup, call x axis & y axis
        chartGroup.append("g")
            .attr("class", "x")
            .attr("transform", "translate(0," + height + ")")
            .call(bottomAxis);

        chartGroup.append("g")
            .attr("class", "y")
            .call(leftAxis);
        var radius = 10

        tip = d3.tip()
            .attr('class', 'd3-tip')
            .html((d) => { return(d.state + '<br>' + x + ": " + d[x] + "<br>" + y + ": " + d[y]) });
        // vis.call(tip)
        chartGroup.append("g")
            .attr("class", "tip")
            .call(tip);

        chartGroup.selectAll("circle")
            .data(Data)
            .enter()
            .append("text")
            .attr("class", "chartText")
            .attr("x", d => xScale(d[x]))
            .attr("y", d => yScale(d[y]) + radius/2)
            .text(d => d.abbr)
            .attr("font-family", "sans-serif")
            .attr("font-size", "9px")
            .attr("opacity", 0.8)
            .attr("fill","black")
            .attr("text-anchor", "middle");
        
        chartGroup.selectAll("circle")
            .data(Data)
            .enter()
            .append('circle')
            .attr("cx", d => xScale(d[x]))
            .attr("cy", d => yScale(d[y]))
            .attr("r", radius)
            .attr("fill", "blue")
            .attr("opacity", 0.2)
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);
        

        // Appending x axis labels
        var xAxisLabels = chartGroup.append("g")
            .attr("class","xAxisLabels")
            // 1. Poverty
        xAxisLabels
            .append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
            .attr("id", "poverty")
            .attr("text-anchor", "middle")
            .attr("font-size", "16px")
            .attr("fill", "black")
            .text("In Poverty (%)");
            // 2. Age
        xAxisLabels
            .append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.top + 40})`)
            .attr("id", "age")
            .attr("text-anchor", "middle")
            .attr("font-size", "16px")
            .attr("fill", "black")
            .text("Age (Median)")
            // 3. Income
        xAxisLabels
            .append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.top + 60})`)
            .attr("id", "income")
            .attr("text-anchor", "middle")
            .attr("font-size", "16px")
            .attr("fill", "black")
            .text("Household Income (Median)");

        // Appending y axis labels
        var yAxisLabels = chartGroup.append("g")
            .attr("class", "yAxisLabels")
            // 1. Obesity
        yAxisLabels
            .append("text")
            .attr("transform", "translate(" + (-margin.left / 2 - 30) + "," + (height / 2) +")"+"rotate("+270+")")
            .attr("id", "obesity")
            .attr("text-anchor", "middle")
            .attr("font-size", "16px")
            .attr("fill", "black")
            .text("Obese (%)");
            // 2. Smokes
        yAxisLabels
            .append("text")
            .attr("transform", "translate(" + (-margin.left / 2 - 10) + "," + (height / 2) +")"+"rotate("+270+")")
            .attr("id", "smokes")
            .attr("text-anchor", "middle")
            .attr("font-size", "16px")
            .attr("fill", "black")
            .text("Smokes (%)");
            // 3. Lacks Healthcare
        yAxisLabels
            .append("text")
            .attr("transform", "translate(" + (-margin.left / 2 + 10) + "," + (height / 2) +")"+"rotate("+270+")")
            .attr("id", "healthcare")
            .attr("text-anchor", "middle")
            .attr("font-size", "16px")
            .attr("fill", "black")
            .text("Lacks Healthcare (%)");
        
    // Design animations for mouse moves
        // x-axis events listeners
        d3.select("#poverty").on("mouseover", function() {
            x = "poverty";
            xOpacityReset();
            selectionOpacity(this);
            chartAnimator(x,y);    
        });
        d3.select("#age").on("mouseover", function() {
            x = "age";
            xOpacityReset();
            selectionOpacity(this);
            chartAnimator(x,y);
        });
        d3.select("#income").on("mouseover", function() {
            x = "income";
            xOpacityReset();
            selectionOpacity(this);
            chartAnimator(x,y);
        });

        // y-axis events listeners
        d3.select("#obesity").on("mouseover", function() {
            y = "obesity";
            yOpacityReset();
            selectionOpacity(this);
            chartAnimator(x,y);    
        });

        d3.select("#smokes").on("mouseover", function() {
            y = "smokes";
            yOpacityReset();
            selectionOpacity(this);
            chartAnimator(x,y);
        });

        d3.select("#healthcare").on("mouseover", function() {
            y = "healthcare";
            yOpacityReset();
            selectionOpacity(this);
            chartAnimator(x,y);
        });

        // Define OpacityReset for x axis and y axis
        function xOpacityReset() {
            d3.select(".xAxisLabels")
                .selectAll("text")
                .transition()
                .duration(1000)
                .attr("opacity", 0.2)
            }   

        function yOpacityReset() {
            d3.select(".yAxisLabels")
                .selectAll("text")
                .transition()
                .duration(1000)
                .attr("opacity", 0.2)
            }   
        
        function selectionOpacity(thisThing) {
            d3.select(thisThing)
                .transition()
                .duration(1000)
                .attr("opacity", 1);
        }

    });
}



// Part III. Add Animation Effects
function chartAnimator(x, y) {  
    d3.csv("assets/data/data.csv").then((Data) => {
        Data.forEach((data) => {
            data[x] = +data[x];
            data[y] = +data[y];
        });
        
    // Define x axis and y axis range
        var xExtent = d3.extent(Data, d => d[x]);
        var xRange = xExtent[1] - xExtent[0];
        var yExtent = d3.extent(Data, d => d[y]);
        var yRange = yExtent[1] - yExtent[0];

        var xScale = d3.scaleLinear()
            .domain([xExtent[0] - (xRange * 0.05), xExtent[1] + (xRange * 0.05)])
            .range([0, width]);
        var yScale = d3.scaleLinear()
            .domain([yExtent[0] - (yRange * 0.05), yExtent[1] + (yRange * 0.05)])
            .range([height, 0]);

        var bottomAxis = d3.axisBottom(xScale);
        var leftAxis = d3.axisLeft(yScale);

        var duration = 1000
        var radius = 10

        chartGroup.select(".x")
            .transition()
            .duration(duration)
            .call(bottomAxis);
        chartGroup.select(".y")
            .transition()
            .duration(duration)
            .call(leftAxis);  
        
        chartGroup.selectAll("circle")
            .transition()
            .duration(duration)
            .attr("cx", d => xScale(d[x]))
            .attr("cy", d => yScale(d[y]));

        chartGroup.selectAll(".chartText")
            .transition()
            .duration(duration)
            .attr("x", d => xScale(d[x]))
            .attr("y", d => yScale(d[y]) + radius/2);

        tip = d3.tip()
            .attr('class', 'd3-tip')
            .html((d) => { return(d.state + '<br>' + x + ": " + d[x] + "<br>" + y + ": " + d[y]) });
        // vis.call(tip)
        chartGroup.append("g")
            .attr("class", "tip")
            .call(tip);
    });
}
