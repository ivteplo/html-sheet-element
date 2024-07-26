//
// Copyright (c) 2022-2024 Ivan Teplov
// Licensed under the Apache license 2.0
//

/** @jsx createElement */

import { isFocused, touchPosition, getCSSVariableValue, createElement, elementContains } from "../../../shared/htmlHelpers.js"
import { mapNumber } from "./helpers.js"
import { styleSheet } from "./styleSheet.js"

/**
 * HTML Custom Element for creating sheets
 *
 * @example <caption>Define the element in the registry and use it in your HTML</caption>
 * customElements.define("ui-sheet", SheetElement)
 *
 * // in HTML:
 * <ui-sheet>
 *   <p>Hello World!</p>
 * </ui-sheet>
 *
 * @example <caption>Open the sheet by default</caption>
 * <ui-sheet open>
 *   <p>Hello World!</p>
 * </ui-sheet>
 *
 * @example <caption>Execute certain actions when the sheet opens or closes</caption>
 * const sheet = document.querySelector("...")
 *
 * sheet.addEventListener("open", event => {
 *   console.log("The sheet is now shown")
 * })
 *
 * sheet.addEventListener("close", event => {
 *   console.log("The sheet is now closed")
 * })
 *
 * @example <caption>Confirm whether the user actually wants to close a sheet without submition</caption>
 * // HTML:
 * <ui-sheet>
 *   <form method="dialog">
 *     <textbox placeholder="Your feedback" required></textbox>
 *     <button type="submit">Send</button>
 *   </form>
 * </ui-sheet>
 *
 * // JavaScript:
 * sheet.addEventListener("cancel", event => {
 *   const userWantsToClose = confirm("Are you sure you want to close the form without submition?")
 *   if (!userWantsToClose) {
 *     // the sheet is not going to be closed
 *     event.preventDefault()
 *   }
 * })
 *
 * @example <caption>Open the sheet programmatically</caption>
 * const sheet = document.querySelector("...")
 *
 * sheet.showModal()
 * // is the same as:
 * sheet.show()
 *
 * @example <caption>Show a title in the sheet header</caption>
 * <ui-sheet>
 *   <h2 slot="title-area">Title</h2>
 *   <!-- ... -->
 * </ui-sheet>
 *
 * @example <caption>Replace a button in the sheet header</caption>
 * <ui-sheet id="sheet">
 *   <button slot="button-area" type="button" aria-controls="sheet" onclick="sheet.close()">Close</button>
 *   <!-- ... -->
 * </ui-sheet>
 */
export class SheetElement extends HTMLElement {
	/**
	 * Inner wrapper
	 * @type {HTMLDivElement}
	 */
	#sheet

	/**
	 * Gray area on the top of the sheet to resize the sheet
	 * @type {HTMLElement}
	 */
	#handle

	#scaleDownTo

