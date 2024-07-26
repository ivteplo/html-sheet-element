//
// Copyright (c) 2022-2024 Ivan Teplov
// Licensed under the Apache license 2.0
//

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
