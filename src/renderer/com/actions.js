const { ipcRenderer } = require('electron')
const {
  IPC_READY,
  IPC_OPEN_FILE,
  IPC_OPEN_FILE_REPLY,
  IPC_OPEN_DIR,
  IPC_OPEN_DIR_REPLY
} = require('../constants')

const folderTree = document.querySelector('#tree')
const tabs = document.querySelector('#tabs')
const frame = document.querySelector('#frame')

const states = {
  fileNumber: 0
}

function hideAll(elements) {
  if (!elements) {
    return false
  }
  elements.forEach(element => {
    element.style.display = 'none'
  })
}

function addClass(element, className) {
  if (!element) {
    return false
  }
  if (element instanceof NodeList) {
    element.forEach(e => {
      e.className += ' ' + className
    });
  } else {
    element.className += ' ' + className
  }
}

function removeClass(element, className) {
  if (!element) {
    return false
  }
  const reg = new RegExp(`${className}`, 'g')
  if (element instanceof NodeList) {
    element.forEach(e => {
      e.className = e.className.replace(reg, '')
    });
  } else {
    element.className = element.className.replace(reg, '')
  }
}

function makeTab(title, file) {
  const li = document.createElement('li')
  const p = document.createElement('p')
  const a = document.createElement('a')
  li.className = 'tab'
  p.innerText = title
  a.href="#"
  a.innerHTML = '<i class="fas fa-times"></i>'
  p.onclick = _ => {
    removeClass(document.querySelectorAll('.tab'), 'active')
    addClass(li, 'active')
    hideAll(document.querySelectorAll('.editor'))
    file.style.display = 'block'
  }
  a.onclick = event => {
    event.preventDefault()
    tabs.removeChild(li)
    frame.removeChild(file)
    states.fileNumber--
    if (states.fileNumber === 0) {
      makeWelcomePage()
    }
  }
  li.appendChild(p)
  li.appendChild(a)
  p.click()
  return li
}

function makeContent(content) {
  const div = document.createElement('div')
  div.className = 'editor'
  monaco.editor.create(div, {
    value: content,
    language: "javascript",
    automaticLayout: true
  });
  return div
}

function makeWelcomePage() {
  const html = `
    <h3>启动</h3>
    <div>
      <a href="#" id="open-file">打开文件</a><br />
      <a href="#" id="open-dir">打开文件夹</a>
    </div>
  `
  const welcome = document.createElement('div')
  welcome.className = 'editor welcome'
  welcome.innerHTML = html
  addFile('欢迎使用', welcome, () => {
    const openFile = document.querySelector('#open-file')
    const openDir = document.querySelector('#open-dir')
    openFile.onclick = (event) => {
      event.preventDefault()
      ipcRenderer.send(IPC_OPEN_FILE)
    }

    openDir.onclick = (event) => {
      event.preventDefault()
      ipcRenderer.send(IPC_OPEN_DIR)
    }
  })
}

function addFile(title, file, callback) {
  const tab = makeTab(title, file)
  tabs.appendChild(tab)

  hideAll(document.querySelectorAll('.editor'))
  frame.appendChild(file)
  states.fileNumber++
  if (callback) {
    callback()
  }
}


// events

ipcRenderer.on(IPC_OPEN_FILE_REPLY, (_, {title, content, path}) => {
  const file = makeContent(content)
  addFile(title, file)
})

ipcRenderer.on(IPC_OPEN_DIR_REPLY, _ => {
  
})

requirejs.config({ paths: { 'vs': '../../node_modules/monaco-editor/min/vs' }});

requirejs(['vs/editor/editor.main'], function() {
  ipcRenderer.send(IPC_READY)
  monaco.editor.setTheme('vs-dark')
  makeWelcomePage()
});
