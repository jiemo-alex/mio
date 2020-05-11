const { dialog } = require('electron')

function dialogSelect(type, callback) {
  const result = dialog.showOpenDialog({
      properties: [type]
  })
  result.then(callback)
}

module.exports = {
  dialogSelect
}
