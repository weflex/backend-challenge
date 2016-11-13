var middleware = require('./middleware');
var app = middleware.createServer();
//var app2 = middleware.createServer()
//app2.use('/bb',function(req,res,next){
    console.log('bb')
    next()
})

app.use(function (req, res, next) {
  //console.log(req.url)
  res.write('preamble');
  next();
});
//app.use('/aa',app2)
app.use('/hello', function (req, res, next) {
  res.write('hello');
  next();
});

app.use('/world', function (req, res, next) {
console.log('/world\'s url'+req.url)
res.write('world');
  console.log('asd')
  next();
});

app.use('/', function (req, res, next) {
  res.end();
  console.log('END');
});

app.listen(3000,()=>{
    console.log('server+3000')});
