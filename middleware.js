var http = require('http');

var app = {};

app.handle = function (req, res) {
  var index = 0;

  function next() {
    if(index >= app.middlewares.length) {
      return;
    }

    var middleware = app.middlewares[index++];

    if(middleware.path === '/' || middleware.path === req.url) {
      middleware.handle(req, res, next);
      return;
    } else {
      next();
    }
  }

  next();
}

app.use = function (path, handle) {
  if('string' !== typeof path) {
    handle = path;
    path = '/';
  }

  if('function' !== typeof handle) {
    throw new TypeError('handle is required to be a function.');
  }

  this.middlewares.push({
    path: path,
    handle: handle
  });
}

app.listen = function() {
  return this.server.listen.apply(this.server, arguments)
}

exports.createServer = function () {
  app.middlewares = [];
  app.server = http.createServer(app.handle);
  return app;
}
