'use strict';

// Declare app level module which depends on filters, and services
angular.module('infographicApp', [
    'infographicApp.config',
    'infographicApp.controllers',
    'infographicApp.directives',
    'infographicApp.filters',
    'infographicApp.resources',
    'infographicApp.routes',
    'infographicApp.services'
])
    .config(function( $analyticsProvider ) {
        $analyticsProvider.firstPageview(true); /* Records pages that don't use $state or $route */
        $analyticsProvider.withAutoBase(true);  /* Records full path */
    });


// Declare app level module which depends on filters, and services
angular.module('infographicApp.config', [])
    .constant('version', "0.1")
    .constant('keyCodes', {
        enter:    13,
        up:       38,
        down:     40,
        left:     37,
        right:    39,
        escape:   27,
        space:    32
    });


angular.module('infographicApp.controllers', ['ngStorage','ngPrettyJson']);
angular.module('infographicApp.directives', []);
angular.module('infographicApp.validators', []);
angular.module('infographicApp.services', []);
