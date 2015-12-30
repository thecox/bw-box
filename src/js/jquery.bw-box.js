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
      selectorType: 'data', // data, element, or html
      elementSelectors: null, // array of objects matching number of element links
      htmlContent: null, // html-formatted strings
      complete: null // callback function
    }, options);

    // Return jQuery object for chaining
    return this.each(function(index) {
      // Global variable declarations
      // +++++ NEED TO ADD VARIABLE COMMENTS +++++
      var $modalElement,
          currentScrollTop = 0;

      // Add structure on the fly via content
      var generateModal = function(content) {
        // Generate bwbox__modal jQuery object
        var $modal = $('<div/>', {'class': 'bwbox__modal', id: 'html-modal-'+index}).append(
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

        // Append to body
        $('body').append($modal);

        // Return jQuery object for later manipulation
        return $modal;
      };

      // Identify the selector method and modal object
      // elementSelectors is an optional array used with the element selector type
      switch(settings.selectorType) {
        case 'data':
          $modalElement = $($(this).data('modal'));
          break;
        case 'element':
          if (!settings.elementSelectors) { throw Error('Please provide an element selector array.'); }
          else {
            if (!settings.elementSelectors[index]) {
              throw Error('Please provide an element selector for modal ' + (index + 1) + '.');
            } else {
              $modalElement = $(settings.elementSelectors[index]);
            }
          }
          break;
        case 'html':
          if (!settings.htmlContent){ throw Error('Please provide content to populate the html element'); }
          else { $modalElement = generateModal(settings.htmlContent); }
          break;
        default:
          throw Error('Please provide selectorType of data, element, or html');
      }

      // +++++ NEED TO ADD VARIABLE COMMENTS +++++
      var activateModal = function($modal) {
        var $middlepop = $modal.find('.bwbox__modal__middle');
        currentScrollTop = $('body').scrollTop();
        $('body').css('top', -currentScrollTop);
        // +++++ ADD ANIMATION OPTIONS TO AFFECT THIS +++++
        $middlepop.css('top', '-3%');

        // Fade in and animate modal into position
        $modal.fadeIn({ queue: false, duration: 200 });
        $middlepop.animate({ top: '0%' }, 200);

        // Disable scrolling on body & position fixed to resolve mobile issues
        // +++++ ADD OPTION TO DISABLE FIXED POSITIONING AS IT COULD CAUSE ISSUES WITH CERTAIN LAYOUTS +++++
        $('body').css({ 'position': 'fixed', 'overflow': 'hidden' });
      };

      // Deactivate the modal
      var deactivateModal = function($modal) {
        $modal.fadeOut();
        $('body').css({ 'position': 'static', 'overflow': 'auto' });
        $('body').scrollTop(currentScrollTop);
      };

      // On link / element click, activate modal
      $(this).on('click', function(e) {
        activateModal($modalElement);
        e.preventDefault();
      });

      // On close button click, deactivate the modal
      $modalElement.on('click', '.bwbox__modal__inner__close', function(e) {
        deactivateModal($modalElement);
        e.preventDefault();
      });

      // On click anywhere besides modal content, hide modal
      // +++++ DEFINE VARIABLES TO "GLOBAL" AS THEY WILL ONLY AFFECT THIS ELEMENT +++++
      $(document).on("mouseup touchend", function(event) {
        if ($modalElement.is(':visible')) {
          var container = $modalElement.find(".bwbox__modal__inner");
          var parentContainer = container.parents(".bwbox__modal");
          if (container.css("display") === "block" || container.css("display") === "inline-block") {
            // If click event is on container, container child, or toggle button, do nothing - otherwise, toggle
            if (!container.is(event.target) && container.has(event.target).length === 0) {
              deactivateModal($modalElement);
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
