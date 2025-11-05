'use strict'

const test = require('node:test')
const assert = require('node:assert')
const os = require('node:os')
const fs = require('node:fs')
const { spawnSync } = require('node:child_process')
const { join } = require('node:path')
const { once } = require('node:events')
const { promisify } = require('node:util')
const pino = require('pino')

const logHttp = require('./fixtures/http-log.json')

const timeout = promisify(setTimeout)

test('http-print pino transport test', async () => {
  const destination = join(
    os.tmpdir(),
    'pino-transport-test.log'
  )

  const fd = fs.openSync(destination, 'w+')
  const options = {
    destination: fd,
    all: false,
    colorize: false,
    translateTime: true
  }

  const transport = pino.transport({
    target: join(__dirname, '../index.js'),
    level: 'info',
    options
  })
  const log = pino(transport)
  assert.ok('built pino')
  await once(transport, 'ready')
  assert.ok('transport ready ' + destination)

  log.info(logHttp)
  log.info('this is just some raw text')
  log.debug(logHttp)
  log.flush()

  await timeout(1000)

  const data = fs.readFileSync(destination, 'utf8')
  assert.equal(data.trim(), '[2016-07-21 17:34:52.244 +0000] GET http://localhost:20000/api/activity/component 200 17ms')
})

test('http-print pino transport test stdout', async () => {
  const result = spawnSync('node', [join(__dirname, 'fixtures', 'log-stdout.js'), '1'], {
    cwd: process.cwd()
  })
  assert.equal(result.status, 0)
  assert.equal(result.stdout.toString().trim(), '[1557721475837] INFO (48079 on MacBook-Pro-4): This is not a request/response log\n    v: 1')
})

test('http-print pino transport test stderr', async () => {
  const result = spawnSync('node', [join(__dirname, 'fixtures', 'log-stdout.js'), '2'], {
    cwd: process.cwd()
  })
  assert.equal(result.status, 0)
  assert.equal(result.stderr.toString().trim(), '[1557721475837] INFO (48079 on MacBook-Pro-4): This is not a request/response log\n    v: 1')
})
