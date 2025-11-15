//
// Copyright (c) 2022-2025 Ivan Teplov
// Licensed under the Apache license 2.0
//

import { SheetElement } from "../library/index.js"
SheetElement.defineAs("ui-sheet")

const openSheetButton = document.getElementById("open-sheet")
const sheet = document.getElementById("sheet")

openSheetButton.addEventListener("click", () => {
	sheet.showModal()
})

sheet.addEventListener("open", () => {
	console.log("The sheet has been opened")
})

sheet.addEventListener("cancel", () => {
	// Calling `event.preventDefault()` would prevent the sheet from getting closed
	console.log("The sheet will be closed")
})

sheet.addEventListener("close", () => {
	console.log("The sheet has been closed with the return value:", sheet.returnValue)
})

