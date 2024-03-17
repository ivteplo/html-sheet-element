# `SheetElement`

HTML Custom Element for creating sheets

<details open>
<summary><b>Example:</b> Define the element in the registry</summary>

```jsx
customElements.define("ui-sheet", SheetElement)
```

</details>

<details open>
<summary><b>Example:</b> Execute certain actions when the sheet opens or closes</summary>

```jsx
const sheet = document.querySelector("...")

sheet.addEventListener("show", event => {
  console.log("The sheet is now shown")
})

sheet.addEventListener("close", event => {
  console.log("The sheet is now closed")
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


## `showModal(): void`

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
sheet.open = true  // the same as executing sheet.showModal()
sheet.open = false // the same as executing sheet.close()
```

</details>