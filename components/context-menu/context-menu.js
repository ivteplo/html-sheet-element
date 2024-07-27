//
// Copyright (c) 2024 Ivan Teplov
// Licensed under the Apache license 2.0
//

/**
 * A context menu itself
 * @example
 * <context-menu>
 *   <button is="context-menu-item">Cut</button>
 *   <button is="context-menu-item">Copy</button>
 *   <button is="context-menu-item">Paste</button>
 * </context-menu>
 */
class ContextMenuElement extends HTMLMenuElement {
	/**
	 * Here we are going to store the parent element once the component gets mounted
	 * so that we can remove all the event listeners once the component gets unmounted.
	 * @type {HTMLElement|null}
	 */
	#lastParent = null

	/**
	 * Object with event listeners with `this`-bindings.
	 * We need it, because binding `this` returns a new function,
	 * but we need to be able to remove an event listener
	 */
	#eventListeners

	constructor() {
		super()

		this.#eventListeners = {
			onContextMenuCall: this.#onContextMenuCall.bind(this),
			onMenuCollapsingEvent: this.#onMenuCollapsingEvent.bind(this),
			onKeyDown: this.#onKeyDown.bind(this)
		}

		this.addEventListener("keydown", this.#eventListeners.onKeyDown)
	}

	static get observedAttributes() {
		return ["open"]
	}

	/**
	 * @param {string} name
	 * @param {any} _oldValue
	 * @param {any} newValue
	 */
	attributeChangedCallback(name, _oldValue, newValue) {
		if (name === "open" && newValue !== null) {
			window.addEventListener("keydown", this.#eventListeners.onKeyDown)
			this.removeEventListener("keydown", this.#eventListeners.onKeyDown)
		} else {
			window.removeEventListener("keydown", this.#eventListeners.onKeyDown)
			this.addEventListener("keydown", this.#eventListeners.onKeyDown)
		}
	}

	/**
	 * Hide the context menu
	 */
	hide() {
		this.removeAttribute("open")
	}

	/**
	 * Displays the context menu near the specified location
	 * @param {number} x - horizontal click location
	 * @param {number} y - vertical click location
	 */
	show(x, y) {
		this.setAttribute("open", true)

		if (y + this.clientHeight > window.innerHeight) {
			this.style.top = `${y - this.clientHeight}px`
		} else {
			this.style.top = `${y}px`
		}

		if (x + this.clientWidth > window.innerWidth) {
			this.style.left = `${x - this.clientWidth}px`
		} else {
			this.style.left = `${x}px`
		}

		this.querySelector("button")?.focus()
	}

	/**
	 * Gets called whenever any key has been pressed on the keyboard
	 * @param {KeyboardEvent} event
	 */
	#onKeyDown(event) {
		if (event.key === "Tab") {
			event.preventDefault()
		} else if (event.key === "Escape") {
			this.hide()
			event.stopImmediatePropagation()
		} else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
			event.preventDefault()
			event.stopImmediatePropagation()

			const isArrowDown = event.key === "ArrowDown"
			const focusedElement = document.activeElement

			const element = getNextChildToFocusOnInsideOf(this, focusedElement, isArrowDown)
			element?.focus()
		}
	}

	/**
	 * Gets called when the right button or a context menu keyboard button is clicked inside the parent element
	 * @param {PointerEvent} event
	 */
	#onContextMenuCall(event) {
		event.preventDefault()
		event.stopImmediatePropagation()

		if (this.contains(event.target)) {
			return
		}

		this.show(event.clientX, event.clientY)
	}

	/**
	 * Gets called whenever there is an interaction that should dismiss the context menu
	 * @param {PointerEvent} event
	 */
	#onMenuCollapsingEvent(event) {
		if (event.type !== "mousedown" || !this?.contains(event.target)) {
			this.hide()
			this.style.top = ""
			this.style.left = ""
		}
	}

