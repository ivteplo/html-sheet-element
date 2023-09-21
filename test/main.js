//
// Copyright (c) 2022-2023 Ivan Teplov
// Licensed under the Apache license 2.0
//

import { BottomSheet } from "../library/index"

const openSheetButton = document.querySelector("#open-sheet")
const sheetBody = document.querySelector("#sheet-body")
const sheet = new BottomSheet(sheetBody)

openSheetButton.addEventListener("click", () => {
  sheet.setIsShown(true)
})
