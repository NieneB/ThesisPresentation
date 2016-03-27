Reveal.addEventListener( 'myslide1', function(){


  console.log( '"customevent" has fired' );

  
//Width and height
var w = 200;
var h = 100;
console.log(w)
console.log(h)
var map = d3.select("#map");
                    .append("svg")
                    .attr("width", 500)
                    .attr("height", 500)
                    .attr("fill", "red");
// var graph = d3.select('#graph')
//                     .append('svg')
//                     .attr('width', w)
//                     .attr('heigth', h)

//Load in GeoJSON data
function getRoute(){
    d3.json("bikeRoute.geojson", function(error, route) {
             if (error) return console.error(error);
             updateZoom(route);
    });
};

//Line functions
var width = 500;
var height = 250;
var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S.%L").parse

var x = d3.time.scale().range([0, width]);

var y = d3.scale.linear().range([height, 0]);

var lineFunction = d3.svg.line()
  .x( function(d){
    return x(d.properties.time)})
  .y( function(d){
    return y(d.properties.z)})
  .interpolate('basis');  

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(100);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(100);




// Drawing all
function updateZoom(route){
    console.log(route.features)

    //setting projection variables
    var aantal = parseInt(route.features.length/2); 
    var center = d3.geo.centroid(route);
    // var center = route.features[aantal].geometry.coordinates;
    console.log('center : ', center);
    var scale = 150;
    var offset = [w/2, h/2];
    
    //setting projection
    var projection = d3.geo.mercator()
          .scale(scale)
          .center(center)
          .translate(offset);

    //Create the Path
    var path = d3.geo.path().projection(projection);

    //Redefine the projection
    var bound = path.bounds(route);
    console.log('bound : ', bound)
    scale = 150 / Math.max(
        (bound[1][0] - bound[0][0]) / w,
        (bound[1][1] - bound[0][1]) / h
    );
    console.log('scale : ', scale)
    offset = [w - (bound[0][0] + bound[1][0])/2, h - (bound[0][1] + bound[1][1])/2];
    console.log('offset : ', offset)
    
    // new projection
    projection = d3.geo.mercator().center(center)
        .scale(scale).translate(offset);
    path = path.projection(projection);
    
    //making the map
    map.selectAll("circle")
                   .data(route.features)
                   .enter()
                   .append("circle")
                   .attr("d", path)
                   .attr("cx",function(d){
                      return projection(d.geometry.coordinates)[0];
                    })
                    .attr("cy", function(f){
                        return projection(f.geometry.coordinates)[1];
                    })
                  .attr("r", '2px')
                  .attr('class', 'point')
                  .style("fill", function(d){
                    return d.properties.speed;
                  })
                  .style('stroke', null)
                  .style('opacity', '0.75')
                  .on('mouseover', function(){
                    d3.select(this).transition()
                    .attr('r', 50)
                    .text('hallo world');
                  })
                  .on('mouseout', function(){
                    d3.select(this).transition()
                    .attr('r', 2)
                  }); 
    
    //making the graph
    var data = route.features
    data.forEach(function(d){
        d.properties.time = parseDate(d.properties.time);
      });

    console.log('data : ', data)

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.time; }));
    y.domain([0, d3.max(data, function(d) { return d.z; })]);

    graph.append('path')
      .attr('class' , 'line')
      .attr('d', lineFunction(data))
      .attr("stroke", "red")
      .attr("stroke-width", 1);

    // Add the X Axis
    graph.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    // Add the Y Axis
    graph.append("g")
        .attr("class", "y axis")
        .call(yAxis);
};



    getRoute()

} );


