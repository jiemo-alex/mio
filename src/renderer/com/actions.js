const { ipcRenderer } = require('electron')
const {
  IPC_READY,
  IPC_OPEN_FILE,
  IPC_OPEN_FILE_REPLY
} = require('../constants')

const folderTree = document.querySelector('#tree')
const openFile = document.querySelector('#open-file')
const openDir = document.querySelector('#open-dir')
const tabs = document.querySelector('#tabs')
const welcome = document.querySelector('#welcome')
const editor = document.querySelector('#editor')

const states = {
  fileNumber: 0
}

function hideAllEditors() {
  const editors = document.querySelectorAll('.editor')
  editors.forEach(editor => {
    editor.style.display = 'none'
  })
}

function makeTab(title) {
  const li = document.createElement('li')
  const p = document.createElement('p')
  const a = document.createElement('a')
  p.innerText = title
  a.href="#"
  a.innerHTML = '&times;'
  li.appendChild(p)
  li.appendChild(a)
  return li
}

function renderContent(content) {
  const editor = monaco.editor.create(document.getElementById("editor"), {
    value: content,
    language: "javascript",
    automaticLayout: true
  });
}

function addFile(title, content) {
  const tab = makeTab(title)
  renderContent(content)
  tabs.appendChild(tab)
  welcome.style.display = 'none'
  editor.style.display = 'block'
  states.fileNumber++
}

openFile.onclick = (event) => {
  event.preventDefault()
  ipcRenderer.send(IPC_OPEN_FILE)
}

ipcRenderer.on(IPC_OPEN_FILE_REPLY, (_, {title, content, path}) => {
  addFile(title, content)
})

requirejs.config({ paths: { 'vs': '../../node_modules/_monaco-editor@0.20.0@monaco-editor/min/vs' }});

requirejs(['vs/editor/editor.main'], function() {
  ipcRenderer.send(IPC_READY)
  monaco.editor.setTheme('vs-dark')
});
