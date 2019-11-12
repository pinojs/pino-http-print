const parse = require('ndjson').parse
const through = require('through2').obj
const prettyFactory = require('pino-pretty')

/**
 * @typedef {Object} HttpPrintOptions
 * @property {boolean} [all]
 */

/** @type {HttpPrintOptions} */
const defaultOptions = {
  all: false // support all log messages, not just HTTP logs
}

/**
 * @param {HttpPrintOptions} [options]
 * @param {Object} [prettyOptions] options to forward to `pino-pretty` when `all` option is set
 */
module.exports = function httpPrintFactory (options, prettyOptions) {
  const opts = Object.assign({}, defaultOptions, options)
  const prettyPrinter = prettyFactory(prettyOptions)

  /**
   * @param {any} [stream] A writeable stream, if not passed then process.stdout is used
   */
  return function (stream) {
    var printer = parse()
    var transform = through(function (o, _, cb) {
      if (!o.req || !o.res) {
        if (opts.all === true) {
          // Pass non-http log message through to pino-pretty
          cb(null, prettyPrinter(o))
        } else {
          cb(null, null)
        }
      } else {
        var time = new Date(o.time).toISOString().split('T')[1].split('.')[0]
        var log = time + ' ' + o.req.method + ' http://' + o.req.headers.host +
          o.req.url + ' ' + o.res.statusCode + '\n'
        cb(null, log)
      }
    })
    printer.pipe(transform).pipe(stream || process.stdout)

    return printer
  }
}
