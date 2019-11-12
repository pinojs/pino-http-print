const printerFactory = require('./')
const printer = printerFactory()
const through = require('through2')
const test = require('tap').test

const log = '{"pid":13961,"hostname":"MacBook-Pro-4","level":30,"time":1469122492244,"msg":"request completed","res":{"statusCode":200,"header":"HTTP/1.1 200 OK\\r\\ncontent-type: application/json; charset=utf-8\\r\\ncache-control: no-cache\\r\\nvary: accept-encoding\\r\\ncontent-encoding: gzip\\r\\ndate: Thu, 21 Jul 2016 17:34:52 GMT\\r\\nconnection: close\\r\\ntransfer-encoding: chunked\\r\\n\\r\\n"},"responseTime":17,"req":{"id":8,"method":"GET","url":"/api/activity/component","headers":{"host":"localhost:20000","connection":"keep-alive","cache-control":"max-age=0","accept":"application/json","user-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36","referer":"http://localhost:20000/","accept-encoding":"gzip, deflate, sdch","accept-language":"en-US,en;q=0.8,de;q=0.6","cookie":"_ga=GA1.1.204420087.1444842476"},"remoteAddress":"127.0.0.1","remotePort":61543},"v":1}\n'
const nonHttpLog = '{"pid":48079,"hostname":"MacBook-Pro-4","level":30,"time":1557721475837,"msg":"This is not a request/response log","v":1}\n'

test('outputs log message for req/res serialized pino log', function (assert) {
  var expected = '[1469122492244] GET http://localhost:20000/api/activity/component 200\n'
  var p = printer(through(function (line) {
    assert.is(line.toString(), expected)
    assert.end()
  }))
  p.write(log)
})

test('translates time when option is set', function (assert) {
  const translateTimePrinter = printerFactory({ translateTime: true })
  var expected = '[2016-07-21 17:34:52.244 +0000] GET http://localhost:20000/api/activity/component 200\n'
  var p = translateTimePrinter(through(function (line) {
    assert.is(line.toString(), expected)
    assert.end()
  }))
  p.write(log)
})

test('use relative url when option is set', function (assert) {
  const relativeUrlPrinter = printerFactory({ relativeUrl: true })
  var expected = '[1469122492244] GET /api/activity/component 200\n'
  var p = relativeUrlPrinter(through(function (line) {
    assert.is(line.toString(), expected)
    assert.end()
  }))
  p.write(log)
})

test('does not output non-http log messages by default', function (assert) {
  var printedLines = []

  var p = printer(through(function (line) {
    printedLines.push(line.toString())
  }))

  p.write(nonHttpLog)

  setImmediate(() => {
    assert.is(printedLines.length, 0)
    assert.end()
  })
})

test('outputs non-http log messages when `all` option is set to `true`', function (assert) {
  const expected = '[1557721475837] INFO  (48079 on MacBook-Pro-4): This is not a request/response log\n'
  const allPrinter = printerFactory({ all: true })

  var printedLines = []

  var p = allPrinter(through(function (line) {
    printedLines.push(line.toString())
  }))

  p.write(nonHttpLog)

  setImmediate(() => {
    assert.is(printedLines.length, 1)
    assert.is(printedLines[0], expected)
    assert.end()
  })
})

test('passes options to pino-pretty when `all` option is set to `true`', function (assert) {
  const expected = '[2019-05-13 04:24:35.837 +0000] INFO  (48079 on MacBook-Pro-4): This is not a request/response log\n'
  const allPrinter = printerFactory({ all: true }, { translateTime: true })

  var printedLines = []

  var p = allPrinter(through(function (line) {
    printedLines.push(line.toString())
  }))

  p.write(nonHttpLog)

  setImmediate(() => {
    assert.is(printedLines.length, 1)
    assert.is(printedLines[0], expected)
    assert.end()
  })
})

test('logs to process.stdout by default', function (assert) {
  var expected = '[1469122492244] GET http://localhost:20000/api/activity/component 200\n'
  var p = printer()
  var write = process.stdout.write
  process.stdout.write = function (chunk, enc, cb) {
    process.stdout.write = write
    assert.is(chunk.toString(), expected)
    assert.end()
  }
  p.write(log)
})
