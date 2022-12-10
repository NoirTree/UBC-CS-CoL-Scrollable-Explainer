// import * as d3 from "d3";
// the above does not work so use workaround
// mentioned here: https://github.com/d3/d3/issues/3262#issuecomment-383104813
// import * as d3selection from "d3-selection";
// import "d3-transition";
// [NEW] actually, we don't need to import d3 here as long as it is included in the "index.html"

// to use it, add
// <svg id="overlapBar" width="900" height="500"></svg>
// <script src="src/overlapBar.js"></script>

// the width and height of bar chart should be smaller than the svg frame
// var margin = 200;

// var svg = d3.select("#overlapBar"),
//   width = svg.attr("width") - margin * 2,
//   height = svg.attr("height") - margin;

/** new */
// var frameWidth = d3.select(".scatterplot-Container #graph").node().offsetWidth;
// var frameHeight = d3.select(".scatterplot-Container #graph").node().offsetWidth;

var frameWidth = 460,
  frameHeight = 520;

var margin = { top: 10, right: 80, bottom: 140, left: 30 },
  width = frameWidth - margin.left - margin.right, // real picture width
  height = frameHeight - margin.top - margin.bottom; // real picture height
var Opacity = 0.5,
  xMoving = 120,
  yMoving = 100;

var svg = d3
  .select(".overlapBar-Container #graph")
  .html("")
  .append("svg")
  .attr("id", "overlapBarSVG")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg
  .append("text")
  .attr("transform", `translate(50,0)`)
  .attr("x", 50)
  .attr("y", 50)
  .attr("font-size", "24px")
  //   .attr("font-family", "Helvetica Neue")
  .text("CS PhD Funding vs CoL");

var xScale = d3.scaleLinear().range([0, width]);
var yScale = d3.scaleBand().range([0, height]).padding(0.4); // upside-down; set padding among bars

var g = svg
  .append("g")
  .attr("class", "funding")
  .attr("transform", `translate(${xMoving},${yMoving})`);
var gReverse = svg
  .append("g")
  .attr("class", "col")
  .attr("transform", `translate(${xMoving},${yMoving})`);

d3.csv("/data/phdFunding.csv", function (error, data) {
  if (error) {
    console.warn(error);
  }

  // set scale.domain
  // x domain is quantitative
  xScale.domain([
    0,
    d3.max(data, function (d) {
      return d.Yearly_funding_kCAD;
    })
  ]);
  // y domain is categorical (band in d3)
  yScale.domain(
    data.map(function (d) {
      return d.University;
    })
  );

  // put the axis on the plot
  // x axis
  var xAxis = g
    .append("g")
    .call(d3.axisTop(xScale))
    .append("text")
    .attr("x", width + 7)
    .attr("text-anchor", "start")
    //   .attr("font-family", "calibri")
    .style("fill", "black")
    .style("font-size", 10)
    .text("kCAD"); // label

  var yAxis = g
    .append("g")
    .attr("class", "yAxis")
    .call(d3.axisLeft(yScale))
    .selectAll("text")
    // .attr("class", "yAxisText")
    .attr("dx", -6)
    .style("text-anchor", "end");

  // add bar
  g.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "fundingBar")
    .attr("y", function (d) {
      return yScale(d.University);
    })
    .attr("width", function (d) {
      return xScale(d.Yearly_funding_kCAD);
    })
    .attr("height", yScale.bandwidth())
    .attr("opacity", Opacity);

  // add reverse bar
  gReverse
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "colBar")
    .attr("x", function (d) {
      return xScale(d.Yearly_funding_kCAD);
    })
    .attr("y", function (d) {
      return yScale(d.University);
    })
    .attr("height", yScale.bandwidth())
    .attr("opacity", Opacity);

  var barTypeLst = ["Funding", "Cost of Living"];
  // // Add color legend
  svg
    .append("g")
    .attr("class", "colorLegend")
    .selectAll(".colorLegendText")
    .data(barTypeLst)
    .enter()
    .append("text")
    .attr("class", "colorLegendText")
    .attr("x", 0)
    .attr("y", function (d, i) {
      return 70 + i * 20;
    })
    .text(function (d) {
      return d;
    })
    .style("fill", "black")
    .style("font-size", 13);

  svg
    .select("g.colorLegend")
    .selectAll(".colorLegendShape")
    .data(barTypeLst)
    .enter()
    .append("circle")
    .attr("class", "colorLegendShape")
    .attr("r", 4)
    .style("fill", function (d) {
      if (d == "Funding") {
        return "steelblue";
      } else {
        return "orangered";
      }
    })
    .attr("transform", function (d, i) {
      return `translate(-10, ${65 + i * 20})`;
    });
});

export function showReverseBar() {
  d3.csv("/data/phdFunding.csv", function (error, data) {
    if (error) {
      console.warn(error);
    }
    svg
      .selectAll(".colBar")
      .transition()
      .duration(2000)
      .attr("width", function (d) {
        return xScale(d.Yearly_col_kCAD);
      })
      .attr("x", function (d) {
        return xScale(d.Yearly_funding_kCAD - d.Yearly_col_kCAD);
      })
      .on("end", function (d) {
        return reOrderTransition("Yearly_left_kCAD", data);
      });
    // .on("end", function (d) {
    //   return reOrderTransition("Funding_col_ratio");
    // });
  });
}

export function reOrderTransition(attribute, data = null, ascending = true) {
  if (data == null) {
    d3.csv("/data/phdFunding.csv", function (error, data) {
      if (error) {
        console.warn(error);
      }
      reOrderLogic(attribute, data, ascending);
    });
  } else {
    reOrderLogic(attribute, data, ascending);
  }
}

function reOrderLogic(attribute, data, ascending) {
  if (ascending) {
    data.sort(function (a, b) {
      return d3.ascending(Number(a[attribute]), Number(b[attribute]));
    });
  } else {
    data.sort(function (a, b) {
      return d3.descending(Number(a[attribute]), Number(b[attribute]));
    });
  }
  // data.sort(function(a, b){
  //     return d3.ascending(Number(a[attribute]), Number(b[attribute]));
  // });

  yScale.domain(
    data.map(function (d) {
      return d.University;
    })
  );

  var reorderTransition = svg.transition().duration(2000);

  reorderTransition.selectAll(".fundingBar").attr("y", function (d) {
    return yScale(d.University);
  });

  reorderTransition.selectAll(".colBar").attr("y", function (d) {
    return yScale(d.University);
  });

  reorderTransition
    .selectAll(".yAxis")
    .call(d3.axisLeft(yScale))
    .selectAll("text")
    // .attr("class", "yAxisText")
    .attr("dx", -6)
    .style("text-anchor", "end");
}
