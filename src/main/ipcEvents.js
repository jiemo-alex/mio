const { app, ipcMain } = require('electron')
const fs = require('fs')
const path = require('path')
const { dialogSelect } = require('./functions')
const {
  IPC_OPEN_FILE,
  IPC_OPEN_FILE_REPLY
} = require('../constants')

module.exports = function ipcEvents(win) {
  ipcMain.on(IPC_OPEN_FILE, (event) => {
    dialogSelect('openFile', ({ canceled, filePaths }) => {
      if (!canceled) {
        const selectedPath = filePaths[0]
        fs.readFile(selectedPath, { encoding: 'utf-8' }, (_, data) => {
          const basename = path.basename(selectedPath)
          event.reply(IPC_OPEN_FILE_REPLY, {
            title: basename,
            content: data,
            path: selectedPath
          })
        })
      }
    })
  })
}
