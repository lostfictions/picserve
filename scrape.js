/*eslint semi: ["error", "never"], strict: 0*/
'use strict'

const x = require('x-ray')()
const async = require('async')
const _ = require('lodash')
const fs = require('fs-extra')
// const url = require('url')

async.waterfall(
  [
    (cb) => x('http://www.hardcoregaming101.net/alpha.htm', ['.main h4 a@href'])((e, uris) => cb(e, uris)),
    (uris, cb) => async.mapLimit(
      uris,
      2,
      (uri, cb2) => x(uri, '.main .catalogitem', [{
        name: '.caption a',
        img: '.image a img@src',
        uri: '.caption a@href'
      }])((e, data) => cb2(e, data)),
      (e, datas) => cb(e, _.flatten(datas))
    ),
    (games, cb) => fs.outputFile('data/games.js', 'window.games = ' + JSON.stringify(games, null, 2), cb)
  ]
)
