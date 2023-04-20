// Copyright (c) 2022-2023 Ivan Teplov

/**
 * Check if the element is focused
 * @param {HTMLElement}
 */
const isFocused = element => document.activeElement === element

/**
 * Get object that contains touch position (depending on event type)
 * @param {MouseEvent|TouchEvent} event
 * @returns {MouseEvent|Touch}
 */
const touchPosition = (event) =>
  event.touches ? event.touches[0] : event

export class BottomSheet {
  #height = 0 // in vh (viewport height)
  #contents
  #sheet

  /**
   * @param {HTMLElement} contents
   * @param {object} options
   * @param {boolean?} options.closeOnBackgroundClick
   * @param {boolean?} options.closeOnEscapeKey
   */
  constructor(contents, options = {}) {
    this.options = {
      closeOnBackgroundClick: true,
      closeOnEscapeKey: true,
      ...options
    }

    this.#wrapContents(contents)
  }

  /**
   * Method to hide or show the sheet
   * @param {boolean} isShown
   */
  setIsShown(isShown) {
    this.#sheet.setAttribute("aria-hidden", String(!isShown))

    if (!isShown) {
      this.setHeight(0)
    } else {
      this.setHeight(50)
    }
  }

  /**
   * @param {number} value - height in vh (viewport height)
   */
  setHeight(value) {
    if (typeof value !== "number") return

    this.#height = Math.max(0, Math.min(100, value))
    this.#contents.style.height = `${this.#height}vh`

    if (this.#height === 100) {
      this.#contents.classList.add("fullscreen")
    } else {
      this.#contents.classList.remove("fullscreen")
    }
  }

  /**
   * @param {HTMLElement} contents
   */
  #wrapContents(contents) {
    const sheet = document.createElement("div")
    sheet.classList.add("sheet")
    sheet.setAttribute("role", "dialog")
    sheet.setAttribute("aria-hidden", "true")
    this.#sheet = sheet

    const overlay = document.createElement("div")
    overlay.classList.add("overlay")
    sheet.appendChild(overlay)

    // Hide the sheet when clicking at the background
    overlay.addEventListener("click", () => {
      if (this.options.closeOnBackgroundClick) {
        this.setIsShown(false)
      }
    })

    const contentsWrapper = document.createElement("div")
    contentsWrapper.classList.add("contents")
    sheet.appendChild(contentsWrapper)
    this.#contents = contentsWrapper

    const controlsHeader = document.createElement("header")
    controlsHeader.classList.add("controls")
    contentsWrapper.appendChild(controlsHeader)

    const draggableArea = document.createElement("div")
    draggableArea.classList.add("draggable-area")
    controlsHeader.appendChild(draggableArea)

    const draggableThumb = document.createElement("div")
    draggableThumb.classList.add("draggable-thumb")
    draggableArea.appendChild(draggableThumb)

    // TODO: set up the aria-controls attribute
    const closeButton = document.createElement("button")
    closeButton.classList.add("close-sheet")
    closeButton.setAttribute("type", "button")
    closeButton.setAttribute("title", "Close the sheet")
    closeButton.innerHTML = "&times;"
    controlsHeader.appendChild(closeButton)

    // Hide the sheet when clicking at the 'close' button
    closeButton.addEventListener("click", () => {
      this.setIsShown(false)
    })

    const sheetBody = document.createElement("main")
    sheetBody.classList.add("body")
    contentsWrapper.appendChild(sheetBody)

    contents.replaceWith(sheet)
    sheetBody.appendChild(contents)

    // Hide the sheet when pressing Escape if the target element
    // is not an input field
    window.addEventListener("keyup", (event) => {
      const isSheetElementFocused =
        sheet.contains(event.target) && isFocused(event.target)

      if (event.key === "Escape" && !isSheetElementFocused && this.options.closeOnEscapeKey) {
        this.setIsShown(false)
      }
    })

    let dragPosition

    const onDragStart = (event) => {
      dragPosition = touchPosition(event).pageY
      contentsWrapper.classList.add("not-selectable")
      draggableArea.style.cursor = document.body.style.cursor = "grabbing"
    }

    const onDragMove = (event) => {
      if (dragPosition === undefined) return

      const y = touchPosition(event).pageY
      const deltaY = dragPosition - y
      const deltaHeight = deltaY / window.innerHeight * 100

      this.setHeight(this.#height + deltaHeight)
      dragPosition = y
    }

    const onDragEnd = () => {
      dragPosition = undefined
      contentsWrapper.classList.remove("not-selectable")
      draggableArea.style.cursor = document.body.style.cursor = ""

      if (this.#height < 25) {
        this.setIsShown(false)
      } else if (this.#height > 75) {
        this.setHeight(100)
      } else {
        this.setHeight(50)
      }
    }

    draggableArea.addEventListener("mousedown", onDragStart)
    draggableArea.addEventListener("touchstart", onDragStart)

    window.addEventListener("mousemove", onDragMove)
    window.addEventListener("touchmove", onDragMove)

    window.addEventListener("mouseup", onDragEnd)
    window.addEventListener("touchend", onDragEnd)
  }
}

export default BottomSheet
