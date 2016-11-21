const http = require('http')

exports.createServer = function () {
  const router = []
  const app = http.createServer((req, res) => {
    let next
    for (let [path, callback] of router) {
      if (path === null || path === req.url) {
        next = false
        callback(req, res, () => {
          next = true
        })
        if (!next) break
      }
    }
    if (!res.finished) {
      res.end()
    }
  })
  return {
    use: (path, callback) => {
      if (typeof path === 'function') {
        callback = path
        path = null
      }
      router.push([path, callback])
    },
    listen: (port, onListening) => {
      return app.listen(port, onListening)
    },
  }
}
