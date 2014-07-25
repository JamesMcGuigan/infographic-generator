//the require library is configuring paths
require.config({
    baseUrl: "/bower",
    paths: {
        "angular":      "angular/angular",
        "angularRoute": "angular-route/angular-route",
        "angularMocks": "angular-mocks/angular-mocks",
        "text":         "requirejs-text/text",
        "angular":      "angular/angular",
        "fastclick":    "fastclick/lib/fastclick.js",
        'foundation': 'foundation/js/foundation',
        "html5shiv": [
            "html5shiv/dist/html5shiv.js",
            "html5shiv/dist/html5shiv-printshiv.js"
        ],
        "jquery-placeholder": "jquery-placeholder",
        "jquery-ui":          "jquery-ui/ui/jquery-ui.js",
        "jquery.cookie":      "jquery.cookie/jquery.cookie.js",
        "jquery":             "jquery/jquery",
        "karma":              "karma/dist/karma.styl",
        "lodash":             "lodash/dist/lodash.compat.js",
        "modernizr":          "modernizr",
        "parallax":           "parallax",
        "requirejs":          "requirejs",
        "underscore":         "underscore/underscore"
    },
    shim: {
        "backbone": {
            deps: ["jquery", "underscore"], //loads dependencies first
            exports: "Backbone"             //custom export name, this would be lowercase otherwise
        },
        "angular":      {"exports": "angular"},
        "angularRoute": ["angular"],
        "angularMocks": {
            "deps":     ["angular"],
            "exports":  "angular.mock"
        },
        'foundation': {
            deps: ['jquery']
        },
        'foundation-init': {
            deps: ['foundation']
        },
        priority: [
            "angular"
        ]
    },
    //how long the it tries to load a script before giving up, the default is 7
    waitSeconds: 10,
    optimize: "none"
});

////http://code.angularjs.org/1.2.1/docs/guide/bootstrap#overview_deferred-bootstrap
//window.name = "NG_DEFER_BOOTSTRAP!";
//require([
//    "angular",
//    "app",
//    "routes",
//], function(angular, app, routes) {
//    "use strict";
//    var $html = angular.element(document.getElementsByTagName("html")[0]);
//
//    angular.element().ready(function() {
//        angular.resumeBootstrap([app["name"]]);
//    });
//});
//require([
//    "foundation",
//    "jquery",
//], function(angular, app, routes) {
