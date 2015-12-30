# B&W Box

Black & White Box is a simple and effective modal / popup jQuery plugin, with (tested) cross-browser support back to IE9. Dynamically centered mdoals / mobile-friendly design / jQuery chaining. Supports data-attributes, direct element selection, or html entry.

## Live Demo

Coming Soon

## Installation

Download the necessary files:

* Javascript from `src/js/jquery.bw-box.js` or `dist/js/jquery.bw-box.js`
* CSS from `dist/js/jquery.bw-box.js`

Place them in your directory and link to them from your implementation page - include the CSS link in the `head`, and the Javascript file after the jQuery script and before the closing `body` tag.

## Implementation

To instantiate a B&W Box, add a target link like so with the `data-modal` set to the ID or class of the target modal:

```html
<a href="#" class="default-link" data-modal="#default-modal">Default Modal</a>
```

Then include the default modal structure, with the ID or class referenced in the link:

```html
<!-- Standard B&W Box Structure -->
<div id="default-modal" class="bwbox__modal">
  <div class="bwbox__modal__outer">
    <div class="bwbox__modal__middle">
      <div class="bwbox__modal__inner">
        <a href="#" class="bwbox__modal__inner__close">CLOSE X</a>
        <div class="bwbox__modal__inner__content">
          <!-- Content Goes Here -->
        </div>
      </div>
    </div>
  </div>
</div>
<!-- End structure -->
```

Then initialize the B&W Box by adding the following in a script tag or separate js file (note: this is initialized on the link object):

```javascript
// Default setup
$('.default-link').bwBox();
```

If there are multiple

**Note:** This plugin updates `body` styling to `position: fixed` to resolve mobile overlay issues - you may need to add the following styling to ensure proper behavior:

```css
body {
  width: 100%;
}
```

## Options

The B&W Box plugin accepts several options:

* **selectorType:** `data` (string), `element`, or `html` - Determines the definition / structure of the returned modal
`data` retrieves the `data-modal` attribute from the selected element
`element` retrieves the `elementSelectors` array option
`html` retrieves the `htmlContent` formatted string option and generates modal dynamically (doesn't require structure entered on the page)
* **elementSelectors:** null (array) array of strings corresponding to the number of elements encompassed by the selector.
* **htmlContent:** null (string) HTML-formatted string to populate the modal dynamically without prior structure
* **complete:** null (function) callback function after initialization of the modals
