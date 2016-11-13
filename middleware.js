var http = require('http');
var EventEmitter=require('events').EventEmitter
exports.createServer = createServer

let _proto={}
function createServer(){
    function app(req,res,next){
        app.handle(req,res,next)
    }
    Object.assign(app,_proto)
    Object.assign(app,EventEmitter.prototype)
    app._route='/'
    app._stack=[]
    return app
}
_proto.use=function(route,fn){
    if(typeof route!=='string'){
        fn=route
        route='/'
    }
    if(typeof fn.handle==='function'){
        fn._route=route
        fn=fn.handle.bind(fn)
    }
    if(route[route.length-1]==='/')
        route = route.slice(0,-1)
    this._stack.push({route:route,handle:fn})
    return this
}
_proto.handle=function(req,res,out){
    console.log(out)
    let index = 0,
        removed=''
    let next= err =>{
        
        if(removed.length){
            req.url = removed+req.url
            removed = ''
        }
        let layer = this._stack[index++]
        if(!layer){
        console.log('out')
            out && out(err)
            return 
        }
        let route = layer.route
        if(req.url.substr(0,route.length).toLowerCase()!==route.toLowerCase())
            return next(err)
        let border = req.url[route.length]

        if(border !== undefined && border !=='/')
            return next(err)
        if(route.length !==0 && route!=='/'){
            req.url = req.url.substr(route.length)
            removed = route
            
        }
        let handle = layer.handle
        if(err&&handle.length ===4)
            return handle(err,req,res,next)
        else if(!err && handle.length <4)
            return handle(req,res,next)
        next(err)
    }
    next()
}
_proto.listen=function(...args){
    const server = http.createServer(this)
    return server.listen.apply(server,args)
}
