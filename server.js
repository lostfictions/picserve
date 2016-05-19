#!/usr/bin/env node
/*eslint semi: ["error", "never"], strict: 0*/
'use strict'

const PORT = 3000

const _ = require('lodash')
const path = require('path')
const opn = require('opn')
const express = require('express')
const chokidar = require('chokidar')
const fs = require('fs')

const imgsearch = require('./imgsearch')


const imagesFolder = path.join(process.env.HOME, 'Pictures')
const imagePaths = []

const watcher = chokidar.watch(imagesFolder, {
  ignored: ['**/*.zip']
})

watcher.on('add', p => imagePaths.push(path.join('/images', p.substr(imagesFolder.length))))
watcher.on('ready', () => opn('http://localhost:' + PORT))

const app = express()
app.use(express.static('public'))
app.use('/images', express.static(imagesFolder))
app.get('/imagelist', (req, res) => {
  const imgs = _.shuffle(imagePaths)
  res.jsonp(imgs)
})
app.get('/open/:file', (req, res) => {
  const p = path.join(imagesFolder, decodeURIComponent(req.params.file))
  if(fs.existsSync(p)) {
    opn(p, {app: 'nautilus'})
    res.status(200).end()
  }
  else {
    res.status(500).end()
  }
})
app.get('/view/:file', (req, res) => {
  const p = path.join(imagesFolder, decodeURIComponent(req.params.file))
  if(fs.existsSync(p)) {
    opn(p)
    res.status(200).end()
  }
  else {
    res.status(500).end()
  }
})
app.get('/search/:file', (req, res) => {
  const p = path.join(imagesFolder, decodeURIComponent(req.params.file))
  if(fs.existsSync(p)) {
    imgsearch(p)
      .then(uri => { opn(uri); res.status(200).end() })
      .catch(err => { console.error("Error searching for image: " + err); res.status(500).end() })
  }
  else {
    res.status(500).end()
  }
})

app.listen(PORT)
