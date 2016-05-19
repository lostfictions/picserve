#!/usr/bin/env node
const imgSearch = require('./imgsearch')
const opn = require('opn')

imgSearch(process.argv[2])
  .then(function (result) {
    opn(result, { wait: false })
  })
  .catch(function (error) {
    console.error(error)
  })
