angular.module('infographicApp.routes',['ngRoute']).config(["$routeProvider",
    function($routeProvider) {
	    $routeProvider.when("/", { templateUrl: "html/list.html", controller: "ListController" });
    }
]);