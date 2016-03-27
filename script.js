
Reveal.addEventListener( 'myslide1', function() {
  console.log( '"customevent" has fired' );

  var w = 200;
  var h = 100;
  console.log(w);
  console.log(h);


  d3.select('.testrect').append('rect')
    .attr('width', w)
    .attr('height', h)
    .attr("class", "bubble")
    .style('fill', 'red');


} );

Reveal.addEventListener( 'myslide2', function() {
  console.log( '"customevent" has fired' );


      var data = [44, 28, 15, 16, 23, 5];
      var width = 420,
          barHeight = 20;

      var x = d3.scale.linear()
          .domain([0, d3.max(data)])
          .range([0, width]);

      var chart = d3.select(".chart")
          .attr("width", width)
          .attr("height", barHeight * data.length);

      var bar = chart.selectAll("g")
          .data(data)
          .enter().append("g")
          .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });
      
      bar.append("rect")
          .attr("width", x)
          .attr("height", barHeight - 1);
      
      bar.append("text")
          .attr("x", function(d) { return x(d) - 3; })
          .attr("y", barHeight / 2)
          .attr("dy", ".35em")
          .text(function(d) { return d; });
} );

Reveal.addEventListener('openingslide', function(){
  console.log( '"customevent" has fired' );
//---Code below will show Bubble Charts on the secon Slide -------
      
      var diameter = 560,
          format = d3.format(",d"),
          color = d3.scale.category10();

      var bubble = d3.layout.pack()
          .sort(null)
          .size([diameter, diameter])
          .padding(1.5);

      var svg = d3.select(".bubleCharts")
          .attr("width", diameter)
          .attr("height", diameter)
          .attr("class", "bubble");

      d3.json("flare.json", function(error, root) {
        var node = svg.selectAll(".node")
            .data(bubble.nodes(classes(root))
            .filter(function(d) { return !d.children; }))
          .enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
        node.append("title")
            .text(function(d) { return d.className + ": " + format(d.value); });
        node.append("circle")
            .attr("r", function(d) { return d.r; })
            .style("fill", function(d) { return color(d.packageName); });
        node.append("text")
            .attr("dy", ".3em")
            .style("text-anchor", "middle")
            .text(function(d) { return d.className.substring(0, d.r / 3); });
      });
// Returns a flattened hierarchy containing all leaf nodes under the root.
      function classes(root) {
        var classes = [];
        function recurse(name, node) {
          if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
          else classes.push({packageName: name, className: node.name, value: node.size});
        }
        recurse(null, root);
        return {children: classes};
      }
      d3.select(self.frameElement).style("height", diameter + "px")
;
});