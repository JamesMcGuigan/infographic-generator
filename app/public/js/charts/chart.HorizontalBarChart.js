// @ref http://bocoup.com/weblog/introducing-d3-chart/
d3.chart("BaseChart").extend("BarChart", {
    initialize : function() {
        this.xScale = d3.scale.linear();

        // setup some defaults
        this._width  = this._width  || this.base.attr("width")  || 200;
        this._height = this._height || this.base.attr("height") || 100;
        this._radius = this._radius || 5;

        // create a container in which the circles will live.
        var baseLayer = this.base.append("g").classed("circles", true);

        // add our circle layer
        this.layer("labels", baseLayer, {
            // prepare your data for data binding, and return
            // the selection+data call
            dataBind: function(data) {
                var chart = this.chart();

                // assuming our data is sorted, set the domain of the
                // scale we're working with.
                chart.xScale.domain([data[0], data[data.length-1]]);

                return this.selectAll("text").data(data);
            },

            // append the actual expected elements and set the
            // appropriate attributes that don't have to do with
            // data!
            insert: function() {
                var chart = this.chart();

                // append circles, set their radius to our fixed
                // chart radius, and set the height to the middle
                // of the chart.
                return this.append("text")
                    .attr("x",     0)
                    .attr("color", "white");
            },
            events: {
                // define what happens on these lifecycle events.
                // in our case, set the cx property of each circle
                // to the correct position based on our scale.
                enter: function() {
                    var chart = this.chart();
                    return this.text(function(d) {
                        return d.label;
                    });
                }
            }
        });
    }
    // configuration functions omitted for brevity
});