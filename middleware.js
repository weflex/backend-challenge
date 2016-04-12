var http = require('http');
var url = require('url');

module.exports = {
  createServer: function () {
    var routes = [];

    return {
      use: function (path, handler) {
        if (typeof path === 'function') {
          handler = path;
          path = '*';
        }
        routes.push({ [path]: handler });
      },
      listen: function (port, callback) {
        const server = http.createServer(function (req, res) {
          var path = url.parse(req.url).pathname;
          var i = 0;

          function next(err) {
            if (err) {
              res.statusCode = 500;
              res.end(err.message);
            } else {
              var route   = routes[i];
              var key     = Object.keys(route)[0];
              var handler = route[key];
              i++;

              if ((key === '*' || path === key) && handler) {
                handler(req, res, next);
              } else if (i !== routes.length) {
                next();
              } else {
                res.end();
              }
            }
          }
          next();
        });
        return server.listen(port, callback);
      }
    };
  }
};
