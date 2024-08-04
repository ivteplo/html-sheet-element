//
// Copyright (c) 2022-2024 Ivan Teplov
// Licensed under the Apache license 2.0
//

/**
 * Check if the element is focused
 * @param {HTMLElement}
 * @returns {boolean}
 */
export const isFocused = element => document.activeElement === element

/**
 * Tells if the element is focusable
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export function isFocusable(element) {
	return !element.hasAttribute("disabled") && (
		element instanceof HTMLButtonElement ||
		element instanceof HTMLAnchorElement ||
		element instanceof HTMLInputElement ||
		element instanceof HTMLTextAreaElement ||
		(element.getAttribute("tabindex") ?? "-1") !== "-1"
	)
}

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

/**
 * Tries to find a parent element that meets the specified criteria
 * @param {(parent: HTMLElement) => boolean} meetsCriteria
 * @param {HTMLElement} child
 * @returns {HTMLElement|null}
 */
export function findParentThat(meetsCriteria, child) {
	let parent = child?.parentElement

	while (parent && !meetsCriteria(parent)) {
		parent = parent?.parentElement
	}

	return parent
}

/**
 * Get the next child of the context menu.
 * Returns the top or bottom element when asking for the element
 * after the last one or before the first one respectively
 * @param {HTMLElement} parent
 * @param {HTMLElement} focusedElement
 * @param {boolean} isTheOneAfterCurrent
 */
export function getNextChildToFocusOnInsideOf(parent, focusedElement, isTheOneAfterCurrent) {
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
