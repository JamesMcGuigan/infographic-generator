var CrudMongoAPI = require("../controllers/CrudMongoAPI.js");
var CrudFileAPI  = require("../controllers/CrudFileAPI.js");

module.exports = function(app, db) {
    app.get(   "/api/mongo/:table",     CrudMongoAPI.get);
    app.get(   "/api/mongo/:table/:id", CrudMongoAPI.get);

    app.get(   "/api/filesystem/",          CrudFileAPI.get);
    app.get(   "/api/filesystem/:filename", CrudFileAPI.get);
    app.post(  "/api/filesystem/:filename", CrudFileAPI.post);

//    app.post(  "/api/:table",     CrudMongoAPI.add);
//    app.put(   "/api/:table/:id", CrudMongoAPI.update);
//    app.delete("/api/:table/:id", CrudMongoAPI.delete);
};