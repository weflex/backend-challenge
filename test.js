var request = require('supertest');
var middleware = require('./middleware');


describe('middleware', function () {
  describe('#use', function () {
    it('should register a function middleware', function (done) {
      var app = middleware.createServer();

      app.use(function (req, res) {
        res.write('hello');
        res.end();
      });

      app.listen(3000, function () {
        request(this)
          .get('/')
          .expect(200)
          .expect('hello', done);
      });
    });

    it('should match path by middleware', function (done) {
      var app = middleware.createServer();

      app.use(function (req, res, next) {
        res.write('hello');
        next()
      });

      app.use('/world', function (req, res) {
        res.write('world');
        res.end();
      });

      app.use('/boo', function (req, res) {
        res.write('boo');
        res.end();
      });

      app.listen(3001, function () {
        var self = this;
        request(this)
          .get('/boo')
          .expect(200)
          .expect('helloboo', function () {
            request(self)
              .get('/world')
              .expect(200)
              .expect('helloworld', done);
          });
      });

    });

    it('should match a complicated multi-match case', function (done) {
      var app = middleware.createServer();

      app.use(function (req, res, next) {
        res.write('a');
        next();
      });

      app.use('/hello', function (req, res, next) {
        res.write('b');
        next();
      });

      app.use(function (req, res, next) {
        res.write('c');
        next();
      });

      app.use('/hello', function (req, res) {
        res.end('hello');
      });

      app.use('/goodbye', function (req, res) {
        res.end('goodbye');
      });

      app.use(function (req, res) {
        res.end('end');
      });

      app.listen(3003, function () {
        var self = this;

        request(self)
          .get('/')
          .expect(200)
          .expect('acend', function () {
            request(self)
              .get('/hello')
              .expect(200)
              .expect('abchello', function () {
                request(self)
                  .get('/goodbye')
                  .expect(200)
                  .expect('acgoodbye', done);
              });
          });
      });
    });

    it('handler not function', function (done) {
      var app = middleware.createServer();

      app.use('/', false);

      app.use('/', function (req, res, next) {
        next();
      });

      app.use(function (req, res) {
        res.end('end');
      });

      app.listen(3005, function () {
        var self = this;

        request(self)
          .get('/')
          .expect(200)
          .expect('end', done);
      });
    });

  });

  describe('#listen', function () {
    it('should register a function middleware', function (done) {
      var app = middleware.createServer();

      app.use(function (req, res, next) {
        res.write('hello');
        next();
      });

      app.use(function (req, res) {
        res.write('world');
        res.end();
      });

      app.listen(3004, function () {
        request(this)
          .get('/')
          .expect(200)
          .expect('helloworld', done);
      });
    });
  });
});
