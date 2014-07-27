var stream = require('stream');
var streamify = function(text) {
    var s = new stream.Readable();
    s._read = function() {}; // "All Readable stream implementations must provide a _read method to fetch data from the underlying resource."
    s.push(text);
    s.push(null);
    return s;
};
module.exports = streamify;