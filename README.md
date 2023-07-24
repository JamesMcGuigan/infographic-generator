Infographic Generator
=====================

Proof of concept demonstration for generating custom infographics, built in javascript using node.js, angular.js, d3.js and GraphicsMagick.

- http://infographic.jamesmcguigan.com - live demo with unminified sources
- https://production.infographic.jamesmcguigan.com - live SSL demo with minified js/css

Installation
============
<pre><code>
sudo mkdir /var/log/node/;
chmod a+rw /var/log/node/;
sudo apt install nodejs ruby-dev ruby-rubygems graphicsmagick 
sudo gem install compass

git clone git@github.com:JamesMcGuigan/infographic-generator.git
cd infographic-generator
npm install  # will also download bower dependencies and compile the client side browserify.js file
npm start    # runs nodemon and compass for development

# For production deployment
npm run production  # compiles minified js/css into ./production/
node InfographicGenerator.js NODE_ENV=production PORT_HTTP=3012 PORT_HTTPS=3013
</code></pre>

Then open up the following localhost url
http://localhost:4000/

See [package.json](https://github.com/JamesMcGuigan/infographic-generator/blob/master/package.json) for a list of other project npm scripts


Puppet configuration
====================

Demo server deployment is managed via puppet using the following project:  
https://github.com/JamesMcGuigan/puppet-config


Project Layout
==============

- [/data/](https://github.com/JamesMcGuigan/infographic-generator/tree/master/data) - Example configuration files
- [/data/sources/](https://github.com/JamesMcGuigan/infographic-generator/tree/master/data/sources/) - Example data sources
- [/app/config/config.js](https://github.com/JamesMcGuigan/infographic-generator/tree/master/app/config/config.js) - Node configuration file
- [/app/controllers/](https://github.com/JamesMcGuigan/infographic-generator/tree/master/app/controllers/) - Node API logic
- [/app/routes/](https://github.com/JamesMcGuigan/infographic-generator/tree/master/app/routes/) - Node URL routing
- [/app/views/](https://github.com/JamesMcGuigan/infographic-generator/tree/master/app/views/) - Mustache templates for generating initial HTML page
- [/app/public/scss-src/](https://github.com/JamesMcGuigan/infographic-generator/tree/master/app/public/scss-src/) - SASS source files
- [/app/public/scss/](https://github.com/JamesMcGuigan/infographic-generator/tree/master/app/public/scss/) - Compiled SASS -> CSS
- [/app/public/html/](https://github.com/JamesMcGuigan/infographic-generator/tree/master/app/public/html/) - Angualar HTML Snippits
- [/app/public/angular/](https://github.com/JamesMcGuigan/infographic-generator/tree/master/app/public/angular/) - Angualar.js Application
- [/app/public/angular/directive/directive.infographic.js](https://github.com/JamesMcGuigan/infographic-generator/tree/master/app/public/angular/directive/directive.infographic.js) - The main logic for the SVG generator

Infographic JSON Configuration Spec
===================================

*Sample Configuration Files:*
- https://github.com/JamesMcGuigan/infographic-generator/blob/master/data/chart1.json
- https://github.com/JamesMcGuigan/infographic-generator/blob/master/data/chart2.json

*Sample Defaults Files:*
- http://infographic.jamesmcguigan.com/data/sources/defaults.json

*Sample Data Files:*
- http://infographic.jamesmcguigan.com/data/sources/mexico-brazil-shots.json
- http://infographic.jamesmcguigan.com/data/sources/player-passes.json

The JSON configuration file starts with a root "type":"svg" element, followed by an array of "children" elements. The code will auto-convert between arrays and objects as needed.

Any property name can be suffixed with URL to load data from a remote url, ie "defaults" -> "defaultsURL"

{
- "defaults":       this hash is organized by type, and inherits down the tree. It provides defaults options that can be overridden in children elements.
- "title":          this property on the "svg" root node is shown in the file listings dialog
- "label":          this property is just a human readable string for easily identifying elements
- "type":           "svg"|"image"|"rect"|"text"|"chart" - creates a SVG element of the same name, "chart" will render a custom d3.js SVG object
- "attr":           this property exposes the raw SVG attributes for each element - either read the book ["SVG Essentials"](http://read.pudn.com/downloads135/ebook/573344/OReilly-SVG-Essential.pdf) or see the the full technical SVG spec: http://www.w3.org/TR/SVG11/
- "attr":           { x: 0, y: 0, height: "100px", width: "100px", "xlink:href": <url>, "font-size": "24px", "line-height": "24px", "fill": "black", "fill-opacity": 0.5 } - these are the most common and useful attributes 
- "align":          "Top|Middle|Bottom" + "Left|Center|Right" - 
- "margin":         custom property which adds some additional xy spacing when used with "align"
- "content":        for "type":"text" objects only, provides the content for the string
- "children"        [{},{},{},...] of child nodes to be rendered relative to the parent xy and height|width  
 
*Chart Specific Options*
- "chart":          currently only "BarChart"|"DonutChart"|"DotChart" - which type of chart to draw
- "data"|"dataURL": provides configuration data for the chart, typically: { "values": { "field": value, ... }, "colors": { "field": color, ... } }
- "options":        "DonutChart" only { "borderRadius": 20, "highlightRadius": 10, "highlight": { "outside": "white" } }

*Text Interpolation*
- "content" strings can be include "#{values.outside} / #{stats.total}" using dot separated notation
- "#{values.field}" reads values from "data.values"
- "#{colors.field}" reads values from "data.colors"
- "#{stats.length}" number of entries in data.values
- "#{stats.max}"    maximum number in data.values
- "#{stats.min}"    minimum number in data.values
- "#{stats.total}"  sum of numbers in data.values
- "#{stats.percent.field}"  percentage string (ie "85%") calculated using: values.field / stats.total
- "#{stats.factor.value}"   number of times each individual string/number value was encountered 
-  #{stats.colors.factor.white} number of "white" entries in data.colors

}

The JSON configuration file needs to be syntactically valid, which mostly means quoting "key": "value" (except raw numbers) 
and making sure commas are in the correct places (after every item in a list, except the last)


TODO
====

- JSON configuration files are currently saved only to the filesystem, this made life easier for development. It would be relatively easy to add in MongoDB support.
  
- There is currently no way of editing the /data/sources/*.json via the web interface, but you can always switch from "dataURL" to "data" for inline editing

- In theory a custom AJAX interface could be created for editing this configuration file could be created, but learning JSON and SVG attributes is fairly easy 

- BUG: the positioning of "children" inside "type":"chart" entries is currently buggy
