//
// Copyright (c) 2022-2023 Ivan Teplov
// Licensed under the Apache license 2.0
//

/**
 * Mutation observer that triggers events whenever the bottom sheets becomes hidden or shown.
 */
export class BottomSheetDisplayStateChangeObserver extends MutationObserver {
  constructor() {
    super((mutations, _observer) => {
      for (const mutation of mutations) {
        this.#onMutation(mutation)
      }
    })
  }

  #observedAttributeName = "aria-hidden"

  #eventNames = {
    hide: "hide",
    show: "show"
  }

  /**
   * This object maps bottom sheets to their current state (hidden = true, shown = false)
   * @type {Map<HTMLElement, boolean>}
   */
  #sheetIsHiddenMap = new Map()

  /**
   * Check whether the element is hidden
   * @param {HTMLElement} element
   * @returns {boolean}
   */
  #isHidden(element) {
    return element.getAttribute("aria-hidden") === "true"
  }

  /**
   * Handle a DOM mutation
   * @param {MutationRecord} mutation
   * @returns {void}
   */
  #onMutation(mutation) {
    const wasHidden = this.#sheetIsHiddenMap.get(mutation.target)
    const isNowHidden = this.#isHidden(mutation.target)

    if (isNowHidden !== wasHidden) {
      this.#sheetIsHiddenMap.set(mutation.target, isNowHidden)

      const eventType = isNowHidden
        ? this.#eventNames.hide
        : this.#eventNames.show

      mutation.target.dispatchEvent(new Event(eventType, {
        bubbles: false,
        cancelable: false,
        composed: false
      }))
    }
  }

  /**
   * Observe element attribute changes
   * @param {HTMLElement} element
   * @returns {void}
   */
  observe(element) {
    if (!(element instanceof HTMLElement)) {
      throw new Error("This observer can only be used with HTML elements")
    }

    this.#sheetIsHiddenMap.set(element, this.#isHidden(element))

    super.observe(element, {
      attributes: true,
      attributeFilter: [this.#observedAttributeName]
    })
  }

  /**
   * Method to process pending mutations and stop observing an object
   * @param {HTMLElement} element
   * @returns {void}
   */
  handleChangesAndDisconnect(element) {
    if (!this.#sheetIsHiddenMap.has(element)) {
      return
    }

    for (const mutation of this.takeRecords()) {
      this.#onMutation(mutation)
    }

    this.disconnect(element)
    this.#sheetIsHiddenMap.delete(element)
  }
}

export default BottomSheetDisplayStateChangeObserver
