if (!window.console) {
    window.console = {};
}
if (!window.console.firebug) {
    var names = ["log", "debug", "info", "warn", "error", "assert", "dir", "dirxml",
        "group", "groupEnd", "time", "timeEnd", "count", "trace", "profile", "profileEnd"];

    for (var i = 0; i < names.length; ++i) {
        if (!window.console[names[i]]) {
            window.console[names[i]] = function () { }
        }
    }
}