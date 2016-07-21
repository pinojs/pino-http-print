#!/usr/bin/env node
var printer = require('./')()

process.stdin.pipe(printer)