	/** Just methods with 'this' binded */
	#eventListeners = {
		onDragMove: this.#onDragMove.bind(this),
		onDragStart: this.#onDragStart.bind(this),
		onDragEnd: this.#onDragEnd.bind(this),
		onKeyUp: this.#onKeyUp.bind(this),
		onCloseButtonClick: this.#onCloseButtonClick.bind(this),
		onBackdropClick: this.#onBackdropClick.bind(this),
		onSubmit: this.#onSubmit.bind(this)
	}

	/**
	 * Options for behavior customization
	 *
	 * @example <caption>Make the sheet <i>not</i> close on backdrop click</caption>
	 * <ui-sheet ignore-backdrop-click>
	 *   ...
	 * </ui-sheet>
	 *
	 * @example <caption>Make the sheet <i>not</i> close when pressing Escape</caption>
	 * <ui-sheet ignore-escape-key>
	 *   ...
	 * </ui-sheet>
	 *
	 * @example <caption>Make the sheet <i>not</i> close when dragging it down</caption>
	 * <ui-sheet ignore-dragging-down>
	 *   ...
	 * </ui-sheet>
	 */
	options = {
		closeOnBackdropClick: true,
		closeOnEscapeKey: true,
		closeOnDraggingDown: true
	}

	/**
	 * Gets or sets the return value for the sheet, usually to indicate which button the user pressed to close it.
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/returnValue
	 * @type {string}
	 */
	returnValue = ""

	#performedInitialization = false

	constructor() {
		super()

		const shadowRoot = this.attachShadow({
			mode: "open"
		})

		shadowRoot.adoptedStyleSheets = [styleSheet]

		shadowRoot.append(
			<div class="sheet-backdrop" onClick={this.#eventListeners.onBackdropClick} />,
			<div class="sheet-contents" reference={sheet => this.#sheet = sheet}>
				<header class="sheet-controls">
					<div class="sheet-title-area">
						<slot name="title-area" />
					</div>

					<div
						class="sheet-handle-container"
						reference={area => this.#handle = area}
						onMouseDown={this.#eventListeners.onDragStart}
						onTouchStart={this.#eventListeners.onDragStart}
					>
						<div class="sheet-handle"></div>
					</div>

					<div class="sheet-button-area">
						<slot name="button-area">
							<button
								type="button"
								aria-controls={this?.id ?? ""}
								class="sheet-close-button"
								onClick={this.#eventListeners.onCloseButtonClick}
								title="Close the sheet"
							>
								&times;
							</button>
						</slot>
					</div>
				</header>
				<main class="sheet-body">
					<slot />
				</main>
			</div>
		)
	}

	/**
	 * Attaches event listeners to the window when the sheet is mounted
	 * @ignore
	 */
	connectedCallback() {
		if (!(this.#performedInitialization)) {
			this.role = "dialog"
			this.ariaModal = true
			this.addEventListener("submit", this.#eventListeners.onSubmit)

			Object.defineProperties(this.options, {
				closeOnBackdropClick: {
					get: () =>
						!this.hasAttribute("ignore-backdrop-click"),
					set: value => Boolean(value)
						? this.removeAttribute("ignore-backdrop-click")
						: this.setAttribute("ignore-backdrop-click", true)
				},
				closeOnEscapeKey: {
					get: () =>
						!this.hasAttribute("ignore-escape-key"),
					set: value => Boolean(value)
						? this.removeAttribute("ignore-escape-key")
						: this.setAttribute("ignore-escape-key", true)
				},
				closeOnDraggingDown: {
					get: () =>
						!this.hasAttribute("ignore-dragging-down"),
					set: value => Boolean(value)
						? this.removeAttribute("ignore-dragging-down")
						: this.setAttribute("ignore-dragging-down", true)
				}
			})

			this.#performedInitialization = true
		}

		window.addEventListener("keyup", this.#eventListeners.onKeyUp)

		window.addEventListener("mousemove", this.#eventListeners.onDragMove)
		window.addEventListener("touchmove", this.#eventListeners.onDragMove)

		window.addEventListener("mouseup", this.#eventListeners.onDragEnd)
		window.addEventListener("touchend", this.#eventListeners.onDragEnd)
	}

	/**
	 * Removes all the event listeners when the sheet is no longer mounted
	 * @ignore
	 */
	disconnectedCallback() {
		window.removeEventListener("keyup", this.#eventListeners.onKeyUp)

		window.removeEventListener("mousemove", this.#eventListeners.onDragMove)
		window.removeEventListener("touchmove", this.#eventListeners.onDragMove)

		window.removeEventListener("mouseup", this.#eventListeners.onDragEnd)
		window.removeEventListener("touchend", this.#eventListeners.onDragEnd)
	}

	/**
	 * Open the sheet
	 */
	showModal() {
		if (!this.hasAttribute("open")) {
			this.setAttribute("open", true)
			this.ariaHidden = false

			const event = new CustomEvent("open", {
				bubbles: false,
				cancelable: false
			})

			this.dispatchEvent(event)
		}
	}

	/**
	 * Open the sheet
	 */
	show() {
		this.showModal()
	}

	/**
	 * Collapse the sheet
	 */
	close() {
		if (!this.hasAttribute("open")) {
			return
		}

		this.removeAttribute("open")
		this.ariaHidden = true

		const event = new CustomEvent("close", {
			bubbles: false,
			cancelable: false
		})

		this.dispatchEvent(event)
	}

	/**
	 * Close the sheet when the form hasn't been submitted
	 */
	#cancelAndCloseIfApplicable() {
		if (!this.hasAttribute("open")) {
			return
		}

		const event = new CustomEvent("cancel", {
			bubbles: false,
			cancelable: true
		})

		const isDefaultBehaviorNotPrevented = this.dispatchEvent(event)

		if (isDefaultBehaviorNotPrevented) {
			this.close()
		}
	}

	/**
	 * Check if the sheet is open
	 * @returns {boolean}
	 */
	get open() {
		return this.hasAttribute("open")
	}

	/**
	 * An alternative way to open or close the sheet
	 * @param {boolean} value
	 * @returns {boolean}
	 * @example
	 * sheet.open = true  // the same as executing sheet.show()
	 * sheet.open = false // the same as executing sheet.close()
	 */
	set open(value) {
		if (value === false || value === undefined) {
			this.close()
			return false
		} else {
			this.show()
			return true
		}
	}

	/**
	 * On submit of a form inside of the sheet
	 * @param {SubmitEvent} event
	 * @returns {void}
	 */
	#onSubmit(event) {
		const form = event.target
		const button = event.submitter

		if (form?.method === "dialog" || button?.formMethod === "dialog") {
			event.stopImmediatePropagation()
			event.preventDefault()

			this.returnValue = button?.value ?? ""
			this.close()
		}
	}

	/**
	 * Hide the sheet when clicking at the backdrop
	 * @returns {void}
	 */
	#onBackdropClick() {
		if (this.options.closeOnBackdropClick) {
			this.#cancelAndCloseIfApplicable()
		}
	}

	/**
	 * Hide the sheet when clicking at the 'close' button
	 * @returns {void}
	 */
	#onCloseButtonClick() {
		this.#cancelAndCloseIfApplicable()
	}

	/**
	 * Hide the sheet when pressing Escape if the target element is not an input field
	 * @param {KeyboardEvent} event
	 * @returns {void}
	 */
	#onKeyUp(event) {
		const isSheetElementFocused =
			elementContains(event.target, this) && isFocused(event.target)

		if (event.key === "Escape" && !isSheetElementFocused && this.options.closeOnEscapeKey) {
			this.#cancelAndCloseIfApplicable()
		}
	}

	#dragPosition

	/**
	 * Function that changes sheet's size and location during the dragging process
	 * @param {number} distanceToTheBottomInPercents - percents relative to the height of the sheet
	 */
	#dragSheet(distanceToTheBottomInPercents) {
		const translateY = 100 - distanceToTheBottomInPercents
		const scale = mapNumber(distanceToTheBottomInPercents, [0, 100], [this.#scaleDownTo, 1])

		this.#sheet.style.transform = `translateY(${translateY}%) scale(${scale})`
		this.#sheet.style.transition = "none"
	}

	/**
	 * Gets called when the user starts grabbing the 'sheet thumb'
	 * @param {MouseEvent|TouchEvent} event
	 * @returns {void}
	 */
	#onDragStart(event) {
		this.#dragPosition = touchPosition(event).pageY
		this.#sheet.classList.add("is-resized")
		this.#handle.style.cursor = document.body.style.cursor = "grabbing"

		this.#scaleDownTo = +getCSSVariableValue(this.#sheet, "--scale-down-to")
	}

	/**
	 * Distance from the cursor to the bottom of the sheet in percents (relative to the sheet height)
	 */
	#getDistanceToTheBottomInPercents(y) {
		const deltaY = this.#dragPosition - y
		const distanceToTheBottomInPercents = 100 + deltaY / this.#sheet.clientHeight * 100
		return Math.max(0, Math.min(100, distanceToTheBottomInPercents))
	}

	/**
	 * Gets called when the user is moving the 'sheet thumb'.
	 * Updates the height of the sheet
	 * @param {MouseEvent|TouchEvent} event
	 * @returns {void}
	 */
	#onDragMove(event) {
		if (this.#dragPosition === undefined) return

		this.#dragSheet(this.#getDistanceToTheBottomInPercents(touchPosition(event).pageY))
	}

	/**
	 * Get called when the user stops grabbing the sheet
	 * @param {MouseEvent|TouchEvent} event
	 * @returns {void}
	 */
	#onDragEnd(event) {
		if (this.#dragPosition === undefined) return

		const distanceToTheBottomInPercents =
			this.#getDistanceToTheBottomInPercents(touchPosition(event).pageY)

		if (distanceToTheBottomInPercents < 75 && this.options.closeOnDraggingDown) {
			this.close()
		}

		this.#handle.style.cursor = document.body.style.cursor = ""
		this.#dragPosition = undefined

		this.#sheet.classList.remove("is-resized")

		this.#sheet.style.transform = ""
		this.#sheet.style.transition = ""
	}
}

export default SheetElement
