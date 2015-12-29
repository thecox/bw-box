# B&W Box

Black & White Box is a simple and effective modal / popup jQuery plugin, with (tested) cross-browser support back to IE9. Dynamically centered popups / mobile-friendly design. Supports data-attributes, direct element selection, or html entry.

## Live Demo

Coming Soon

## Installation

Download the necessary files:

* Javascript from 'src/js/jquery.bw-box.js' or 'dist/js/jquery.bw-box.js'
* CSS from 'dist/js/jquery.bw-box.js'

Place them in your directory and link to them from your implementation page - include the CSS link in the 'head', and the Javascript file after the jQuery script and before the closing 'body' tag.

## Implementation

To instantiate a B&W Box, add a target link like so:

'''html
<a href="#" class="default-link" data-popup="#default-popup">Default Modal</a>
'''

Then include the default modal structure:

'''html
<!-- Standard B&W Box Structure -->
<div id="default-popup" class="bwbox__modal">
<div class="bwbox__modal__outer">
<div class="bwbox__modal__middle">
<div class="bwbox__modal__inner">
<a href="#" class="bwbox__modal__inner__close">CLOSE X</a>
<div class="bwbox__modal__inner__content">
<p>This is the default popup, which link uses data attributes - iterates through all links and uses data attributes to display</p>
</div>
</div>
</div>
</div>
</div>
<!-- End structure -->
'''

Then initialize the B&W Box by adding the following below the script:

'''javascript
// Default setup
$('.default-link').bwBox();
'''
