var http = require('http');

exports.createServer = function () {
  var stacks = [];


  var app = function (req, res) {
    var i = 0;

    function next() {
      if (!stacks[i]) return;
      var url = stacks[i].url;
      var task = stacks[i++].fun
      if (!task) return;

      if (url == '/' || url == req.url) {
        task(req, res, next);
      } else {
        next();
      }
    }
    next();
  }

  app.use = function (path, callback) {
    if ('string' !== typeof (path)) {
      callback = path;
      path = '/';
    }
    var u = {
      url: path,
      fun: callback
    };
    stacks.push(u);
  };


  app.listen = function (port, callback) {
    http.createServer(app).listen(port, callback);
  }

  return app;
};