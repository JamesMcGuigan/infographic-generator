angular.module('infographicApp.services')
    .factory("util", function() {
        return {
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

                var outputHash = {};
                for( var keys in data ) {
                    var key = keys.replace(/s$/,'');
                    for( var label in data[keys] ) {
                        if( !outputHash[label] ) { outputHash[label] = { "label": label } };
                        outputHash[label][key] = data[keys][label];
                    }
                }

                var outputArray = [];
                for( var label in outputHash ) {
                    outputArray.push(outputHash[label]);
                }

//                // Sort
//                _.each($.makeArray(sortBy), function(sortField) {
//                    if( typeof sortBy === "string" && data[sortField] ) {
//                        outputArray.sort(function(a,b) {
//                            if( a[sortField] < b[sortField] ) { return -1; }
//                            if( a[sortField] > b[sortField] ) { return  1; }
//                            return 0;
//                        });
//                    }
//                    else if( sortField instanceof Function ) {
//                        outputArray.sort(sortField);
//                    }
//                });

                return outputArray;
            }
        };
    });