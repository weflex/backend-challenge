var http = require('http');

exports.createServer = function () {
  var middlewares = [];

  function next(req, res, index) {
    if(index == undefined) {
      index = -1;
    }
    return function () {
      for(var i = index + 1; i < middlewares.length; i++) {
        if(middlewares[i].path == '*' || middlewares[i].path == req.url) {
          middlewares[i].action.call(this, req, res, next(req, res, i));
          return;
        }
      }
    }
  }

  var server = http.createServer(function (req, res) {
    next(req, res)();
  });

  http.Server.prototype.use = function () {
    if(arguments.length == 1) {
      middlewares.push({
        path: '*',
        action: arguments[0]
      });
    } else {
      middlewares.push({
        path: arguments[0],
        action: arguments[1]
      });
    }
  }
  return server;
}
