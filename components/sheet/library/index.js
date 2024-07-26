//
// Copyright (c) 2022-2024 Ivan Teplov
// Licensed under the Apache license 2.0
//

import SheetElement from "./sheet.jsx"

export { SheetElement }

/**
 * Function to define the sheet element in the HTML Custom Element Registry
 * @param {string} tag - the tag for the sheet element
 * @example
 * import { defineAs } from "@ivteplo/html-sheet-element"
 * defineAs("ui-sheet")
 */
export function defineAs(tag) {
	customElements.define(tag, SheetElement, {})
}
