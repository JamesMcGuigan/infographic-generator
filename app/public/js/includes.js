// include angular loader, which allows the files to load in any order
/*
 AngularJS v1.0.7
 (c) 2010-2012 Google, Inc. http://angularjs.org
 License: MIT
 */
(function(i){'use strict';function d(c,b,e){return c[b]||(c[b]=e())}return d(d(i,"angular",Object),"module",function(){var c={};return function(b,e,f){e&&c.hasOwnProperty(b)&&(c[b]=null);return d(c,b,function(){function a(a,b,d){return function(){c[d||"push"]([a,b,arguments]);return g}}if(!e)throw Error("No module: "+b);var c=[],d=[],h=a("$injector","invoke"),g={_invokeQueue:c,_runBlocks:d,requires:e,name:b,provider:a("$provide","provider"),factory:a("$provide","factory"),service:a("$provide","service"),
    value:a("$provide","value"),constant:a("$provide","constant","unshift"),filter:a("$filterProvider","register"),controller:a("$controllerProvider","register"),directive:a("$compileProvider","directive"),config:h,run:function(a){d.push(a);return this}};f&&h(f);return g})}})})(window);


// include a third-party async loader library
/*!
 * $script.js v1.3
 * https://github.com/ded/script.js
 * Copyright: @ded & @fat - Dustin Diaz, Jacob Thornton 2011
 * Follow our software http://twitter.com/dedfat
 * License: MIT
 */
!function(a,b,c){function t(a,c){var e=b.createElement("script"),f=j;e.onload=e.onerror=e[o]=function(){e[m]&&!/^c|loade/.test(e[m])||f||(e.onload=e[o]=null,f=1,c())},e.async=1,e.src=a,d.insertBefore(e,d.firstChild)}function q(a,b){p(a,function(a){return!b(a)})}var d=b.getElementsByTagName("head")[0],e={},f={},g={},h={},i="string",j=!1,k="push",l="DOMContentLoaded",m="readyState",n="addEventListener",o="onreadystatechange",p=function(a,b){for(var c=0,d=a.length;c<d;++c)if(!b(a[c]))return j;return 1};!b[m]&&b[n]&&(b[n](l,function r(){b.removeEventListener(l,r,j),b[m]="complete"},j),b[m]="loading");var s=function(a,b,d){function o(){if(!--m){e[l]=1,j&&j();for(var a in g)p(a.split("|"),n)&&!q(g[a],n)&&(g[a]=[])}}function n(a){return a.call?a():e[a]}a=a[k]?a:[a];var i=b&&b.call,j=i?b:d,l=i?a.join(""):b,m=a.length;c(function(){q(a,function(a){h[a]?(l&&(f[l]=1),o()):(h[a]=1,l&&(f[l]=1),t(s.path?s.path+a+".js":a,o))})},0);return s};s.get=t,s.ready=function(a,b,c){a=a[k]?a:[a];var d=[];!q(a,function(a){e[a]||d[k](a)})&&p(a,function(a){return e[a]})?b():!function(a){g[a]=g[a]||[],g[a][k](b),c&&c(d)}(a.join("|"));return s};var u=a.$script;s.noConflict=function(){a.$script=u;return this},typeof module!="undefined"&&module.exports?module.exports=s:a.$script=s}(this,document,setTimeout)

// load all of the dependencies asynchronously.
$script([
    '/vendor/firebugx/firebugx.js',
    '/vendor/polyfills/storage.js',
    '/bower/fastclick/lib/fastclick.js',

    '/bower/jquery-legacy/jquery.js',
    '/bower/underscore/underscore.js',
    '/bower/datejs/build/date-en-GB.js',
    '/bower/angular/angular.js',
    '/bower/d3/d3.js',
    '/vendor/browserify.js'
    // '/bower/array-generics/array.generics.js',
    // '/bower/es5-shim/es5-shim.js', // breaks broswerify:github-flavoured-markdown
], function() {
    $script([
        '/bower/es6-shim/es6-shim.js',               // depends es5-shim.js
        '/bower/bootstrap-css/js/bootstrap.js',      // depends jQuery
        '/bower/d3.chart/d3.chart.js',               // depends d3
        '/bower/angulartics/dist/angulartics.min.js' // depends angular
        //'/bower/highcharts-release/highcharts.js',
        //'/bower/jquery-equal-height/af.equal-height.js',
        //'/bower/jquery-or/js/jquery.or.js'
        //'/bower/nvd3/nv.d3.js',
        //'/bower/jquery-placeholder/jquery.placeholder.js'
    ], function() {
        $script([
            '/bower/angulartics/dist/angulartics-ga.min.js',  // depends angulartics
            '/bower/angular-route/angular-route.js',
            '/bower/angular-i18n/angular-locale_en-gb.js',
            '/bower/angular-resource/angular-resource.js',
            '/bower/ng-prettyjson/src/ng-prettyjson.js',
            '/bower/ngstorage/ngStorage.js'
            //'/bower/highcharts-release/modules/exporting.js',
        ], function() {
            $script([
                '/angular/app.js'
            ], function() {
                $script([
                    '/angular/controller/controller.edit.js',
                    '/angular/controller/controller.list.js',
                    '/angular/directive/directive.infographic.js',
                    '/angular/directive/directive.infographic.static.js',
                    '/angular/directive/directive.json-editor.js',
                    '/angular/directive/directive.markdown.js',
                    '/angular/services/service.util.js',
                    '/angular/filters.js',
                    '/angular/resources.js',
                    '/angular/routes.js'
                ], function(){
                    $script([
                        '/js/init.js'
                    ], function(){
                    });
                });
            });
        });
    });
});