function drawChampionsPlot () {
  var width = 1000;
  var height = 500;
  var padding = 30;
  var color = d3.scale.category20 ();
  var treemap = d3.layout.treemap()
    .size([width, height])
    .sticky(true)
    .value(function(d) { return d.crowns.length; });

  var div = d3.select("#champions").append("div")
    .style("position", "relative")
    .style("width", width + "px")
    .style("height", height + "px");

  d3.csv ("france.csv", function (data) {
    var champs = getUniques(data.map(function(d) {
      return d.Champions;
    }));

    var json = {
      "name": "France",
      "children": []
    };

    champs.forEach(function(c) {
      crowns = data.filter(function(d) {
        return d.Champions == c;
      });
      json.children.push({
        "name": c,
        "crowns": crowns
      });
    });

    div.data([json]).selectAll("div")
      .data(treemap.nodes)
      .enter().append("div")
      .attr("class", "cell")
      .style("background", function(d) { return color(d.name);})
      .call(cell)
      .text(function(d) { return d.children ? null : d.name + " (" + d.crowns.length + ")"; });
  });

  function cell() {
    this
      .style("left", function(d) { return d.x + "px"; })
      .style("top", function(d) { return d.y + "px"; })
      .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
      .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
  }
}

function getUniques (arr) {
  var unique = [];
  arr.forEach (function (elem) {
    if (unique.indexOf (elem) == -1) {
      unique.push (elem);
    }
  });
  return unique;
}
