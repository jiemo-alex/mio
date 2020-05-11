const { BrowserWindow } = require('electron')
const ipcEvents = require('./ipcEvents')

function createWindow () {   
  const win = new BrowserWindow({
    width: 1100,
    height: 650,
    webPreferences: {
      nodeIntegration: true
    }
  })

  ipcEvents(win)
  win.loadURL(`file://${__dirname}/../renderer/index.html`)

  win.webContents.openDevTools()
}

module.exports = createWindow
