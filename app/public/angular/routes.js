angular.module('infographicApp.routes',['ngRoute','angulartics','angulartics.google.analytics']).config(["$routeProvider",
    function($routeProvider) {
        $routeProvider.otherwise(        { redirectTo: "/list" });
        $routeProvider.when("/list",     { templateUrl: "html/list.html", controller: "ListController" });
        $routeProvider.when("/edit/:id", { templateUrl: "html/edit.html", controller: "EditController" });
    }
]);