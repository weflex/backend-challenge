var http = require('http');
var url = require('url');

var app = {};

app.use = function (route, fn) {
    if ('function' == typeof route) {
        fn = route;
        route = '/';
    }
    // maybe ignore wrong arguments handler
    if ('function' == typeof fn) {
        this.handlers.push({route: route, handleFn: fn});
    }
};

app.handle = function (req, res) {
    var index = 0;
    var path = url.parse(req.url).pathname;
    if (undefined === path) path = '/';

    function next() {
        var handler = app.handlers[index++];

        if (!handler) {
            return;
        }

        if (handler.route === '/' || handler.route === path.toLowerCase()) {
            handler.handleFn(req, res, next);
        } else {
            return next();
        }
    }

    next();
};

app.listen = function () {
    var server = http.createServer(this.handle);
    return server.listen.apply(server, arguments);
};

exports.createServer = function () {
    app.handlers = [];
    return app;
};