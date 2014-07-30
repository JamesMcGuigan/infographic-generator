// TODO: Untested, Unfinished

var _         = require("underscore");
var assert    = require("assert");
var config    = require('../config/config.js')[process.env.NODE_ENV];
var mongojs   = require("mongojs");

var CrudMongoAPI = module.exports = {
    render: function(response, error, data) {
        if( error ) {
            response.writeHead(400, {"Content-Type": "application/json"});
            response.write(JSON.stringify({success: false, error: error}));
            response.end("\n");
        } else {
            response.writeHead(200, {"Content-Type": "application/json"});
            response.write(JSON.stringify({success: true, data: data}));
            response.end("\n");
        }
    },
    authorize: function(response, permission, table) {
        // _.keys(config.crudPermissions) = ["view","edit"]
        var error = null;

        if( !_.contains( _.keys(config.crudPermissions), permission) ) {
            error = new Error("invalid permission '"+permission+"'");
        }
        else if( !table ) {
            error = new Error("undefined table");
        }
        else if( !_.contains(config.crudPermissions[permission], table) ) {
            error = new Error("no '"+ permission +"' permission on " + table);
        }

        if( error ) {
            CrudMongoAPI.render(response, error, null);
            return false;
        } else {
            return true;
        }
    },

    get: function(request, response) {
        if( CrudMongoAPI.authorize(response, "view", request.params.table) ) {
            var db = mongojs(config.db, [request.params.table]);

            if( request.params.id ) {
                db[request.params.table].find( {id: request.params.id}, function(error, docs) {
                    CrudMongoAPI.render(response, error, docs);
                });
            } else {
                db[request.params.table].find( function(error, docs) {
                    CrudMongoAPI.render(response, error, docs);
                });
            }
        }
    }
};