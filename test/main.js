//
// Copyright (c) 2022-2023 Ivan Teplov
// Licensed under the Apache license 2.0
//

import { BottomSheet } from "../library/index"

const openSheetButton = document.querySelector("#open-sheet")
const sheetBody = document.querySelector("#sheet-body")
const sheet = new BottomSheet("sheet", sheetBody)

/*
  // Currently, aria-controls in written directly in HTML,
  // but you can set it programmatically this way:
  openSheetButton.setAttribute("aria-controls", sheet.id)
*/

openSheetButton.addEventListener("click", () => {
  sheet.setIsShown(true)
})
