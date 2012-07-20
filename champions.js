function drawChampionsPlot (league) {
  var width = 900;
  var height = 500;
  var padding = 30;
  var color = d3.scale.category20 ();
  var treemap = d3.layout.treemap()
    .size([width, height])
    .sticky(true)
    .value(function(d) { return d.crowns.length; });

  d3.select("#champions").select("div").remove();
  var div = d3.select("#champions").append("div")
    .style("position", "relative")
    .style("width", width + "px")
    .style("height", height + "px");
  var csv = league + ".csv";
  var country = league.toUpperCase();
  d3.csv (csv, function (data) {
    var champs = getUniques(data.map(function(d) {
      return d.Champions;
    }));

    var json = {
      "name": country,
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

function wireUpEvents() {
  d3.select("#leagueselect").on("change", function() {
    var dropdown = d3.select("#leagueselect");
    var league = dropdown.node().options[dropdown.node().selectedIndex].value;
    drawChampionsPlot(league);
  });
}
