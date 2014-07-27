angular.module('infographicApp.directives').directive('jsonEditor', [ '$window', '$timeout', function ($window, $timeout) {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModelController) {
            ngModelController.$parsers.push(function(data) {
                //convert data from view format to model format
                return JSON.parse(data);
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