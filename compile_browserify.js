#!/usr/bin/env node
var exec    = require('child_process').exec;
var _       = require('underscore');
var package = require('./package.json');
                                                         
 
var output   = "./vendor/browserify.js";
var packages = _.keys(package.browserify);
var command  = "browserify -r ./app/public/js/includes_browserify.js -o " + output + " -r " + packages.join(" -r ") + ";"
//               + "perl -0 -p -i -e 's/^(require=)?/require=/' " + output

console.log(command);
exec(command, function(error, stdout, stderr) {
    stdout && console.log(stdout);
    stderr && console.log(stderr);
 
    if( !error ) {
        console.log("browserify: " + packages.join(" "));
        console.log("wrote:      " + output);
        console.log("");
    }
    process.exit();
});