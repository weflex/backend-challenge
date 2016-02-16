var http = require('http');

var app = {};

app.handle = function (req, res) {
  function next(index) {
    if(index == undefined) {
      index = 0;
    }
    return function () {
      if(app.middlewares[index].path == '/' || app.middlewares[index].path == req.url) {
        app.middlewares[index].handle(req, res, next(index + 1));
        return;
      } else {
        next(index + 1)();
      }
    }
  }
  next()();
}

app.use = function (path, handle) {
  if('string' !== typeof path) {
    handle = path;
    path = '/';
  }

  if('function' !== typeof handle) {
    throw new Error('Arguments type error');
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
