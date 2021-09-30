'use strict'

const chalk = require('chalk')
const { prettifyTime } = require('pino-pretty/lib/utils')
const prettyMs = require('pretty-ms')

const ctx = new chalk.Instance({ level: 3 })
const colored = {
  default: ctx.white,
  60: ctx.bgRed,
  50: ctx.red,
  40: ctx.yellow,
  30: ctx.green,
  20: ctx.blue,
  10: ctx.grey,
  method: ctx.cyan
}
/**
 * @typedef {Object} HttpPrintOptions
 * @property {boolean} [all] support all log messages, not just HTTP logs
 * @property {boolean} [colorize] colorize logs, default is automatically set by chalk.supportsColor
 * @property {boolean|string} [translateTime] (default: false) When `true` the timestamp will be prettified into a string,
 *  When false the epoch time will be printed, other valid options are same as for `pino-pretty`
 * @property {boolean} [relativeUrl] (default: false)
 * @property {boolean} [lax] (default: false) When `true` the JSON parser will silently discard unparseable logs, e.g.
 * from nodemon
 */

/** @type {HttpPrintOptions} */
const defaultOptions = {
  colorize: chalk.supportsColor,
  translateTime: false,
  relativeUrl: false,
  all: false,
  lax: false
}

/**
 * @param {any} o
 * @param {HttpPrintOptions} opts
 */

function format (o, opts) {
  const time = prettifyTime({ log: o, translateFormat: opts.translateTime })
  const url = (opts.relativeUrl ? '' : ('http://' + o.req.headers.host)) + o.req.url
  const responseTime = prettyMs(o.responseTime)

  if (!opts.colorize) {
    return time + ' ' + o.req.method + ' ' + url + ' ' + o.res.statusCode + ' ' + responseTime + '\n'
  }

  const levelColor = colored[o.level] || colored.default
  return time + ' ' + colored.method(o.req.method) + ' ' +
    url + ' ' + levelColor(o.res.statusCode) + ' ' + responseTime + '\n'
}

module.exports = {
  defaultOptions,
  format
}
