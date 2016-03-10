var http = require('http');

var app = {};

app.handle = function handle (req, res) {
  var index = 0;

  function next () {
    var stack = app.stack[index++];
    if (!stack) return;

    if (stack.route === '/' || stack.route === req.url) {
      stack.handle(req, res, next);
    } else {
      next();
    }
  }
  next();
}

app.use = function use (route, handle) {
  if (typeof route !== 'string') {
    handle = route;
    route = '/';
  }

  if (typeof handle !== 'function')
    throw new TypeError('handle needs to be a function');

  this.stack.push({route: route, handle: handle});
}

app.listen = function listen () {
  return this.server.listen.apply(this.server, arguments);
};

exports.createServer = function () {
  app.stack = [];
  app.server = http.createServer(app.handle);
  return app;
};
