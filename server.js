/*eslint semi: ["error", "never"], strict: 0*/
'use strict'

const PORT = 3000

const _ = require('lodash')
const path = require('path')
const opn = require('opn')
const express = require('express')
const chokidar = require('chokidar')

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

app.listen(PORT)
