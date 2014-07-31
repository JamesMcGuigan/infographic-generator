angular.module('infographicApp.directives').directive('jsonEditor', [ '$window', '$timeout', function ($window, $timeout) {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModelController) {
            ngModelController.$parsers.push(function(data) {
                try {
                    var json = JSON.parse(data);
                    ngModelController.$setValidity('json', true);
                    return json;
                } catch(e) {
                    ngModelController.$setValidity('json', false);
                }

            });

            ngModelController.$formatters.push(function(data) {
                //convert data from model format to view format
                return JSON.stringify(data, null, 4);
            });

            scope.$watch(attrs["ngModel"], function() {
                element.height( element[0].scrollHeight );
            });
        }
    };
}]);