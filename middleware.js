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

  app.use = function () {
    if(arguments.length == 1) {
      middlewares.push({
        path: '/',
        handle: arguments[0]
      });
    } else {
      middlewares.push({
        path: arguments[0],
        handle: arguments[1]
      });
    }
  }

  app.listen = function() {
    return server.listen.apply(server, arguments)
  }

  return app;
}
