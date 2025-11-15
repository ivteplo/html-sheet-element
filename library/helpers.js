//
// Copyright (c) 2022-2025 Ivan Teplov
// Licensed under the Apache license 2.0
//

/**
 * Check if the element is focused
 * @param {HTMLElement}
 * @returns {boolean}
 */
export const isFocused = element => document.activeElement === element

/**
 * Get object that contains touch position (depending on event type)
 * @param {MouseEvent|TouchEvent} event
 * @returns {MouseEvent|Touch}
 */
export const touchPosition = (event) =>
	event.type === "touchend"
		? event.changedTouches[0]
		: event.type.startsWith("touch")
		? event.touches[0]
		: event

/**
 * @param {HTMLElement} element
 * @param {string} variableName
 * @returns {string?}
 */
export function getCSSVariableValue(element, variableName) {
	return getComputedStyle(element).getPropertyValue(variableName)
}

/**
 * Check if the element (or its shadow root) contains the child
 * @param {HTMLElement} child
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export function elementContains(child, element) {
	return element.contains(child) || element.shadowRoot?.contains(child)
}


const eventHandlerAttributePattern = /^on([A-Z][a-zA-Z]*)$/

/**
 * @template {string} Tag
 * @param {Tag} tagName
 * @param {Record<string, string|function>} attributes
 * @param {HTMLElement|string|number|bigint} children
 * @returns {ElementTagNameMap[Tag]|HTMLElement}
 */
export function createElement(tagName, attributes, ...children) {
	const element = document.createElement(tagName)
	attributes ??= {}

	for (const [attribute, value] of Object.entries(attributes)) {
		const eventHandlerPatternMatches = attribute.match(eventHandlerAttributePattern)

		if (eventHandlerPatternMatches) {
			const event = eventHandlerPatternMatches[1].toLowerCase()
			element.addEventListener(event, value)
		} else if (attribute === "reference") {
			value?.(element)
		} else {
			element.setAttribute(attribute, value)
		}
	}

	for (const child of children) {
		switch (typeof child) {
			case "undefined":
				break
			case "string":
			case "number":
			case "bigint":
				element.appendChild(document.createTextNode(String(child)))
				break
			case "object":
				if (child === null) {
					break
				}

				if (child instanceof HTMLElement) {
					element.appendChild(child)
					break
				}

				// Note: if the child is not of type HTMLElement,
				// we will go into the default handler too
			default:
				throw new Error("Unexpected type of child: " + typeof child)
		}
	}

	return element
}

/**
 * Map the number from one range to another
 * @param {number} number
 * @param {[from: number, to: number]} currentRange
 * @param {[from: number, to: number]} newRange
 * @returns {number} - value in the new interval
 */
export function mapNumber(number, currentRange, newRange) {
	const currentRangeSize = currentRange[1] - currentRange[0]
	const newRangeSize = newRange[1] - newRange[0]
	return (number - currentRange[0]) / currentRangeSize * newRangeSize + newRange[0]
}

/**
 * @param {Node} element
 * @returns {boolean}
 */
export function isFocusable(element) {
	// If `tabindex` of the element is negative
	// or if the element is disabled,
	// it is not possible to focus on it.
	if (element.tabIndex < 0 || element.disabled) {
		return false
	}

	if (element instanceof HTMLAnchorElement) {
		return Boolean(element.href)
	}

	if (element instanceof HTMLInputElement) {
		return element.type !== "hidden"
	}

	return element instanceof HTMLElement
}

/**
 * Focus on the first focusable element inside of the provided one.
 * @param {HTMLElement} element
 * @returns {boolean} - whether a focusable element was found.
 */
export function focusOnFirstDescendantOf(element) {
	for (const child of element.childNodes) {
		// If we can focus on the child node itself.
		if (isFocusable(child)) {
			console.log("focused on", child)
			child.focus()
			return true
		}

		// If the child node has children
		// which are focusable, focus on them.
		if (focusOnFirstDescendantOf(child)) {
			return true
		}
	}

	return false
}
