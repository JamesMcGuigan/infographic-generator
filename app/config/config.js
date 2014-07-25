var fs     = require('fs');
var path   = require('path');
var extend = require("node.extend");

var config = {
    name: 'Infographic Generator',
    access_log: '/var/log/supervisor/node/infographic-access.log',
    error_log:  '/var/log/supervisor/node/infographic-error.log',
    debug_log:  '/var/log/supervisor/node/infographic-debug.log',

    db:      'mongodb://localhost/infographic',
    web: {
        host: "https://localhost:4001",
        port: {
            http:  80,
            https: 443
        }
    },
    sslcert: {
        key:  fs.readFileSync(path.join(__dirname, '../sslcert/san/infographic.san.key'), 'utf8'),
        cert: fs.readFileSync(path.join(__dirname, '../sslcert/san/infographic.san.crt'), 'utf8')
    },
    basicAuth: {
        realm: "Infographic Generator",
        user:  "info",
        pass:  "graphic"
    },
    cookieSecret:  "Sometimes me think what is love, and then me think love is what last cookie is for. Me give up the last cookie for you!",
    sessionSecret: "Don't try to write too much in a single session. One thousand words a day is quite enough. Stop after about four or five hours?",

    facebook: {
        clientID:       '',
        clientSecret:   '',
        callbackURL:    '/auth/facebook/callback',
        apiURL:         '',
        apiCacheSeconds: 600
    },
    google: {
        clientID:       '',
        clientSecret:   '',
        callbackURL:    '/auth/google/callback',
        apiURL:         '',
        apiCacheSeconds: 600
    },
    twitter: {
        clientID:        '',
        clientSecret:    '',
        callbackURL:     '/auth/twitter/callback',
        apiURL:          '',
        apiCacheSeconds: 600
    }
};

module.exports = {
    test: extend(true, {}, config, {
        db: 'mongodb://localhost/infographic-test',
        web: {
            host: "http://localhost:4400",
            port: {
                http:  4400,
                https: 4401
            }
        }
    }),
    development: extend(true, {}, config, {
        web: {
            host: "http://localhost:4000",
            port: {
                http:  4000,
                https: 4001
            }
        }
    }),
    staging: extend(true, {}, config, {
        db: 'mongodb://infographic.staging.infographic.jamesmcguigan.com/infographic',
        web: {
            host: "http://staging.infographic.jamesmcguigan.com",
            port: {
                http:  80,
                https: 443
            }
        }
    }),
    production:  extend(true, {}, config, {
        db: 'mongodb://infographic.jamesmcguigan.com/infographic',
        web: {
            host: "http://infographic.jamesmcguigan.com",
            port: {
                http:  80,
                https: 443
            }
        }
    })
};