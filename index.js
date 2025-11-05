'use strict'

const parse = require('ndjson').parse
const through = require('through2').obj
const { prettyFactory } = require('pino-pretty')

const { defaultOptions, format } = require('./lib/utils')
const transport = require('./lib/transport')

/**
 * @typedef {Object} HttpPrintOptions
 * @property {boolean} [all] support all log messages, not just HTTP logs
 * @property {boolean} [colorize] colorize logs, default is automatically set by colorette.options.enabled
 * @property {boolean|string} [translateTime] (default: false) When `true` the timestamp will be prettified into a string,
 *  When false the epoch time will be printed, other valid options are same as for `pino-pretty`
 * @property {boolean} [relativeUrl] (default: false)
 * @property {boolean} [lax] (default: false) When `true` the JSON parser will silently discard unparseable logs, e.g.
 * from nodemon
 */

/**
 * @param {HttpPrintOptions} [options]
 * @param {Object} [prettyOptions] options to forward to `pino-pretty` when `all` option is set
 */
function httpPrintFactory (options, prettyOptions = { translateTime: false }) {
  const opts = Object.assign({}, defaultOptions, options)
  // When `translateTime` is `true`, `pino-pretty` will use the `DATE_FORMAT_SIMPLE`
  // format. This module expects it to be the `DATE_FORMAT` format.
  prettyOptions.translateTime = prettyOptions?.translateTime === true
    ? 'yyyy-mm-dd HH:MM:ss.l o'
    : prettyOptions?.translateTime
  const prettyPrinter = prettyFactory(Object.assign({}, {
    colorize: opts.colorize,
    ignore: '',
    colorizeObjects: false
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
