var config    = require('../config/config.js')[process.env.NODE_ENV];
var _         = require("underscore");
var async     = require('async');
var uuid      = require('node-uuid');
var extend    = require("node.extend");

//var fs        = require("fs");
//var markdown  = require("markdown").markdown;
//var path      = require("path");
//var unirest   = require('unirest');
//var url       = require("url");
//var validator = require("email-validator");


module.exports = function(app){
    var renderParams = function(request) {
        request.cookies["uuid"] = request.cookies["uuid"] || uuid.v4();

        var render = {};
        // render.user = request.isAuthenticated() ? request.user : null; // requires passport

        render.text      = require("../views/text/english.js");
        render.lang      = "en";
        render.apilang   = "eng";
        render.language  = "english";
        render.direction = "ltr";

        render.layout = "template";
        render.urls = require("../views/text/urls.js")(request, render);
        render.config = extend({}, config, { sslcert: null, rootCA: null, basicAuth: null, cookieSecret: null, sessionSecret: null });

        return render;
    };

    var redirectWithoutParams = function(request, response, withouts) {
        withouts = _.flatten([withouts]);
        var parsed = url.parse(request.url, true);
        var query = [];
        for( var key in parsed.query ) {
            if( parsed.query[key] && withouts.indexOf(key) === -1 ) {
                query.push( key + "=" + parsed.query[key] );
            }
        }
        var querystring = query.length && "?" + query.join("&") || "";
        response.redirect( parsed.pathname + querystring );
    };

    app.get("/", function(request, response) {
        var render = renderParams(request);
        //async.parallel([
        //], function() {
        response.render("home", render);
        //});
    });
};