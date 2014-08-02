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

module.controller('ListController',
    ['$scope', '$route', '$sessionStorage', '$location', '$controller', "InfographicDB", "InfographicFile",
    function($scope, $route, $sessionStorage, $location, $controller, InfographicDB, InfographicFile) {
        $controller('TableSortController', { $scope: $scope });
        var ListController = this;

        $scope.itemType = "Infographic";
        $scope.list = [];

        InfographicFile.get(function(response) {
            $scope.list = $scope.list.concat(response.data);
            console.log('InfographicFile', 'response', response.data);
            console.log('controller.list:30', '$scope.list', $scope.list);
        });

        //// TODO: Mongo Not Implented Yet
        //InfographicDB.get(function(response) {
        //    $scope.list = $scope.list.concat(response.data);
        //    console.log('InfographicDB', 'response', response.data);
        //    console.log('controller.list:36', '$scope.list', $scope.list);
        //});

        $scope.create = function() {
            var filename = window.prompt("Please enter a new filename","chartX.json");
            $location.path('/edit/file:'+filename);
        };


    }
]);
