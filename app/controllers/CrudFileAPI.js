var _         = require("underscore");
var assert    = require("assert");
var config    = require('../config/config.js')[process.env.NODE_ENV];
var async     = require("async");
var fs        = require("fs");

var CrudFileAPI = module.exports = {
    dirname: "data",

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
    get: function(request, response) {
        console.log('CrudFileAPI:21', 'request.params', request.params);

        if( request.params.filename ) {
            var filename = CrudFileAPI.dirname + "/" + request.params.filename;
            fs.readFile(filename, function(error, text) {
                if( error ) { CrudFileAPI.render(response, error, null); return };

                try {
                    var json = JSON.parse(text);
                    CrudFileAPI.render(response, error, json);
                } catch(error) {
                    CrudFileAPI.render(response, error, null);
                }
            });
        } else {
            fs.readdir(CrudFileAPI.dirname, function (error, files) {
                if( error ) { CrudFileAPI.render(response, error, null); return }

                async.filter(files, function(file, done) {
                    done( fs.lstatSync(CrudFileAPI.dirname+"/"+file).isFile() );
                }, function(files) {

                    async.map(files, function(file, done) {
                        var hash = {
                            id:    file,
                            date:  fs.statSync(CrudFileAPI.dirname+'/'+file).mtime,
                            type:  "file",
                            title: JSON.parse(fs.readFileSync(CrudFileAPI.dirname+'/'+file)).title
                        };
                        done(null, hash);
                    }, function (error, data) {
                        CrudFileAPI.render(response, error, data);
                    });

                });
            });
        }
    },
    post: function(request, response) {
        if( !request.params.filename ) { CrudFileAPI.render(response, "No filename provided",  null); return; }
        if( !request.body            ) { CrudFileAPI.render(response, "No post data provided", null); return; }

        try {
            var filename = CrudFileAPI.dirname + "/" + request.params.filename;
            var json     = JSON.stringify(request.body, null, 4);
            fs.writeFileSync(filename, json);
            CrudFileAPI.render(response, null, json);
        } catch(e) {
            CrudFileAPI.render(response, e, null);
        }
    }
};