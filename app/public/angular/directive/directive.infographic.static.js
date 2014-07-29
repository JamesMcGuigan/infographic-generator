angular.module('infographicApp.directives')
    .run(['$http',function($http) {
        //$http({ method: 'GET', url: '/elements/infographic.html', cache: true });
    }])
    .directive('infographicStatic', ['keyCodes', '$timeout', '$http', function(keyCodes, $timeout, $http) {
        return {
            replace:  true,
            template: "<div class='infographicStatic'></div>",
            scope: {
                svgSelector:    "=",
                json:           "=",
                buttonSelector: "="
            },
            link: function (scope, element, attrs) {
                var debug = true;

                var render = function(node, json) {
                    $(element).empty();
                    $http({
                        url:     "/GraphicsMagick/svg/",
                        method:  "POST",
                        data:    {
                            uuid:   json["uuid"],
                            svg:    $(node)[0].outerHTML,
                            format: "jpg"
                        }
                    })
                    .success(function(response) {
                        $(element).html("<img src='"+response.url+"'/>");
                    })
                    .error(function(response) {
                        $(element).empty();
                    });
                };

                // Test to check for trivial, non-semantic changes to the json
                var hasJsonChanged = function(json) {
                    try {
                        var jsonString = JSON.stringify(JSON.parse(json));
                        if( jsonString !== hasJsonChanged.cache ) {
                            hasJsonChanged.cache = jsonString;
                            return true;
                        } else {
                            return false;
                        }
                    } catch(e) {
                        hasJsonChanged.cache = null;
                        return true
                    }
                };
                hasJsonChanged.cache = null;


                $(scope.buttonSelector).bind("click", function(event) {
                    render( $(scope.svgSelector), scope.json );
                });

                scope.$watch("json", function() {
                    if( hasJsonChanged(scope.json) ) {
                        $(element).empty();
                    }
                });
            }
        };
    }]);