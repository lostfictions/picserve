/*eslint semi: ["error", "never"], strict: 0*/
'use strict'

const x = require('x-ray')()
const async = require('async')
const _ = require('lodash')
const fs = require('fs-extra')
const Download = require('download')

const url = require('url')
const path = require('path')

const getLocalName = (uri) => url.parse(uri).pathname.split('/').slice(1).join('-')

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
      (e, pagedData) => { const data = _.flatten(pagedData); console.log('Got ' + data.length + ' games!'); cb(e, data) }
    ),
    (data, cb) => async.parallelLimit(data.map((d, ind) => (cb2) => {
      console.log('Downloading (' + ind + '/' + data.length + ')"' + d.img + '"...')
      new Download()
        .get(d.img)
        .rename(getLocalName(d.img))
        .dest('data/images')
        .run(cb2)
    }), 2, (e) => cb(e, data)),
    (games, cb) => cb(null, games.map(g => ({
      name: g.name,
      img: path.join('data/images', encodeURI(getLocalName(g.img))),
      uri: g.uri
    }))),
    (games, cb) => fs.outputFile('data/games.js', 'window.games = ' + JSON.stringify(games, null, 2), cb)
  ]
)
