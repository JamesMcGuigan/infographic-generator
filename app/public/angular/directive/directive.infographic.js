angular.module('infographicApp.directives')
    .run(['$http',function($http) {
        //$http({ method: 'GET', url: '/elements/infographic.html', cache: true });
    }])
    .directive('infographic', ['keyCodes', '$timeout', '$http', function(keyCodes, $timeout, $http) {
        return {
            replace:  true,
            template: "<svg class='infographic'></svg>",
            scope: {
                infographic: "="
            },
            link: function (scope, element, attrs) {
                var debug = true;

                // strMath('+',4,"42px",null,'/',2) == 23
                var calc = function() {
                    var result   = 0;
                    var operator = '+';
                    for( var i = 0; i < arguments.length; i++ ) {
                        var arg = arguments[i];
                        if( ['+','-','*','/'].indexOf(arg) != -1 ) {
                            operator = arguments[i];
                        } else {
                            if( typeof arg === "string" ) {
                                arg = Number(arg.replace(/\D+/g,'')) || 0;
                            } else {
                                arg = Number(arg) || 0;
                            }

                            switch( operator ) {
                                case '+': result += arg; break;
                                case '-': result -= arg; break;
                                case '*': result *= arg; break;
                                case '/': result /= arg; break;
                            }
                        }
                    }
                    return result;
                };


                /**
                 * Recursive function, renders new svg eleemnt inside node, according to json, then recurses through json.children
                 * @param node      d3 container node, each recurision will add nodes to this node
                 * @param json      json spec for a given child
                 * @param defaults  [internal] defaults json, to be passed down the tree
                 */
                var render = function(node, json, defaults) {
                    if( !json || _.keys(json).length === 0 ) { return; } // ignore empty configs

                    var decendNode = node;

                    node["attr"]       = node["attr"]       || {};
                    defaults           = defaults           || {};

                    // defaults for json extend down the tree,
                    if( json["defaults"] ) {
                        defaults = $.extend(true, {}, defaults, json["defaults"]);
                    }
                    if( defaults[json["type"]] ) {
                        json = $.extend(true, {}, defaults[json["type"]], json);
                    }
                    // inherit attrs from container node
                    for( var key in json.attr ) {
                        if( json.attr[key] === "inherit" ) {
                            json.attr[key] = node.attr(key) || ""
                        }
                    }

                    // set x|y attrs, based on json[height|width] and node[height|width]
                    if( json["align"] ) {
                        if( json["align"].match(/Left/i) ) {
                            json.attr["x"] = calc(0, '+', json["margin"]);
                        }
                        else if( json["align"].match(/Center/i) ) {
                            json.attr["x"] = calc(node.attr("width"), '-', json.attr["width"], '/', 2);
                        }
                        else if( json["align"].match(/Right/i) ) {
                            json.attr["x"] = calc( node.attr("width"), '-', json.attr["width"], '-', json["margin"] );
                        }

                        if( json["align"].match(/Top/i) ) {
                            json.attr["y"] = calc(0, '+', json["margin"]);

                            if( json["type"] === "text" ) {
                                json.attr["y"] += calc(json.attr["line-height"]);
                            }
                        }
                        else if( json["align"].match(/Mid(dle)?/i) ) {
                            json.attr["y"] = calc( node.attr("height"), '-', json.attr["height"], '/', 2);

                            if( json["type"] === "text" ) {
                                json.attr["y"] += calc(json.attr["line-height"], '/', 2);
                            }
                        }
                        else if( json["align"].match(/Bottom/i) ) {
                            json.attr["y"] = calc(node.attr("height"), '-', json.attr["height"], '-', json["margin"]);
                        }
                    }


                    if( debug ) { console.log('directive.infographic:38', 'json', $.extend({}, json, {children:null})); }

                    switch( json["type"] ) {

                        case "svg":
                            node.attr(json.attr);
                            node.attr("viewBox", [ 0, 0, json.attr["width"], json.attr["height"] ].join(" "));
                            node.append("rect").attr(json.attr);
                        break;

                        case "image":
                        case "text":
                        case "rect":
                            decendNode = node.append(json["type"]).attr(json.attr).style(json["style"]).text(json["content"]);
                        break;


                        default:
                            console.log("directive.infographic - invalid type: ", json["type"], json);
                        break;

                    }

                    if( json["children"] ) {
                        if(!( json["children"] instanceof Array )) {
                            json["children"] = [ json["children"] ];
                        }

                        var svgNode = node.append("svg").attr({
                            x:      decendNode.attr("x"),
                            y:      decendNode.attr("y"),
                            height: decendNode.attr("height"),
                            width:  decendNode.attr("width")
                        });
                        for( var i=0, n=json["children"].length; i<n; i++ ) {
                            render(svgNode, json["children"][i], defaults);
                        }
                    }
                };

                var renderPng = function(node, json) {
                    $http({
                        url:     "/GraphicsMagick/svg/",
                        method:  "POST",
                        data:    {
                            uuid:   json["uuid"],
                            svg:    $(node)[0].outerHTML,
                            format: "jpg"
                        }
                        //headers: { "Content-Type": "text/plain" }
                    })
                    .success(function(response) {
                        $("#preview").html("<img src='"+response.url+"'/>");
                    })
                    .error(function(response) {

                    })
                };

                scope.$watch("infographic", function() {
                    $timeout(function() {
                        var rootJSON = $.extend({},scope["infographic"]);
                        if( rootJSON && rootJSON["uuid"] ) {
                            render(d3.select(element[0]), rootJSON);
                            renderPng(element, rootJSON)
                        }
                    })
                });


            }
        };
    }]);