var infographicResources = angular.module("infographicApp.resources", ["ngResource"]);

infographicResources.factory("InfographicDB", ["$resource", function($resource) {
	return $resource("/api/mongo/:id", {}, {
		get:    {method: "GET",    isArray: false},
//		post:   {method: "POST",   isArray: false}
//		put:    {method: "PUT",    isArray: false},
//		delete: {method: "DELETE", isArray: false}
	});
}]);
infographicResources.factory("InfographicFile", ["$resource", function($resource) {
    return $resource("/api/filesystem/:id", {}, {
        get:    {method: "GET",    isArray: false},
        post:   {method: "POST",   isArray: false}
//        put:    {method: "PUT",    isArray: false},
//        delete: {method: "DELETE", isArray: false}
    });
}]);