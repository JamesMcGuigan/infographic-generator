var async = require('async');
var module = angular.module('infographicApp.controllers');

module.controller('EditController', ['$scope', '$http', "InfographicDB",
    function($scope, $http, InfographicDB) {
        var EditController = this;

        $scope.config = {};
        $http({method: 'GET', url: '/data/chart1.json'}).
            success(function(data, status, headers, config){
                console.log('controller.edit:12', '$scope.config', data);
                $scope.config = data
            });
    }
]);
