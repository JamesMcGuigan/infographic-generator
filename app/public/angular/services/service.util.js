angular.module('infographicApp.services')
    .factory("util", function() {
        var util = {
            //***** Module Functions *****//

            /**
             *  Alternative polish notation syntax with auto-casting for strings and nulls
             *  Accepts a list of arguments that are either operators '+','-','/','*'
             *          or castable number-like variables: 4, "42px", null
             *
             *  @example calc('+',4,"42px",null,'/',2,'-',7) == 16
             *  @returns {number}
             */
             calc: function(numbersAndOperators) {
                var result   = 0;
                var operator = '+';
                for( var i = 0; i < arguments.length; i++ ) {
                    var arg = arguments[i];
                    if( ['+','-','*','/'].indexOf(arg) != -1 ) {
                        operator = arguments[i];
                    } else {
                        if( typeof arg === "string" ) {
                            arg = Number(arg.replace(/[^+\d.-]+/g,'')) || 0;
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
            },

            /**
             * nestedHashToArray({ values: { a: 1, b: 2}, colors: { a: "red", b: "blue" } })
             *               -> [ { label: "a", value: 1, color: "red" }, { label: "b", value: 2, color: "blue" } ]
             * @param data
             */
            nestedHashToArray: function(data) {
                if( typeof data !== "object" || data instanceof Array ) {
                    console.error("service.util.nestedHashToArray: data is not an object");
                    return [];
                }

                var outputHash  = {};
                var outputArray = [];
                outputArray.stats = {};

                for( var keys in data ) {
                    var key = keys.replace(/s$/,'');
                    for( var label in data[keys] ) {
                        if( !outputHash[label] ) { outputHash[label] = { "label": label } };
                        outputHash[label][key] = data[keys][label];
                    }
                }

                for( var label in outputHash ) {
                    outputArray.push(outputHash[label]);
                }

                for (var keys in data) {
                    var values = _.values(data[keys]);
                    outputArray.stats[keys] = {
                        max:    Math.max.apply(Math,values),
                        min:    Math.min.apply(Math,values),
                        length: values.length,
                        total:  _.reduce(values, function(N, n){ return Number(N) + Number(n); }, 0)
                    };
                    outputArray.stats[keys].mean = outputArray.stats[keys].sum / outputArray.stats[keys].length;

                    var factor = outputArray.stats[keys].factor = {};
                    for( var label in data[keys] ) {
                        factor[ data[keys][label] ] = (factor[ data[keys][label] ] || 0) + 1;
                    }

                    var percentage = outputArray.stats[keys].percentage = {};
                    for( var label in data[keys] ) {
                        percentage[ data[keys][label] ] = (percentage[ data[keys][label] ] || 0) + 1;
                    }
                }
                console.log('service.util:78', 'outputArray', outputArray);
                return outputArray;
            },
            parseText: function(text, data) {
                var interpolerationRegex = new RegExp(/#{(.*?)}/g);
                if( !text.match(interpolerationRegex) ) {
                    return text;
                } else {
                    var stats = util.nestedHashToArray(data).stats;
                    var output = text.replace(interpolerationRegex, function(match, capture) {
                        var namespace = capture.split(/\./);
                        var source = data;

                        if( namespace && namespace[0] === "stats" ) {
                            source = stats;
                            namespace.shift();
                        }

                        while( namespace.length ) {
                            var key = namespace.shift();
                            if( source.hasOwnProperty(key) ) {
                                source = source[key];
                            } else {
                                if( source.hasOwnProperty("values") && source["values"].hasOwnProperty(key) ) {
                                    source = source["values"][key];
                                } else {
                                    return match;
                                }
                            }
                        }
                        return String(source);
                    });
                    return output;
                }
            }
        };
        return util;
    });