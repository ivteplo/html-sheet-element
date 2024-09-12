# Changelog


## v1.0.0
- Basic functionality implementation
- API documentation


## v2.0.0

### Breaking changes
- The attribute `ignore-background-click` is now renamed to `ignore-backdrop-click` to make its meaning more understandable

### Enhancements
- The logic of `set open` now matches to the logic of the same setter in `<dialog>`
- More customization options
- New option to prevent closure on dragging the sheet down (`ignore-dragging-down` attribute)
- Support forms with `method="dialog"` inside of sheet (like in the `<dialog>` element)
- New `cancel` event that is called when a sheet gets closed without form submition
    - Allows to prevent the form from closing

### Bug fixes
- A duplicate event used to be triggered when calling `show`, `showModal`, or `close` twice


## v2.1.0

### Bug fixes
- Do not access attributes inside of the constructor. It should not be done according to the standard.
