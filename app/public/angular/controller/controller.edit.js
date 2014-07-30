var async = require('async');
var module = angular.module('infographicApp.controllers');

module.controller('EditController', ['$scope', '$routeParams', '$http', "InfographicDB", "InfographicFile",
    function($scope, $routeParams, $http, InfographicDB, InfographicFile) {
        var EditController = this;
        $scope.config = {};

        $scope.load = function() {
            if( $routeParams.id.match(/^file:/) ) {
                var filename = $routeParams.id.replace(/^file:/,'');
                InfographicFile.get({ id: filename }, function(response) {
                    $scope.config      = response.data;
                    $scope.config.uuid = "file:"+filename;
                });
            } else {
                InfographicDB.get({ id: $routeParams.id }, function(response) {
                    $scope.config = response.data;
                });
            }
        };

        $scope.save = function() {
            if( $routeParams.id.match(/^file:/) ) {
                var filename = $routeParams.id.replace(/^file:/,'');
                InfographicFile.post({ id: filename }, $scope.config, function(response) {
                    if( response.success ) {
                        alert(filename + " saved");
                    } else {
                        alert("Error: " + response.error);
                    }
                });
            } else {
//                InfographicDB.get({ id: $routeParams.id }, function(response) {
//                    $scope.config = response.data;
//                });
            }
        };

        $scope.load();
    }
]);
