#!/usr/bin/env node
const args = require('args')
const printFactory = require('./')

args
  .option(['a', 'all'], 'Handle all log messages, not just HTTP request/response logs')

args
  .example('cat log | pino-http-print', 'To prettify only HTTP logs, simply pipe a log file through')
  .example('cat log | pino-http-print -a', 'To prettify both HTTP and non-HTTP log messages use the -a option')

const opts = args.parse(process.argv)
const printer = printFactory(opts)

process.stdin.pipe(printer())
