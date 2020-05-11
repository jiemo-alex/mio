(function() {

  const holdBar = document.getElementById('hold-bar')
  const folder = document.getElementById('folder')
  const navBtnFiles = document.getElementById('nav-btn-files')

  let folderWidth = 150;
  let folderHide = false;

  holdBar.onmouseenter = function() {
    document.body.style.cursor = 'w-resize'
  }
  const cursorDefault = function() {
    document.body.style.cursor = 'default'
  }
  holdBar.onmouseleave = cursorDefault

  holdBar.onmousedown = function(event) {
    event.preventDefault()
    holdBar.onmouseleave = null
    document.body.style.cursor = 'w-resize'
    let initX = event.clientX
    document.onmousemove = function(e) {
      e.preventDefault()
      const fixWidth = e.clientX - initX
      initX += fixWidth
      folderWidth += fixWidth
      folder.style.width = folderWidth + 'px';
    }
  }

  document.onmouseup = function(event) {
    event.preventDefault()
    document.onmousemove = null
    holdBar.onmouseleave = cursorDefault
  }


  navBtnFiles.onclick = function(event) {
    event.preventDefault()
    folder.style.display = folderHide ? 'flex' : 'none'
    folderHide = !folderHide
  }
})();
