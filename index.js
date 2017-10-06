// margin and radius variabel aanmaken
var margin = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
    },
    width = 600 - margin.right - margin.left,
    height = 600 - margin.top - margin.bottom,
    radius = width / 2;

// variabel aanmaken voor de kleuren met een array van de kleurenrange
var color = d3.scaleOrdinal()
    .range(["#660000", "#661a00", "#663300", "#664d00", "#666600", "#4d6600", "	#336600", "#1a6600", "#006600", "#00661a", "#006633", "#00664d", "#006666", "#004d66", "#003366", "	#001a66", "#000066", "#1a0066", "#330066", "#4d0066", "#660066", "#66004d", "#660033"]);


// maakt een arc aan met een radius
var arc = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 70);

// maakt de pie zelf aan met de gegevens
var pie = d3.pie()
    .sort(null) // niet sorteren
    .value(function (d) {
        return d.speakers;
    });

// svg aanmaken 
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// data importeren 
d3.tsv("index.tsv", function (error, data) {
    if (error) {
        throw error;
    }

    // parse the data
    // maakt van speakers een getal en van language een woord
    data.forEach(function (d) {
        d.speakers = +d.speakers;
        d.language = d.language;
    });

    // grouped alle arcs en geeft ze een class
    // voegt een mouseover waarbij de id tooltip een bepaalde style krijgt
    var g = svg.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", arc)
        .on("mouseover", function (d) {
            d3.select("#tooltip")
                .style("margin", "auto")
                .style("left", 0)
                .style("right", 0)
                .style("top", 400 + "px")
                .style("opacity", 1)
                .select("#spreker")
                .text(d.data.language + " " + d.data.speakers);
            d3.select(this)
                .style("color", "white")
                .style("opacity", 0.3)

        })
        .on("mouseout", function () {
            // haal de tooltip weg
            d3.select("#tooltip")
                .style("opacity", 0);
            d3.select(this)
                .style("color", "black")
                .style("opacity", 1);
        })


    // append de path en geef ze een color en transition met een function pieTrans
    g.append("path")
        .attr("d", arc)
        .style("fill", function (d) {
            return color(d.data.language);
        })
        //transitie
        .transition()
        .ease(d3.easeLinear)
        .duration(2000)
        .attrTween("d", pieTrans);
});

// laten bewegen van de chart
function pieTrans(b) {
    b.innerRadius = 0;
    var i = d3.interpolate({
        startAngle: 0,
        endAngle: 0
    }, b);
    return function (t) {
        return arc(i(t));
    };
}