var config           = require('../config/config.js')[process.env.NODE_ENV];
var streamify        = require('../util/streamify.js');
var fs               = require('fs');
var gm               = require('gm');
var exec             = require('child_process').exec;

module.exports = function(app){
    app.post("/GraphicsMagick/svg/", function(request, response) {
        var uuid        = request.body.uuid;
        var svg         = request.body.svg;
        var format      = request.body.format || "jpg";
        var svgfile     = "svgRendered/" + uuid + ".svg";
        var outfile     = "svgRendered/" + uuid + "." + format;

        fs.writeFile(svgfile, svg, function(err) {
            exec("convert " + svgfile + " " + outfile, function(error, stdout, stderr) {
                response.writeHead(200, {"Content-Type": "application/json"});
                response.write(JSON.stringify({
                    success: true,
                    svgfile: svgfile,
                    outfile: outfile,
                    url:     config.web.host + "/" + outfile + "?" + Date.now()
                }));
                response.end("\n");
            });
        });

//        fs.writeFile(svgfile, svg, function(err) {
//            if( err ) { console.log(err); return; }
//
//            gm(svgfile).command("convert").write(pngfile, function (err) {
//                if (!err) { console.log('convert '+svgfile+' -> '+pngfile ); }
//
//            });
//        });
    });
};