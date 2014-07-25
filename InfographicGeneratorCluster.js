process.argv.forEach(function (value, index, array) {
    if( value.match(/^NODE_ENV=/) ) { process.env.NODE_ENV = value.replace(/^NODE_ENV=/, ''); }
});
process.env.NODE_ENV = process.env.NODE_ENV || "development";

var config   = require('./app/config/config.js')[process.env.NODE_ENV];
var cluster = require('cluster');
var http    = require('http');
var numCPUs = Math.max( 2, require('os').cpus().length );

console.info("InfographicGenerator started with " + numCPUs + " processes");

var timeouts = {};
if (cluster.isMaster) {
    // Fork workers.
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('online', function(worker) {
        console.info("worker " + worker.uniqueID+":"+worker.process.pid  + " responded after it was forked");
    });
    cluster.on('fork', function(worker) {
        timeouts[worker.uniqueID] = setTimeout(function(){
            console.info("worker " + worker.uniqueID+":"+worker.process.pid + " timed out after 2000ms");
            worker.kill(); // sets worker.suicide = true
        }, 3000);
    });
    cluster.on('listening', function(worker, address) {
        console.info("worker " + worker.uniqueID+":"+worker.process.pid + " is now connected to " + address.address + ":" + address.port);
        clearTimeout(timeouts[worker.uniqueID]);
    });
    cluster.on('disconnect', function(worker) {
        console.info('worker ' + worker.uniqueID+":"+worker.process.pid + ' has disconnected');
    });
    cluster.on('exit', function(worker, code, signal) {
        clearTimeout(timeouts[worker.uniqueID]);
    });
    cluster.on('exit', function(worker, code, signal) {
//        if (worker.suicide === true) {
//            console.info('worker ' + worker.uniqueID+":"+worker.process.pid + ' died ('+exitCode+'). suicide, not restarting');
//        } else {
            var exitCode = worker.process.exitCode;
            console.info('worker ' + worker.uniqueID+":"+worker.process.pid + ' died ('+exitCode+'). restarting...');
            cluster.fork(); // restart
//        }
    });
} else {
    var server = require("./InfographicGenerator.js");
}

