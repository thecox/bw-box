(function($) {
  'use strict';

  $.fn.bwBox = function( options ) {

    // Default settings
    var settings = $.extend({
      selectorType: 'data', // data or element
      elementSelectors: null,
      complete: null
    }, options);

    return this.each(function(index) {
      // Global variable declarations
      // +++++ NEED TO ADD VARIABLE COMMENTS +++++
      var $popupElement,
          currentScrollTop = 0;

      // +++++ NEED TO ADD VARIABLE COMMENTS +++++
      var activatePopup = function($popup) {
        var $middlepop = $popup.find('.bxbox__modal__middle');
        currentScrollTop = $('body').scrollTop();
        $('body').css('top', -currentScrollTop);
        // +++++ ADD ANIMATION OPTIONS TO AFFECT THIS +++++
        $middlepop.css('top', '-3%');

        // Fade in and animate popup into position
        $popup.fadeIn({ queue: false, duration: 200 });
        $middlepop.animate({ top: '0%' }, 200);

        // Disable scrolling on body & position fixed to resolve mobile issues
        // +++++ ADD OPTION TO DISABLE FIXED POSITIONING AS IT COULD CAUSE ISSUES WITH CERTAIN LAYOUTS +++++
        $('body').css({ 'position': 'fixed', 'overflow': 'hidden' });
      };

      // Deactivate the popup
      var deactivatePopup = function($popup) {
        $popup.fadeOut();
        $('body').css({ 'position': 'static', 'overflow': 'auto' });
        $('body').scrollTop(currentScrollTop);
      };

      // Identify the selector method and popup object
      // elementSelectors is an optional array used with the element selector type
      if (settings.selectorType === 'data') {
        $popupElement = $($(this).data('popup'));
      } else if (settings.selectorType === 'element') {
        if (!settings.elementSelectors) {
          throw Error('Please provide an element selector');
        } else {
          $popupElement = $(settings.elementSelectors[index]);
        }
      } else {
        throw Error('Please provide selectorType of either data or element');
      }

      // On link / element click, activate popup
      $(this).on('click', function(e) {
        activatePopup($popupElement);
        e.preventDefault();
      });

      // On close button click, deactivate the popup
      $popupElement.on('click', '.bwbox__modal__inner__close', function(e) {
        deactivatePopup($popupElement);
        e.preventDefault();
      });

      // On click anywhere but popup info or children, hide popup
      // +++++ DEFINE VARIABLES TO "GLOBAL" AS THEY WILL ONLY AFFECT THIS ELEMENT +++++
      $(document).on("mouseup touchend", function(event) {
        if ($popupElement.is(':visible')) {
          var container = $popupElement.find(".bwbox__modal__inner");
          var parentContainer = container.parents(".bwbox__modal");
          if (container.css("display") === "block" || container.css("display") === "inline-block") {
            // If click event is on container, container child, or toggle button, do nothing - otherwise, toggle
            if (!container.is(event.target) && container.has(event.target).length === 0) {
              deactivatePopup($popupElement);
            }
          }
        }
      });

      // Callback function on setup complete
      if ($.isFunction( settings.complete )) {
        settings.complete.call( this );
      }
    });

  };

})(jQuery);
