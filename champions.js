function drawChampionsPlot (league, beginning, end) {
  var width = 900;
  var height = 500;
  var padding = 30;
  var colorScale = d3.scale.category20 ();
  var colors = ["#1f77b4" ,"#aec7e8" ,"#ff7f0e" ,"#ffbb78" ,"#2ca02c" ,"#98df8a"
                ,"#d62728" ,"#ff9896" ,"#9467bd" ,"#c5b0d5" ,"#8c564b" ,"#c49c94"
                ,"#e377c2" ,"#f7b6d2" ,"#7f7f7f" ,"#c7c7c7" ,"#bcbd22" ,"#dbdb8d"
                ,"#17becf" ,"#9edae5" ,"#393b79" ,"#5254a3" ,"#6b6ecf" ,"#9c9ede"
                ,"#637939" ,"#8ca252" ,"#b5cf6b" ,"#cedb9c" ,"#8c6d31" ,"#bd9e39"
                ,"#e7ba52" ,"#e7cb94" ,"#843c39" ,"#ad494a" ,"#d6616b" ,"#e7969c"
                ,"#7b4173" ,"#a55194" ,"#ce6dbd" ,"#de9ed6"];

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
    var years = data.map(function(d) {
      return awardYear(d.Season);
    });
    var beginYear = +d3.min(years);
    var endYear = +d3.max(years);
    beginning = beginning ? beginning : beginYear;
    end = end ? end : endYear;

    data = data.filter(function(d) {
      var year = awardYear(d.Season);
      return year >= +beginning && year <= +end;
    });

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
      .style("background", function(d, i) { return colors [i];})
      .call(cell)
      .text(function(d) { return d.children ? null : d.name + " (" + d.crowns.length + ")"; });
  });

  function awardYear(season) {
    splits = season.split("-");
    if(splits.length == 1) {
      return +splits[0];
    } else {
      return +splits[0] + 1;
    }
  }

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
    updateChampionsPlotForLeague();
  });
}

function updateChampionsPlotForLeague () {
  var dropdown = d3.select("#leagueselect");
  var league = dropdown.node().options[dropdown.node().selectedIndex].value;

  drawChampionsPlot (league, null, null);
}

function updateChampionsPlot() {
  var dropdown = d3.select("#leagueselect");
  var league = dropdown.node().options[dropdown.node().selectedIndex].value;
  var minVal = jQuery( "#slider-range" ).slider( "values", 0 );
  var maxVal = jQuery( "#slider-range" ).slider( "values", 1 );
  drawChampionsPlot(league, minVal, maxVal);
  jQuery( "#era" ).val(minVal +
                       " - " + maxVal);
}

function updateSlider (newRange) {
  jQuery ("#slider-range").slider ("option", "min", newRange.beginYear - 5);
  jQuery ("#slider-range").slider ("option", "max", newRange.endYear + 5);
  jQuery ("#slider-range").slider ("option", "values", [newRange.beginYear, newRange.endYear]);
  jQuery( "#era" ).val(newRange.beginYear +
                       " - " + newRange.endYear);
}

function drawSlider(divId, min, max) {
  jQuery(function() {
    jQuery( "#slider-range" ).slider({
      range: true,
      min: min - 5,
      max: max + 5,
      values: [min, max],
      slide: function( event, ui ) {
        updateChampionsPlot();
      }
    });
  });
  jQuery( "#era" ).val(min +
                       " - " + max);

}


function drawEvrything() {
  wireUpEvents();
  drawSlider ("slider", 1888, 2012);
  drawChampionsPlot("england", 1888, 2012);
}