	connectedCallback() {
		window.addEventListener("mousedown", this.#eventListeners.onMenuCollapsingEvent)
		window.addEventListener("contextmenu", this.#eventListeners.onMenuCollapsingEvent)
		window.addEventListener("scroll", this.#eventListeners.onMenuCollapsingEvent)
		window.addEventListener("blur", this.#eventListeners.onMenuCollapsingEvent)
		window.addEventListener("resize", this.#eventListeners.onMenuCollapsingEvent)

		this.parentElement.addEventListener("contextmenu", this.#eventListeners.onContextMenuCall)
		this.#lastParent = this.parentElement

		this.hide()
	}

	disconnectedCallback() {
		window.removeEventListener("mousedown", this.#eventListeners.onMenuCollapsingEvent)
		window.removeEventListener("contextmenu", this.#eventListeners.onMenuCollapsingEvent)
		window.removeEventListener("scroll", this.#eventListeners.onMenuCollapsingEvent)
		window.removeEventListener("blur", this.#eventListeners.onMenuCollapsingEvent)
		window.removeEventListener("resize", this.#eventListeners.onMenuCollapsingEvent)

		this.#lastParent?.removeEventListener("contextmenu", this.#eventListeners.onContextMenuCall)
		this.#lastParent = null
	}
}

/**
 * Button inside of a context menu
 * @example
 * <button is="context-menu-item">Button label</button>
 */
class ContextMenuItemElement extends HTMLButtonElement {
	constructor() {
		super()
		this.type = "button"
		this.addEventListener("contextmenu", this.#triggerNormalClickOnRightClick)
		this.addEventListener("click", this.#onClick)
	}

	/**
	 * Gets called when the right mouse button is clicked
	 * @param {PointerEvent} event
	 */
	#triggerNormalClickOnRightClick(event) {
		event.preventDefault()
		event.stopImmediatePropagation()
		this.click()
	}

	#onClick() {
		findParentThat(parent => parent instanceof ContextMenuElement, this)?.hide()
	}
}

/**
 * @example
 * <details is="context-menu-group">
 *     <summary>Group name</summary>
 *     <button is="context-menu-item">Item 1</button>
 * </details>
 */
class ContextMenuGroupElement extends HTMLDetailsElement {
	constructor() {
		super()

		this.addEventListener("mouseover", () => { this.open = true })
		this.addEventListener("keydown", this.#onKeyDown.bind(this))
		this.addEventListener("mouseleave", () => { this.open = false })
	}

	#_buttonWrapper

	get #buttonWrapper() {
		if (!this.#_buttonWrapper) {
			this.#_buttonWrapper = this.querySelector("menu")
		}

		return this.#_buttonWrapper
	}

	static get observedAttributes() {
		return ["open"]
	}

	/**
	 * Method that gets called whenever the 'open' attribute changes
	 * (list of observed attributes is specified in the static method `observedAttributes`)
	 * @param {string} name
	 * @param {any} _oldValue
	 * @param {any} newValue
	 */
	attributeChangedCallback(name, _oldValue, newValue) {
		if (name === "open") {
			if (newValue !== null) {
				this.#open()
			} else {
				this.#close()
			}
		}
	}

	/**
	 * Gets called whenever any keyboard button gets pressed
	 * @param {KeyboardEvent} event
	 */
	#onKeyDown(event) {
		event.preventDefault()

		if (this.open) {
			switch (event.key) {
				case "Escape":
				case "ArrowLeft":
					event.stopImmediatePropagation()
					this.open = false
					this.querySelector("summary")?.focus()
					break
				case "ArrowDown":
				case "ArrowUp":
					event.stopImmediatePropagation()
					getNextChildToFocusOnInsideOf(this.#buttonWrapper, document.activeElement, event.key === "ArrowDown")?.focus()
					break
			}
		} else {
			switch (event.key) {
				case "Enter":
				case "Space":
					event.stopImmediatePropagation()
					this.open = true
					break
				case "ArrowRight":
					event.stopImmediatePropagation()
					this.open = true
					getNextChildToFocusOnInsideOf(this.#buttonWrapper, document.activeElement, true)?.focus()
					break
			}
		}
	}

	/**
	 * Calculates in which direction the submenu should be opened
	 */
	#open() {
		const { top, left } = this.getBoundingClientRect()

		if (left + this.parentElement.clientWidth + this.clientWidth > window.innerWidth) {
			this.setAttribute("data-x-expand-to", "left")
		} else {
			this.setAttribute("data-x-expand-to", "right")
		}

		if (top + this.#buttonWrapper.clientHeight > window.innerHeight) {
			this.setAttribute("data-y-expand-to", "top")
		} else {
			this.setAttribute("data-y-expand-to", "bottom")
		}
	}

	/**
	 * Removes the no-longer-needed attributes
	 */
	#close() {
		this.removeAttribute("data-x-expand-to")
		this.removeAttribute("data-y-expand-to")
	}
}

customElements.define("context-menu", ContextMenuElement, { extends: "menu" })
customElements.define("context-menu-item", ContextMenuItemElement, { extends: "button" })
customElements.define("context-menu-group", ContextMenuGroupElement, { extends: "details" })

/**
 * Tries to find a parent element that meets the specified criteria
 * @param {(parent: HTMLElement) => boolean} meetsCriteria
 * @param {HTMLElement} child
 * @returns {HTMLElement|null}
 */
function findParentThat(meetsCriteria, child) {
	let parent = child?.parentElement

	while (parent && !meetsCriteria(parent)) {
		parent = parent?.parentElement
	}

	return parent
}

/**
 * Tells if the element is focusable
 * @param {HTMLElement} element
 * @returns {boolean}
 */
function isFocusable(element) {
	return !element.hasAttribute("disabled") && (
		element instanceof HTMLButtonElement ||
		element instanceof HTMLAnchorElement ||
		element instanceof HTMLInputElement ||
		element instanceof HTMLTextAreaElement ||
		(element.getAttribute("tabindex") ?? "-1") !== "-1"
	)
}

/**
 * Get the next child of the context menu.
 * Returns the top or bottom element when asking for the element
 * after the last one or before the first one respectively
 * @param {HTMLElement} parent
 * @param {HTMLElement} focusedElement
 * @param {boolean} isTheOneAfterCurrent
 */
function getNextChildToFocusOnInsideOf(parent, focusedElement, isTheOneAfterCurrent) {
	let nextToFocus

	// If the focused element is currently outside of the menu
	if (!parent.contains(focusedElement)) {
		// Simply get the first or the last element
		nextToFocus = isTheOneAfterCurrent
			? parent.firstElementChild
			: parent.lastElementChild
	} else {
		// Get the direct child of the parent instead of a probably deeply nested child
		const directChild = focusedElement.parentElement !== parent
			? findParentThat(element => element.parentElement === parent, focusedElement)
			: focusedElement

		// Get the next element after the direct child
		nextToFocus = isTheOneAfterCurrent
			? (directChild.nextElementSibling ?? parent.firstElementChild)
			: (directChild.previousElementSibling ?? parent.lastElementChild)
	}

	// If the currently selected next element is not focusable or is not a submenu
	while (!(isFocusable(nextToFocus) || nextToFocus instanceof ContextMenuGroupElement)) {
		nextToFocus = isTheOneAfterCurrent
			? (nextToFocus.nextElementSibling ?? parent.firstElementChild)
			: (nextToFocus.previousElementSibling ?? parent.lastElementChild)
	}

	if (nextToFocus instanceof ContextMenuGroupElement) {
		return nextToFocus.querySelector("summary")
	}

	return nextToFocus
}

