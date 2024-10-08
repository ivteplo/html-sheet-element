# `SheetElement`

HTML Custom Element for creating sheets

<details open>
<summary><b>Example:</b> Define the element in the registry and use it in your HTML</summary>

```jsx
import SheetElement from "@ivteplo/html-sheet-element"
SheetElement.defineAs("ui-sheet")

// in HTML:
<ui-sheet>
  <p>Hello World!</p>
</ui-sheet>
```

</details>

<details open>
<summary><b>Example:</b> Open the sheet by default</summary>

```jsx
<ui-sheet open>
  <p>Hello World!</p>
</ui-sheet>
```

</details>

<details open>
<summary><b>Example:</b> Execute certain actions when the sheet opens or closes</summary>

```jsx
const sheet = document.querySelector("...")

sheet.addEventListener("open", event => {
  console.log("The sheet is now shown")
})

sheet.addEventListener("close", event => {
  console.log("The sheet is now closed")
})
```

</details>

<details open>
<summary><b>Example:</b> Confirm whether the user actually wants to close a sheet without submition</summary>

```jsx
// HTML:
<ui-sheet>
  <form method="dialog">
    <textbox placeholder="Your feedback" required></textbox>
    <button type="submit">Send</button>
  </form>
</ui-sheet>

// JavaScript:
sheet.addEventListener("cancel", event => {
  const userWantsToClose = confirm("Are you sure you want to close the form without submition?")
  if (!userWantsToClose) {
    // the sheet is not going to be closed
    event.preventDefault()
  }
})
```

</details>

<details open>
<summary><b>Example:</b> Open the sheet programmatically</summary>

```jsx
const sheet = document.querySelector("...")

sheet.showModal()
// is the same as:
sheet.show()
```

</details>

<details open>
<summary><b>Example:</b> Show a title in the sheet header</summary>

```jsx
<ui-sheet>
  <h2 slot="title-area">Title</h2>
  <!-- ... -->
</ui-sheet>
```

</details>

<details open>
<summary><b>Example:</b> Replace a button in the sheet header</summary>

```jsx
<ui-sheet id="sheet">
  <button slot="button-area" type="button" aria-controls="sheet" onclick="sheet.close()">Close</button>
  <!-- ... -->
</ui-sheet>
```

</details>


## `options`

Options for behavior customization

<details open>
<summary><b>Example:</b> Make the sheet <i>not</i> close on backdrop click</summary>

```jsx
<ui-sheet ignore-backdrop-click>
  ...
</ui-sheet>
```

</details>

<details open>
<summary><b>Example:</b> Make the sheet <i>not</i> close when pressing Escape</summary>

```jsx
<ui-sheet ignore-escape-key>
  ...
</ui-sheet>
```

</details>

<details open>
<summary><b>Example:</b> Make the sheet <i>not</i> close when dragging it down</summary>

```jsx
<ui-sheet ignore-dragging-down>
  ...
</ui-sheet>
```

</details>


## `returnValue`

Gets or sets the return value for the sheet, usually to indicate which button the user pressed to close it.

**see**: https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/returnValue

**type**: string


## `static defineAs(tag: string): void`

Function to define the sheet element in the HTML Custom Element Registry

<details open>
<summary><b>Example</b></summary>

```jsx
import SheetElement from "@ivteplo/html-sheet-element"
SheetElement.defineAs("ui-sheet")
```

</details>


## `showModal(): void`

Open the sheet


## `show(): void`

Open the sheet


## `close(): void`

Collapse the sheet


## `get open(): boolean`

Check if the sheet is open


## `set open(value: boolean): boolean`

An alternative way to open or close the sheet

<details open>
<summary><b>Example</b></summary>

```jsx
sheet.open = true  // the same as executing sheet.show()
sheet.open = false // the same as executing sheet.close()
```

</details>
