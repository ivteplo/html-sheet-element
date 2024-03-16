# SheetElement
HTML Custom Element for creating sheets

## get open(): boolean
Check if the sheet is open

## set open(value: boolean): boolean
An alternative way to open or close the sheet
*example*: sheet.open = true  // the same as executing sheet.showModal()
sheet.open = false // the same as executing sheet.close()

## showModal(): void
Open the sheet

## close(): void
Collapse the sheet

## connectedCallback(): void
Attaches event listeners to the window when the sheet is mounted

## disconnectedCallback(): void
Removes all the event listeners when the sheet is no longer mounted