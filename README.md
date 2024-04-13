# HTML Sheet Element

HTML Custom Element for creating sheets. Displayed as a bottom sheet on mobile and centered sheet on desktop.


## Features

- Has a draggable area to resize the sheet
- The sheet can be closed using a button in the top right corner, using the `Esc` key, or by clicking outside the bottom sheet
  - This behavior is configurable. You can turn off the `Esc` or the click outside the sheet when you want.
- API is similar to the `<dialog>` element's


## Installation

You can install this library from the npm registry:

```bash
npm install @ivteplo/html-sheet-element
```

Or you can import it dynamically from a CDN:

```javascript
const { SheetElement } = await import("https://unpkg.com/@ivteplo/html-sheet-element@1.0.0/build/index.js")
```


## Usage

Before being able to use the element in your HTML, you need to specify a tag name for it using JavaScript:

```javascript
import { SheetElement } from "@ivteplo/html-sheet-element"

// You can choose another tag name instead of `ui-sheet`
customElements.define("ui-sheet", SheetElement)
```

Then you can use the tag in your HTML:

```html
<ui-sheet id="sheet">
  <p>Hello World!</p>
</ui-sheet>
```

To open a sheet, call the element's `showModal` method:

```javascript
const sheet = document.querySelector("sheet")
sheet.showModal()
```


## API Documentation

You can find API documentation [here](./documentation/API.md).


## Development

### Prerequisites

You need to have Git, Node.js, Deno, and any browser installed.

### Setup

1. Open your terminal

2. Clone this repository
    ```bash
    git clone https://github.com/ivteplo/html-sheet-element/
    ```

3. Navigate into the cloned directory
    ```bash
    cd html-sheet-element
    ```

4. Install dependencies
    ```bash
    npm install
    ```

5. Start the development server
    ```bash
    npm run dev
    ```

6. Build the library
    ```bash
    npm run build
    ```

7. Build the API documentation
    ```bash
    npm run docs:api
    ```

8. Happy hacking :tada:

