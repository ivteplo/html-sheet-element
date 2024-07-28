//
// Copyright (c) 2022-2024 Ivan Teplov
// Licensed under the Apache license 2.0
//

import { ContextMenuElement, ContextMenuItemElement, ContextMenuGroupElement } from "../library/index.js"

ContextMenuElement.defineAs("context-menu")
ContextMenuItemElement.defineAs("context-menu-item")
ContextMenuGroupElement.defineAs("context-menu-group")

const wrapper = document.getElementById("wrapper")
const contextMenu = document.getElementById("context-menu")

document.getElementById("select-all").addEventListener("click", () => {
	document.execCommand("selectAll")
})

document.getElementById("delete-paragraph").addEventListener("click", () => {
	wrapper.removeChild(document.querySelector('p'))
})

document.getElementById("remove-context-menu").addEventListener("click", () => {
	contextMenu.parentElement.removeChild(contextMenu)
})
