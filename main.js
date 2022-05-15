// Copyright (c) 2022 Ivan Teplov

const $ = document.querySelector.bind(document)

const openSheetButton = $("#open-sheet")
const sheet = $("#sheet")
const sheetContents = sheet.querySelector(".contents")

let sheetHeight // in vh

const setSheetHeight = (value) => {
  sheetHeight = value
  sheetContents.style.height = `${sheetHeight}vh`
}

const setIsSheetShown = (value) => {
  sheet.setAttribute("aria-hidden", String(!value))
}

openSheetButton.addEventListener("click", () => {
  setSheetHeight(Math.min(50, 720 / window.innerHeight * 100))
  setIsSheetShown(true)
})

sheet.querySelector(".close-sheet").addEventListener("click", () => {
  setIsSheetShown(false)
})

const touchPosition = (event) =>
  event.touches ? event.touches[0] : event

let dragPosition

const onDragStart = (event) => {
  dragPosition = touchPosition(event).pageY
  sheetContents.classList.add("not-selectable")
}

const onDragMove = (event) => {
  if (dragPosition === undefined) return

  const y = touchPosition(event).pageY
  const deltaY = dragPosition - y
  const deltaHeight = deltaY / window.innerHeight * 100

  setSheetHeight(sheetHeight + deltaHeight)
  dragPosition = y
}

const onDragEnd = () => {
  dragPosition = undefined
  sheetContents.classList.remove("not-selectable")

  if (sheetHeight < 20) {
    setIsSheetShown(false)
  }
}

const draggableArea = sheet.querySelector(".draggable-area")

draggableArea.addEventListener("mousedown", onDragStart)
draggableArea.addEventListener("touchstart", onDragStart)

window.addEventListener("mousemove", onDragMove)
window.addEventListener("touchmove", onDragMove)

window.addEventListener("mouseup", onDragEnd)
window.addEventListener("touchend", onDragEnd)
