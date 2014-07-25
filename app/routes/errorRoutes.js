module.exports = function(app) {
    app.use(function(err, req, res, next){
        res.status(err.status || 500);
        res.render('500', { error: err });
    });
    app.use(function(req, res, next){
        res.status(404);
        if( req.accepts('html') ) { res.render('404', { url: req.url }); return; }
        if( req.accepts('json') ) { res.send({ error: 'Not found' });    return; }
        else                      { res.type('txt').send('Not found');   return; }
    });
}
