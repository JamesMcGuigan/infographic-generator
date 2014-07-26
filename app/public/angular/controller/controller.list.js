var async = require('async');
var module = angular.module('infographicApp.controllers');

module.controller("TableSortController", ['$scope', function($scope, options) {
    $scope.key      = "date";
    $scope.order    = true;

    $scope.sort = function(key) {
        if( key === $scope.key ) {
            $scope.order = !$scope.order;
        } else {
            $scope.order = String($scope.key).match(/date/i) ? true : false;
        }
        $scope.key = key;
    };
}]);

module.controller('ListController', ['$scope', '$route', '$sessionStorage', '$location', '$controller', "InfographicDB",
    function($scope, $route, $sessionStorage, $location, $controller, InfographicDB) {
        $controller('TableSortController', { $scope: $scope });
        var ListController = this;

        $scope.itemType = "Infographic";
        $scope.list = [];

        InfographicDB.get(function(response) {
            console.log(response)
        });
    }
]);
