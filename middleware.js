var http = require('http');

exports.createServer = function () {
  var app = {}
  var middlewares = [];

  var server = http.createServer(function (req, res) {
    function next(index) {
      if(index == undefined) {
        index = 0;
      }
      return function () {
        if(middlewares[index].path == '/' || middlewares[index].path == req.url) {
          middlewares[index].handle(req, res, next(index + 1));
          return;
        } else {
          next(index + 1)();
        }
      }
    }
    next()();
  });

  app.use = function (path, handle) {
    if('string' !== typeof path) {
      handle = path;
      path = '/';
    }

    if('function' !== typeof handle) {
      throw new Error('Arguments type error');
    }

    middlewares.push({
      path: path,
      handle: handle
    });
  }

  app.listen = function() {
    return server.listen.apply(server, arguments)
  }

  return app;
}
