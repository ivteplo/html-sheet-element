//
// Copyright (c) 2022-2023 Ivan Teplov
// Licensed under the Apache license 2.0
//

export class BottomSheetDisplayStateChangeObserver extends MutationObserver {
  /** @type {Map<Node, boolean>} */
  #isHiddenMap = new Map()

  constructor() {
    super((mutations, _observer) => {
      for (const mutation of mutations) {
        this.#onMutation(mutation)
      }
    })
  }

  #attributeName = "aria-hidden"
  #isHidden = "true"
  #onHideEventName = "hide"
  #onShowEventName = "show"

  /**
   * @param {MutationRecord} mutation
   */
  #onMutation(mutation) {
    if (!(
      mutation.type === "attributes" &&
      mutation.attributeName === this.#attributeName
    )) {
      return
    }

    const isNowHidden = mutation.target.getAttribute(this.#attributeName) === this.#isHidden
    const wasHidden = this.#isHiddenMap.get(mutation.target)

    if (isNowHidden !== wasHidden) {
      this.#isHiddenMap.set(mutation.target, isNowHidden)

      const eventType = isNowHidden ? this.#onHideEventName : this.#onShowEventName
      mutation.target.dispatchEvent(new Event(eventType, {
        bubbles: false,
        cancelable: false,
        composed: false
      }))
    }
  }

  /**
   * @param {Node}
   */
  observe(sheetWrapper) {
    this.#isHiddenMap.set(
      sheetWrapper,
      sheetWrapper.getAttribute(this.#attributeName) === this.#isHidden
    )

    super.observe(sheetWrapper, {
      attributes: true,
      attributeFilter: [this.#attributeName]
    })
  }

  /**
   * @param {Node} node
   */
  handleChangesAndDisconnect(node) {
    for (const mutation of this.takeRecords()) {
      this.#onMutation(mutation)
    }

    this.disconnect(node)
  }
}

export default BottomSheetDisplayStateChangeObserver
