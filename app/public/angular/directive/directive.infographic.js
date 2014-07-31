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
                var debug = true;
                var calc  = util.calc;

                scope.$watch("infographic", function() {
                    $timeout(function() {
                        var rootJSON = $.extend({},scope["infographic"]);
                        if( rootJSON ) {
                            render(d3.select(element[0]), rootJSON);
                        }
                    });
                });


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
                            json.attr["y"] = calc(container.height, '-', json.attr.height, '-', json.margin);
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
                    if( !json || _.keys(json).length === 0 ) { return; } // ignore empty configs

                    defaults   = $.extend(true, {}, defaults, json && json.defaults); // defaults for json extend down the tree,
                    container = container || $.extend({
                        x:      json.attr["x"],
                        y:      json.attr["y"],
                        height: json.attr["height"],
                        width:  json.attr["width"]
                    }, container);

                    json = parseJson(node, json, defaults, container);



                    if( debug ) { console.log('directive.infographic:38', 'json', $.extend({}, json, {children:null})); }

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
                            var data    = util.nestedHashToArray(json.data,"value");
                            var svgNode = decendNode = node.append("g").attr(json.attr).attr({x:0,y:0});
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

                                    console.log('directive.infographic:124', 'decendNode', decendNode);
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
                            }
                        break;


                        default:
                            console.log("directive.infographic - invalid type: ", json.type, json);
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

                        for( var i=0, n=json.children.length; i<n; i++ ) {
                            render(childrenNode, json.children[i], defaults, container);
                        }
                    }
                };


            }
        };
    }]);