const Nightmare = require('nightmare')
const path = require('path')
const fs = require('fs')

Nightmare.action('uploadFile',
  function(name, options, parent, win, renderer, childDone) {
    parent.respondTo('uploadFile', function(filePath, parentDone) {
      const wc = win.webContents

      wc.debugger.attach("1.1")

      wc.debugger.sendCommand("DOM.getDocument", {}, function(err, res) {
        wc.debugger.sendCommand("DOM.querySelector", {
          nodeId: res.root.nodeId,
          selector: "#qbfile"  // CSS selector of input[type=file] element
        }, function(err2, res2) {
          wc.debugger.sendCommand("DOM.setFileInputFiles", {
            nodeId: res2.nodeId,
            files: [filePath]
          }, function(err3, res3) {
            wc.debugger.detach()
            parentDone()
          })
        })
      })
    })
    childDone()
  },
  function(filename, done) {
    const absPath = path.resolve(filename)
    if(!fs.existsSync(absPath)) {
      throw new Error(`Cannot find file "${absPath}"!`)
    }
    this.child.call('uploadFile', absPath, done)
  }
)

module.exports = function(filename) {
  const nightmare = Nightmare()

  return nightmare
    .goto('https://images.google.com/')
    .wait('#qbi')
    .click('#qbi')
    .wait('a.qbtbha.qbtbtxt.qbclr')
    .click('a.qbtbha.qbtbtxt.qbclr')
    .wait('#qbfile')
    .uploadFile(filename)
    .wait('#ires')
    .url()
    .end()
}
