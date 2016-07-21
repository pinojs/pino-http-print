var parse = require('ndjson').parse
var through = require('through2').obj

module.exports = function (stream) {
  var printer = parse()
  var transform = through(function (o, _, cb) {
    if (!o.req || !o.res) { return cb() }
    var time = new Date(o.time).toISOString().split('T')[1].split('.')[0]
    var log = time + ' ' + o.req.method + ' http://' + o.req.headers.host +
      o.req.url + ' ' + o.res.statusCode + '\n'
    cb(null, log)
  })
  printer.pipe(transform).pipe(stream || process.stdout)

  return printer
}

