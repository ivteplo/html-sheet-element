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
 * Get object that contains touch position (depending on event type)
 * @param {MouseEvent|TouchEvent} event
 * @returns {MouseEvent|Touch}
 */
export const touchPosition = (event) =>
  event instanceof TouchEvent
    ? event.type === "touchend"
      ? event.changedTouches[0]
      : event.touches[0]
    : event


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
 * @param {HTMLElement} element
 * @param {string} variableName
 * @returns {string?}
 */
export function getCSSVariableValue(element, variableName) {
  return getComputedStyle(element).getPropertyValue(variableName)
}
