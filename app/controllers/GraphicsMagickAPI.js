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

        fs.writeFile(svgfile, svg, function(err) {
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