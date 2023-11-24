# Bottom Sheet
Bottom sheet, implemented in pure HTML, CSS, and JavaScript

## Features
- There is a draggable area to resize the sheet
- The sheet can be closed using a button in the top right corner, using the `Esc` key, or by clicking outside the bottom sheet
  - This behavior is configurable. You can turn off the `Esc` or the click outside the sheet when you want.


## Example

```html
<!-- Insert this into the `<head>` if you want to enable the base styles for the sheet -->
<link rel="stylesheet" type="text/css" href="/path/to/the/library/build/index.css">

<button type="button" id="open-sheet">Open the sheet</button>

<template id="sheet-body-template">
  <h1>Hello world!</h1>
</template>
```

```javascript
import { BottomSheet } from "@ivteplo/bottom-sheet"


// Get the button to open the sheet from the document object model (DOM)
const openSheetButton = document.getElementById("open-sheet")

// Get the sheet body template from the DOM
const sheetBodyTemplate = document.getElementById("sheet-body-template")

// Create an HTML element that will contain the contents of the template
const sheetBody = document.createElement("div")

// Clone the contents of the sheet body template and append them to the HTML element
sheetBody.append(sheetBodyTemplate.contents.cloneNode(true))


// Create the sheet. The first argument is the identifier of the sheet.
// The second argument is the sheet body. The third is bottom sheet options.
const sheet = new BottomSheet("sheet", sheetBody, {
  closeOnBackgroundClick: true,
  closeOnEscapeKey: true
})

// Append the sheet to the document body
document.body.appendChild(sheet.html)

// Make the sheet open on button click
openSheetButton.addEventListener("click", () => {
  sheet.setIsShown(true)
})
```

