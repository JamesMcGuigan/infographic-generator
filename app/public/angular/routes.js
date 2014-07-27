angular.module('infographicApp.routes',['ngRoute']).config(["$routeProvider",
    function($routeProvider) {
	    $routeProvider.when("/",     { templateUrl: "html/list.html", controller: "ListController" });
        $routeProvider.when("/list", { templateUrl: "html/list.html", controller: "ListController" });
        $routeProvider.when("/edit", { templateUrl: "html/edit.html", controller: "EditController" });
    }
]);