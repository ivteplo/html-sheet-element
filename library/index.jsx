//
// Copyright (c) 2022-2023 Ivan Teplov
// Licensed under the Apache license 2.0
//

/** @jsx createElement */

import { createElement } from "./createElement"
import * as styles from "./sheet.module.css"

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

  #identifier
  #sheetWrapper
  #sheet
  #draggableArea

  /**
   * @param {string} identifier
   * @param {HTMLElement} contents
   * @param {object} options
   * @param {boolean?} options.closeOnBackgroundClick
   * @param {boolean?} options.closeOnEscapeKey
   */
  constructor(identifier, contents, options = {}) {
    this.#identifier = identifier

    this.options = {
      closeOnBackgroundClick: true,
      closeOnEscapeKey: true,
      ...options
    }

    this.#mount(contents)
  }

  get id() {
    return this.#identifier
  }

  get identifier() {
    return this.#identifier
  }

  #validateSheetIdentifier() {
    if (typeof this.#identifier !== "string") {
      throw new TypeError(`Identifier is not specified`)
    }

    if (document.getElementById(this.#identifier) !== null) {
      throw new TypeError(`The provided identifier is already in use`)
    }
  }

  /**
   * Method to hide or show the sheet
   * @param {boolean} isShown
   */
  setIsShown(isShown) {
    this.#sheetWrapper.setAttribute("aria-hidden", String(!isShown))

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
    this.#sheet.style.height = `${this.#height}vh`

    if (this.#height === 100) {
      this.#sheet.classList.add("fullscreen")
    } else {
      this.#sheet.classList.remove("fullscreen")
    }
  }

  // Hide the sheet when clicking at the background
  #onOverlayClick() {
    if (this.options.closeOnBackgroundClick) {
      this.setIsShown(false)
    }
  }

  // Hide the sheet when clicking at the 'close' button
  #onCloseButtonClick() {
    this.setIsShown(false)
  }

  /**
   * Hide the sheet when pressing Escape if the target element is not an input field
   * @param {KeyboardEvent} event
   */
  #onKeyUp(event) {
    const isSheetElementFocused =
      this.#sheetWrapper.contains(event.target) && isFocused(event.target)

    if (event.key === "Escape" && !isSheetElementFocused && this.options.closeOnEscapeKey) {
      this.setIsShown(false)
    }
  }

  #dragPosition

  /**
   * @param {MouseEvent|TouchEvent} event
   */
  #onDragStart(event) {
    this.#dragPosition = touchPosition(event).pageY
    this.#sheet.classList.add(styles.notSelectable)
    this.#draggableArea.style.cursor = document.body.style.cursor = "grabbing"
  }

  /**
   * @param {MouseEvent|TouchEvent} event
   */
  #onDragMove(event) {
    if (this.#dragPosition === undefined) return

    const y = touchPosition(event).pageY
    const deltaY = this.#dragPosition - y
    const deltaHeight = deltaY / window.innerHeight * 100

    this.setHeight(this.#height + deltaHeight)
    this.#dragPosition = y
  }

  /**
   * @param {MouseEvent|TouchEvent} event
   */
  #onDragEnd(event) {
    this.#dragPosition = undefined
    this.#sheet.classList.remove(styles.notSelectable)
    this.#draggableArea.style.cursor = document.body.style.cursor = ""

    if (this.#height < 25) {
      this.setIsShown(false)
    } else if (this.#height > 75) {
      this.setHeight(100)
    } else {
      this.setHeight(50)
    }
  }

  /**
   * @param {HTMLElement} contents
   */
  #mount(contents) {
    this.#validateSheetIdentifier()

    const sheet = (
      <div class={styles.sheet} id={this.#identifier} role="dialog" aria-hidden="true">
        <div class={styles.overlay} onClick={this.#onOverlayClick.bind(this)}></div>
        <div class={styles.contents}>
          <header class={styles.controls}>
            <div
              class={styles.draggableArea}
              onMouseDown={this.#onDragStart.bind(this)}
              onTouchStart={this.#onDragStart.bind(this)}
            >
              <div class={styles.draggableThumb}></div>
            </div>

            <button
              type="button"
              aria-controls={this.#identifier}
              class={styles.closeSheet}
              onClick={this.#onCloseButtonClick.bind(this)}
              title="Close the sheet"
            >
              &times;
            </button>
          </header>
          <main class={styles.body}></main>
        </div>
      </div>
    )

    this.#sheetWrapper = sheet
    this.#sheet = this.#sheetWrapper.querySelector("." + styles.contents)
    this.#draggableArea = this.#sheet.querySelector("." + styles.draggableArea)

    const sheetBody = this.#sheet.querySelector("." + styles.body)
    contents.replaceWith(this.#sheetWrapper)
    sheetBody.appendChild(contents)

    window.addEventListener("keyup", this.#onKeyUp.bind(this))

    window.addEventListener("mousemove", this.#onDragMove.bind(this))
    window.addEventListener("touchmove", this.#onDragMove.bind(this))

    window.addEventListener("mouseup", this.#onDragEnd.bind(this))
    window.addEventListener("touchend", this.#onDragEnd.bind(this))
  }
}
