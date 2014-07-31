var config           = require('../config/config.js')[process.env.NODE_ENV];
var streamify        = require('../util/streamify.js');
var fs               = require('fs');
var gm               = require('gm');
var exec             = require('child_process').exec;

var GraphicsMagickAPI = module.exports = {
    render: function(request, response) {

        var uuid        = request.body.uuid.replace(/^file:/,'');
        var svg         = request.body.svg;
        var format      = request.body.format || "jpg";
        var svgfile     = "data/rendered/" + uuid + ".svg";
        var imgfile     = "data/rendered/" + uuid + "." + format;

        var svgPrefix = '<?xml version="1.0" encoding="ISO-8859-1" standalone="no" ?>' + "\n" +
            '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 20010904//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">' + "\n";

        fs.writeFile(svgfile, svgPrefix + svg, function(err) {
            exec("gm convert " + svgfile + " " + imgfile, function(error, stdout, stderr) {
                response.writeHead(200, {"Content-Type": "application/json"});
                response.write(JSON.stringify({
                    success: true,
                    svgfile: config.web.host + "/" + svgfile,
                    imgfile: config.web.host + "/" + imgfile,
                    url:     config.web.host + "/" + imgfile + "?" + Date.now()
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
    }
};