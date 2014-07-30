angular.module('infographicApp.directives')
    .run(['$http',function($http) {
        //$http({ method: 'GET', url: '/elements/infographic.html', cache: true });
    }])
    .directive('infographic', ['keyCodes', '$timeout', '$http', function(keyCodes, $timeout, $http) {
        return {
            replace:  true,
            template: "<svg class='infographic' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'>",

            scope: {
                infographic: "="
            },
            link: function (scope, element, attrs) {
                var debug = true;

                scope.$watch("infographic", function() {
                    $timeout(function() {
                        var rootJSON = $.extend({},scope["infographic"]);
                        if( rootJSON ) {
                            render(d3.select(element[0]), rootJSON);
                        }
                    });
                });


                //***** Module Functions *****//

                /**
                 *  Alternative polish notation syntax with auto-casting for strings and nulls
                 *  Accepts a list of arguments that are either operators '+','-','/','*'
                 *          or castable number-like variables: 4, "42px", null
                 *
                 *  @example calc('+',4,"42px",null,'/',2,'-',7) == 16
                 *  @returns {number}
                 */
                var calc = function(numbersAndOperators) {
                    var result   = 0;
                    var operator = '+';
                    for( var i = 0; i < arguments.length; i++ ) {
                        var arg = arguments[i];
                        if( ['+','-','*','/'].indexOf(arg) != -1 ) {
                            operator = arguments[i];
                        } else {
                            if( typeof arg === "string" ) {
                                arg = Number(arg.replace(/[^\d.]+/g,'')) || 0;
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
                var calcTextHeight = function(json) {
//                    if( json.type === "text") {
//                        var lines = String(json.content).split(/\n/).length;
//                        return calc(json.attr["line-height"]);
//                        //return 0
//                    } else {
                        return 0
//                    }
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
                            json.attr["y"] += calc(calcTextHeight(json), json.margin);
                        }
                        else if( json.align.match(/Mid(dle)?/i) ) {
                            json.attr["y"] += calc(calcTextHeight(json), container.height, '-', json.attr.height, '/', 2);
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