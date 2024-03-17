# HTML Sheet Element

HTML Custom Element for creating sheets. Displayed as a bottom sheet on mobile and centered sheet on desktop.


## Features

- Has a draggable area to resize the sheet
- The sheet can be closed using a button in the top right corner, using the `Esc` key, or by clicking outside the bottom sheet
  - This behavior is configurable. You can turn off the `Esc` or the click outside the sheet when you want.
- API is similar to the `<dialog>` element's


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

