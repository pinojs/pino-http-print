
const parse = require('ndjson').parse
const through = require('through2').obj
const { prettyFactory } = require('pino-pretty')

const { defaultOptions, format } = require('./lib/utils')
const transport = require('./lib/transport')

/**
 * @param {HttpPrintOptions} [options]
 * @param {Object} [prettyOptions] options to forward to `pino-pretty` when `all` option is set
 */
function httpPrintFactory (options, prettyOptions) {
  const opts = Object.assign({}, defaultOptions, options)
  const prettyPrinter = prettyFactory(Object.assign({}, {
    colorize: opts.colorize,
    translateTime: opts.translateTime
  }, prettyOptions))

  /**
   * @param {any} [stream] A writeable stream, if not passed then process.stdout is used
   */
  return function (stream) {
    const printer = parse({ strict: !opts.lax })
    const transform = through(function (o, _, cb) {
      if (!o.req || !o.res) {
        if (opts.all === true) {
          // Pass non-http log message through to pino-pretty
          cb(null, prettyPrinter(o))
        } else {
          cb(null, null)
        }
      } else {
        const log = format(o, opts)

        cb(null, log)
      }
    })
    printer.pipe(transform).pipe(stream || process.stdout)

    return printer
  }
}

module.exports = transport
module.exports.httpPrintFactory = httpPrintFactory
