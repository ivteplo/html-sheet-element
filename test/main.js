//
// Copyright (c) 2022-2023 Ivan Teplov
// Licensed under the Apache license 2.0
//

import "../library/sheet"

const openSheetButton = document.getElementById("open-sheet")
const sheet = document.getElementById("sheet")

openSheetButton.addEventListener("click", () => {
  sheet.showModal()
})

sheet.addEventListener("hide", () => {
  console.log("The sheet has been hidden")
})

sheet.addEventListener("show", () => {
  console.log("The sheet has been shown")
})
