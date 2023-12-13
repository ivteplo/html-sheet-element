//
// Copyright (c) 2022-2023 Ivan Teplov
// Licensed under the Apache license 2.0
//

import { BottomSheet } from "../library/sheet"

const openSheetButton = document.getElementById("open-sheet")
const sheetBodyTemplate = document.getElementById("sheet-body-template")
const sheetBody = document.createElement("div")
sheetBody.append(sheetBodyTemplate.content.cloneNode(true))

const sheet = new BottomSheet("sheet", sheetBody)
document.body.appendChild(sheet.html)

/*
  // Currently, aria-controls in written directly in HTML,
  // but you can set it programmatically this way:
  openSheetButton.setAttribute("aria-controls", sheet.id)
*/

openSheetButton.addEventListener("click", () => {
  sheet.setIsShown(true)
})
