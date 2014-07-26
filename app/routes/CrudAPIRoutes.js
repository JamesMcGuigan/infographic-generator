var CrudAPI = require("../controllers/CrudAPI.js");

module.exports = function(app, db) {
    app.get(   "/crud/:table",     CrudAPI.get);
    app.get(   "/crud/:table/:id", CrudAPI.get);
//    app.post(  "/api/:table",     CrudAPI.add);
//    app.put(   "/api/:table/:id", CrudAPI.update);
//    app.delete("/api/:table/:id", CrudAPI.delete);
};