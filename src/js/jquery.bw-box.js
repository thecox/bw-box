/**
 *  Copyright 2015 Andrew Cox
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

(function($) {
  'use strict';

  $.fn.bwBox = function( options ) {

    // Plugin options / default settings
    var settings = $.extend({
      selectorType: 'data', // data or element
      elementSelectors: null,
      htmlContent: null,
      complete: null
    }, options);

    // Return jQuery object for chaining
    return this.each(function(index) {
      // Global variable declarations
      // +++++ NEED TO ADD VARIABLE COMMENTS +++++
      var $popupElement,
          currentScrollTop = 0;

      var generatePopup = function(content) {
        var $popup = $('<div/>', {'class': 'bwbox__modal', id: 'html-popup-'+index}).append(
          $('<div/>', {'class': 'bwbox__modal__outer'}).append(
            $('<div/>', {'class': 'bwbox__modal__middle'}).append(
              $('<div/>', {'class': 'bwbox__modal__inner'}).append(
                $('<a/>', {'href': '#', 'class': 'bwbox__modal__inner__close', text: 'CLOSE X'})
              ).append(
                $('<div/>', {'class': 'bwbox__modal__inner__content', html: content })
              )
            )
          )
        );
        $('body').append($popup);
        return $popup;
      };

      // Identify the selector method and popup object
      // elementSelectors is an optional array used with the element selector type
      switch(settings.selectorType) {
        case 'data':
          $popupElement = $($(this).data('popup'));
          break;
        case 'element':
          if (!settings.elementSelectors) { throw Error('Please provide an element selector array.'); }
          else {
            if (!settings.elementSelectors[index]) {
              throw Error('Please provide an element selector for popup ' + (index + 1) + '.');
            } else {
              $popupElement = $(settings.elementSelectors[index]);
            }
          }
          break;
        case 'html':
          if (!settings.htmlContent){ throw Error('Please provide content to populate the html element'); }
          else { $popupElement = generatePopup(settings.htmlContent); }
          break;
        default:
          throw Error('Please provide selectorType of data, element, or html');
      }

      // +++++ NEED TO ADD VARIABLE COMMENTS +++++
      var activatePopup = function($popup) {
        var $middlepop = $popup.find('.bwbox__modal__middle');
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
