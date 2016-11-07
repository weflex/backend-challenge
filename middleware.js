var http = require('http');

exports.createServer = function () {
  
  const app = http.createServer(function(req, res){
    if (app.handlers){

      next
      var fns = [];
      if (app.handlers._all){
        fns = fns.concat(app.handlers._all);
      } 

      if(app.handlers[req.url]){
        fns = fns.concat(app.handlers[req.url])
      }

      var i = 0;
      function next(){
        i ++ ;
        if (fns[i]){
          fns[i](req,res,next);
        }
      }
      console.log(app.handlers._all)

      fns[i](req,res,next);

      

      // app.handlers._all.forEach(function(fn){
      //   fn(req, res);
      // });


      
    }
    res.end('okay');
  });

  app.use = function (path, handler){
    if (typeof(path) === 'string' ){
      if(app.handlers){
        app.handlers[path] = handler;
      }else {
        app.handlers = {};
        app.handlers[path] = handler;  
      }
    }else{
      if(app.handlers && app.handlers['_all']){
        app.handlers['_all'] = app.handlers['_all'].concat([path]);
      }else if (app.handlers){
        app.handlers['_all'] = [path];  
      }else{
        app.handlers = {_all: [path]}
      }
    }
  };
  
  // app.listen = function (port, callBack) {
  //   app.listen(port, function(){
  //     callBack();
  //   });
  // };

  return app;
};
