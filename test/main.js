//
// Copyright (c) 2022-2024 Ivan Teplov
// Licensed under the Apache license 2.0
//

import SheetElement from "../library/sheet"


customElements.define("ui-sheet", SheetElement)

const openSheetButton = document.getElementById("open-sheet")
const sheet = document.getElementById("sheet")

openSheetButton.addEventListener("click", () => {
  sheet.showModal()
})

sheet.addEventListener("open", () => {
  console.log("The sheet has been opened")
})

sheet.addEventListener("close", () => {
  console.log("The sheet has been closed")
})

