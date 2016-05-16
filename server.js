/*eslint semi: ["error", "never"], strict: 0*/
'use strict'

const PORT = 3000

// const async = require('async')
// const _ = require('lodash')
// const fs = require('fs-extra')
// const logger = require('morgan')

const path = require('path')
const opn = require('opn')
const express = require('express')
const chokidar = require('chokidar')

const randomIn = (arr) => arr[Math.floor(Math.random() * arr.length)]

const imagesFolder = path.join(process.env.HOME, 'Pictures')
const imagePaths = []

const watcher = chokidar.watch(imagesFolder, {
  ignored: '!*.{png,tiff,jpg,jpeg,gif}'
})

watcher.on('add', p => imagePaths.push(p))
watcher.on('ready', () => opn('http://localhost:' + PORT))

const app = express()
// app.use(logger('tiny'))
app.use(express.static('public'))

app.get('/image', (req, res) => {
  const img = randomIn(imagePaths)
  console.log(img)
  res.sendFile(img)
})

app.listen(PORT)
