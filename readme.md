# pino-http-print

[![CI](https://github.com/pinojs/pino-http-print/actions/workflows/ci.yml/badge.svg)](https://github.com/pinojs/pino-http-print/actions/workflows/ci.yml)

Debug HTTP printer for pino

```sh
[1574071926285] GET http://localhost:20000/api/activity/component 200\n
```

## Usage as Pino Transport

You can use this module as a [pino transport](https://getpino.io/#/docs/transports?id=v7-transports) like so:

```js
const pino = require('pino')
const transport = pino.transport({
  target: 'pino-http-print',
  level: 'info',
  options: {
    destination: 1, // optional (default stdout)
    all: true,
    colorize: false,
    translateTime: true
    ... // other options
  }
})
pino(transport)
```

The options object's properties are [described below](#options).
There is only one extra property:

+ `prettyOptions`: this property is forwarded to `pino-pretty` for non-http logs (when `all` is true). It must be [`pino-pretty` options](https://github.com/pinojs/pino-pretty/blob/master/Readme.md#options) object. 


## Usage as module

### Supports

* [express-pino-logger](http://npm.im/express-pino-logger)
* [restify-pino-logger](http://npm.im/restify-pino-logger)
* [koa-pino-logger](http://npm.im/koa-pino-logger)
* [pino-http](http://npm.im/pino-http)
* [hapi-pino](http://npm.im/pino-http) (via CLI only)

```js
const { httpPrintFactory } = require('pino-http-print')
const printer = httpPrintFactory()
var logger = require('pino-http')(printer)
```

```js
const { httpPrintFactory } = require('pino-http-print')
const printer = httpPrintFactory()
const logger = require('express-pino-logger')(printer)
```

Same for `koa-pino-logger` and `restify-pino-logger`, 
just pass in the `printer` stream.

### API

### httpPrintFactory(options, pinoPrettyOptions) => ( Function([Stream]) => Stream )

Returns a new printer.
The common options between this and [`pino-pretty` options](https://github.com/pinojs/pino-pretty/blob/master/Readme.md#options) are set from the first object itself. `pinoPrettyOptions` is forwarded to `pino-pretty` for non-http logs (when `all` is true).

See the [Options](#options) section for all possible options.

### printer([Stream]) => Stream

Returns a stream that will pull off 

### Options

Options argument for `httpPrintFactory` with keys corresponding to the options described in [CLI Arguments](#cli-arguments):

```js
{
  colorize: colorette.isColorSupported, // --colorize
  all: false, // --all
  translateTime: false, // --translateTime
  relativeUrl: false, // --relativeUrl
  lax: false  // --lax
}
```

The `colorize` default follows
[`colorette.isColorSupported`](https://github.com/jorgebucaran/colorette#iscolorsupported).

## Usage as Pino Legacy Transport

Pino supports a [legacy transport interface](https://getpino.io/#/docs/transports?id=legacy-transports)
that is still supported by this module.

```sh
npm install -g pino-http-print
```

Spin up server that uses a pino http logger and pipe it to `pino-http-print`

```sh
node server | pino-http-print
```

### CLI Arguments

- `-all` (`-a`): Causes `pino-http-print` to also print non-HTTP log messages by passing them through to `pino-pretty`.
- `--colorize` (`-c`): Adds terminal color escape sequences to the output.
- `--translateTime` (`-t`): Translate the epoch time value into a human readable
  date and time string. This flag also can set the format string to apply when
  translating the date to human readable format. This is the same as `pino-pretty` [translateTime](https://github.com/pinojs/pino-pretty/blob/master/Readme.md#cli-arguments)
  - The default format is `yyyy-mm-dd HH:MM:ss.l o` in UTC.
- `--relativeUrl` (`-r`): print only the relative url

## LICENSE

MIT

## Acknowledgements

* Sponsored by [nearForm](http://nearform.com)

