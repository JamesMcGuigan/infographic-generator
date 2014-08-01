var async = require("async");

angular.module('infographicApp.directives')
    .run(['$http',function($http) {
        //$http({ method: 'GET', url: '/elements/infographic.html', cache: true });
    }])
    .directive('infographic', ['keyCodes', '$timeout', '$http', 'util', function(keyCodes, $timeout, $http, util) {
        return {
            replace:  true,
            template: "<svg class='infographic' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'>",

            scope: {
                infographic: "="
            },
            link: function (scope, element, attrs) {
                var debug     = true;
                var calc      = util.calc;

                scope.$watch("infographic", function() {
                    $timeout(function() {
                        var rootJSON = $.extend({},scope["infographic"]);
                        if( rootJSON ) {
                            fetchURLs(rootJSON, function(json) {
                                rootJSON = json || {};
                                render(d3.select(element[0]), rootJSON);
                            });
                        }
                    });
                });


                var scanURLs = function(json) {
                    if( !json ) { return []; }
                    if( json instanceof Array ) { return _.flatten(json.map(scanURLs)); }

                    var urlRegexp = new RegExp(/URL$/);
                    output = _.keys(json)
                                .filter( RegExp.prototype.test.bind(urlRegexp) )
                                .map(function(key){ return {
                                    pointer: json,
                                    url:     json[key],
                                    key:     key.replace(urlRegexp, "")
                                }});

                    if (json["children"]) {
                        output = output.concat( scanURLs(json["children"]) );
                    }
                    return output;
                };

                var fetchURLs = function(json, callback) {
                    var scans = scanURLs(json);
                    async.each( scans, function(scan, done) {
                        $http.get(scan.url).success(function(result) {
                            scan.pointer[scan.key] = result && result[scan.key] || result;
                            done();
                        });
                    }, function(error, result) {
                        callback(json);
                    });
                };

                var parseJson = function(node, json, defaults, container) {
                    json = $.extend(true, {}, json); // clone
                    json.attr  = json.attr || {};

                    if( defaults[json.type] ) {
                        json = $.extend(true, {}, defaults[json.type], json);
                    }
                    // inherit attrs from container node
                    for( var key in json.attr ) {
                        if( json.attr[key] === "inherit" ) {
                            json.attr[key] = node.attr(key) || ""
                        }
                    }

                    if( json.content ) {
                        json.content = util.parseText(json.content, json.data);
                    }

                    // set x|y attrs, based on json[height|width] and node[height|width]
                    json.attr["x"] = calc(container.x, json.attr["x"]);
                    json.attr["y"] = calc(container.y, json.attr["y"]);
                    if( json.align ) {
                        if( json.align.match(/Left/i) ) {
                            json.attr["x"] += calc(json.margin);
                        }
                        else if( json.align.match(/Center/i) ) {
                            json.attr["x"] += calc(container.width, '-', json.attr.width, '/', 2);
                        }
                        else if( json.align.match(/Right/i) ) {
                            json.attr["x"] += calc(container.width, '-', json.attr.width, json.margin );
                        }

                        if( json.align.match(/Top/i) ) {
                            json.attr["y"] += calc(json.margin);
                        }
                        else if( json.align.match(/Mid(dle)?/i) ) {
                            json.attr["y"] += calc(container.height, '-', json.attr.height, '/', 2);
                        }
                        else if( json.align.match(/Bottom/i) ) {
                            json.attr["y"] += calc(container.height, '-', json.attr.height, '-', json.margin);
                        }
                    }
                    return json;
                };


                /**
                 * Recursive function, renders new svg eleemnt inside node, according to json, then recurses through json.children
                 * @param node      d3 container node, each recurision will add nodes to this node
                 * @param json      json spec for a given child
                 * @param defaults  [internal] defaults json, to be passed down the tree
                 */
                var render = function(node, json, defaults, container) {
                    if( !json                    ) { return }
                    if( json instanceof Array    ) { return _.each( json, function(json) { render(node, json, defaults, container) }); }
                    if(_.keys(json).length === 0 ) { return; }


                    defaults   = $.extend(true, {}, defaults, json && json.defaults); // defaults for json extend down the tree,
                    container = container || $.extend({
                        x:      json.attr["x"],
                        y:      json.attr["y"],
                        height: json.attr["height"],
                        width:  json.attr["width"]
                    }, container);

                    json = parseJson(node, json, defaults, container);



                    if( debug ) { console.info('directive.infographic:render', 'json', $.extend({}, json, {children:null})); }

                    var decendNode = node;
                    switch( json.type ) {
                        case "svg":
                            //decendNode = node;
                            node.attr(json.attr);
                            node.append("rect").attr(json.attr);
                            break;

                        case "image":
                        case "rect":
                            decendNode = node.append(json.type).attr(json.attr);
                            break;

                        case "text":
                            // We need to render each line of text separately, due to ImageMagick not rendering newlines
                            // The i+1 is because svg considers the origin of text to be the BottomLeft corner
                            _.each(json.content.split("\n"), function(line,i) {
                                var attr = $.extend({}, json.attr, {
                                    "y": calc(json.attr["y"]) + calc(json.attr["line-height"], '*' , i+1)
                                });
                                decendNode = node.append(json.type).attr(attr).text(line)
                            });
                            break;

                        case "chart":
                            var data    = util.nestedHashToArray(json.data).sort(function(a,b) { return b.value - a.value });
                            var svgNode = decendNode = node;//.append("g").attr(json.attr).attr({x:0,y:0});
                            var svg = {
                                x:      calc(json.attr.x),
                                y:      calc(json.attr.y),
                                height: calc(json.attr.height),
                                width:  calc(json.attr.width)
                            };
                            switch( json.chart ) {
                                case "BarChart": {
                                    var textWidth    = 100;
                                    var valueWidth   = 40;
                                    var valueOffsetX = +10;
                                    var textOffsetY  = -7;
                                    var rowHeight    = svg.height / data.length;
                                    var barHeight    = rowHeight * 0.8;
                                    var maxValue     = Math.max.apply(Math, _.pluck(data, "value"));
                                    var maxBarWidth  = svg.width - textWidth*1.1 - valueWidth;
                                    var barScale     = d3.scale.linear().domain([0,maxValue]).range([0,maxBarWidth]);

                                    svgNode.append("g")
                                        .selectAll("text")
                                        .data(data)
                                        .enter()
                                        .append("text")
                                        .attr("x", textWidth + svg.x)
                                        .attr("y", function(d,i) { return (i+1) * rowHeight + textOffsetY + svg.y; })
                                        .attr("height", barHeight)
                                        .attr("text-anchor", "end")
                                        .attr("alignment-baseline", "central")
                                        .text(function(d) { return d.label; })

                                    svgNode.append("g")
                                        .selectAll("rect")
                                        .data(data)
                                        .enter()
                                        .append("rect")
                                        .attr("x", textWidth * 1.1 + svg.x )
                                        .attr("y", function(d,i) { return i * rowHeight + svg.y })
                                        .attr("height", barHeight)
                                        .attr("width", function(d) { return barScale(d.value); })
                                        .attr("fill",  function(d) { return d.color; })

                                    svgNode.append("g")
                                        .selectAll("text")
                                        .data(data)
                                        .enter()
                                        .append("text")
                                        .text(function(d) { return d.value; })
                                        .attr("x", function(d,i) { return textWidth * 1.1 + barScale(d.value) + valueOffsetX + svg.x; })
                                        .attr("y", function(d,i) { return (i+1) * rowHeight + textOffsetY + svg.y; })
                                        .attr("height", barHeight)
                                        .attr("fill",  function(d) { return d.color; })
                                }
                                break;

                                case "DonutChart": {
                                    var circle = {};
                                    circle.r = Math.min(svg.height, svg.width) / 2;
                                    circle.cx = svg.x + circle.r;
                                    circle.cy = svg.y + circle.r;
                                    // <path d="rx ry x-axis-rotation large-arc-flag sweep-flag x y"/>

                                    var arcSegment = function(d, circle) {
                                        if( !arcSegment.lastArc ) { arcSegment.reset(); }

                                        var arc = { start: {}, end: {}};
                                        arc.percentage  = (d.value / data.stats.values.total);
                                        arc.length      = arc.percentage * 2 * Math.PI;
                                        arc.start.angle = arcSegment.lastArc.end.angle;
                                        arc.end.angle   = arc.start.angle - arc.length % (2 * Math.PI);
                                        arc.start.angle = Math.round(arc.start.angle * 100) / 100;
                                        arc.end.angle   = Math.round(arc.end.angle   * 100) / 100;
                                        arc.start.x     = Math.round(circle.cx - Math.sin(arc.start.angle) * circle.r);
                                        arc.start.y     = Math.round(circle.cy - Math.cos(arc.start.angle) * circle.r);
                                        arc.end.x       = Math.round(circle.cx - Math.sin(arc.end.angle)   * circle.r);
                                        arc.end.y       = Math.round(circle.cy - Math.cos(arc.end.angle)   * circle.r);
                                        arc.xrotation   = 0;
                                        arc.sweep       = 0; //!json.options.anticlockwise;
                                        arc.largearc    = Math.abs(arc.length) >= Math.PI ? 1 : 0;
                                        if( arc.sweep ) { arc.largearc = Number(!arc.largearc); }


                                        arcSegment.lastArc = arc;
                                        return arc;
                                    };
                                    arcSegment.reset = function() {
                                        arcSegment.lastArc = { end: { angle: 0 } };
                                    };


                                    //svgNode.append("circle")
                                    //    .attr("cx",circle.cx)
                                    //    .attr("cy",circle.cy)
                                    //    .attr("r",circle.r)


                                    svgNode.append("g")
                                        .selectAll("path")
                                        .data(data)
                                        .enter()
                                        .append("path")
                                        .attr("fill","none")
                                        .attr("stroke",function(d,i) { return d.color; })
                                        .attr("stroke-width", json.options.borderRadius || 10)
                                        .attr("d", function(d,i) {
                                            var arc = arcSegment(d, circle);
                                            var path = [
                                                "M", arc.end.x, arc.end.y,
                                                "A", circle.r, circle.r, arc.xrotation, arc.largearc, arc.sweep, arc.start.x, arc.start.y
                                            ].join(" ");
                                            return path;
                                        });

                                    if( json.options && json.options.highlight ) {
                                        arcSegment.reset();
                                        circle.r -= calc(json.options.borderRadius,json.options.highlightRadius,"/",2);
                                        svgNode.append("g")
                                            .selectAll("path")
                                            .data(data)
                                            .enter()
                                            .append("path")
                                            .attr("fill","none")
                                            .attr("stroke",function(d,i) {
                                                return json.options.highlight[d.label] || "none"
                                            })
                                            .attr("stroke-width", json.options.highlightRadius || 5)
                                            .attr("d", function(d,i) {
                                                var arc = arcSegment(d, circle);
                                                var path = [
                                                    "M", arc.end.x, arc.end.y,
                                                    "A", circle.r, circle.r, arc.xrotation, arc.largearc, arc.sweep, arc.start.x, arc.start.y
                                                ].join(" ");
                                                return path;
                                            });
                                    }
                                }
                                break;
                                case "DotChart": {
                                    var dotData = _.flatten( _.map( data, function(d) { return _.times(d.value, function() { return d }) } ) );

                                    var grid = {};
                                    grid.offset = { x: 0, y: 0 };
                                    grid.x      = svg.x;
                                    grid.y      = svg.y + grid.offset.y;
                                    grid.width  = svg.width;
                                    grid.height = svg.height - grid.offset.y;
                                    grid.top    = grid.y;
                                    grid.bottom = grid.y + grid.height;
                                    grid.left   = grid.x;
                                    grid.right  = grid.x + grid.width;
                                    grid.area   = grid.x * grid.y;


                                    grid.sizeNeeded = dotData.length;
                                    grid.n = { x: 1, y: 1 }
                                    do {
                                        grid.side = Math.max( grid.width/(grid.n.x+1), grid.height/(grid.n.y+1) );
                                        grid.n = {
                                            x: Math.floor(grid.width/grid.side),
                                            y: Math.floor(grid.height/grid.side)
                                        };
                                        grid.size = grid.n.x * grid.n.y;

                                    } while( grid.size < grid.sizeNeeded );

                                    grid.margin = {
                                        y: 0,
                                        x: (grid.width - grid.n.x * grid.side) / 2
                                    };

                                    grid.r     = 0.8 * grid.side / 2;
                                    grid.area = grid.n.x * grid.n.y * grid.side;
                                    console.assert(dotData.length <= grid.n.x * grid.n.y);

                                    grid.position = function(i) {
                                        var pos = {};
                                        pos.row = i % grid.n.y;
                                        pos.col = Math.floor( i / grid.n.y );
                                        pos.x   = grid.left   + grid.side/2 + (pos.col * grid.side) + grid.margin.x;
                                        pos.y   = grid.bottom - grid.side/2 - (pos.row * grid.side) - grid.margin.y;

                                        return pos;
                                    };

                                    svgNode.append("g")
                                        .selectAll("circle")
                                        .data(dotData)
                                        .enter()
                                        .append("circle")
                                        .attr("cx", function(d,i) { return grid.position(i).x } )
                                        .attr("cy", function(d,i) { return grid.position(i).y } )
                                        .attr("r",  grid.r)
                                        .attr("fill",  function(d) { return d.color; })
                                }
                                break;
                            }
                        break;

                        default:
                            break;

                    }

                    if( json.children ) {
                        if(!( json.children instanceof Array )) {
                            json.children = [ json.children ];
                        }

                        var childrenNode = node;
                        switch( json.type ) {
                            case "svg": break;
                            default:
                                container = {
                                    x:      calc(container.x, decendNode.attr("x")),
                                    y:      calc(container.y, decendNode.attr("y")),
                                    height: calc(decendNode.attr("height")),
                                    width:  calc(decendNode.attr("width"))
                                };
                                childrenNode = node.append("g").attr({
                                    x:      calc(decendNode.attr("x")),
                                    y:      calc(decendNode.attr("y")),
                                    height: calc(decendNode.attr("height")),
                                    width:  calc(decendNode.attr("width"))
                                });
                                break;
                        }

                        render(childrenNode, json.children, defaults, container);
                    }
                };
            }
        };
    }]);