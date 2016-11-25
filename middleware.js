var http = require('http');

exports.createServer = function () {
  
  const app = http.createServer(function(req, res){
    if (app.handlers){

      var fns = [];
      app.handlers.forEach(function(ele){
        if (typeof ele[0] === 'string'){
          if (ele[0] === req.url){
            fns = fns.concat(ele[1]);
          }
        }else{
            fns = fns.concat(ele[0]);
        }
      })
      console.log(app.handlers)
      // .fo
      // if (app.handlers){
      //   fns = fns.concat(app.handlers._all);
      // }

      // if(app.handlers[req.url]){
      //   fns = fns.concat(app.handlers[req.url])
      // }

      var i = 0;
      function next(){
        i ++ ;
        if (fns[i]){
          fns[i](req,res,next);
        }
      }
      // console.log(app.handlers[req.url])

      fns[i](req,res,next);

      

      // app.handlers._all.forEach(function(fn){
      //   fn(req, res);
      // });


      
    }
    
  });

  app.use = function (path, handler){
    if (typeof(path) === 'string'){
      if(app.handlers){
        app.handlers = [ ...app.handlers, [path, handler]];
      }else {
        app.handlers = [[path, handler]];  
      }
    }else{
      
      if(app.handlers){
        app.handlers = ([...app.handlers, [path]]);
      }else{
        app.handlers = [[path]];
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
