# pino-http-print

Debug HTTP printer for pino

## Supports

* [express-pino-logger](http://npm.im/express-pino-logger)
* [restify-pino-logger](http://npm.im/restify-pino-logger)
* [koa-pino-logger](http://npm.im/koa-pino-logger)
* [pino-http](http://npm.im/pino-http)
* [hapi-pino](http://npm.im/pino-http) (via CLI only)

## Usage

```js
const printerFactory = require('pino-http-print')
const printer = printerFactory()
var logger = require('pino-http')(printer)
```

```js
const printerFactory = require('pino-http-print')
const printer = printerFactory()
const logger = require('express-pino-logger')(printer)
```

Same for `koa-pino-logger` and `restify-pino-logger`, 
just pass in the `printer` stream.

## Example Output

```sh
17:34:52 GET http://localhost:20000/api/activity/component 200\n
```

## API

## printerFactory(options) => ( Function([Stream]) => Stream )

Returns a new printer. The options currently take one value: `{ all: true | false }`.
When `all` is set to `true`, the printer uses `pino-pretty` to print non-HTTP log messages.

## printer([Stream]) => Stream

Returns a stream that will pull off 

## CLI

```sh
npm install -g pino-http-print
```

Spin up server that uses a pino http logger and pipe it to `pino-http-print`

```sh
node server | pino-http-print
```

Passing `-a` as an argument causes `pino-http-print` to also print non-HTTP log messages by passing them through to `pino-pretty`.

```sh
node server | pino-http-print -a
```

## LICENSE

MIT

## Acknowledgements

* Sponsored by [nearForm](http://nearform.com)

