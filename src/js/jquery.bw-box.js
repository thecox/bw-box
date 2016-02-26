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

  $.bwBox = function(element, options, index) {
    var $element = $(element),
        plugin = this;
    plugin.DEFAULTS = {
      selectorType: 'data',
      elementSelectors: null,
      htmlContent: null,
      complete: null
    };
    plugin.settings = {};
    plugin.$modalElement = null;

    /**
     * init
     *
     * @description Intializes the plugin. Returns nothing
     */
    plugin.init = function() {
      plugin.settings = $.extend({}, plugin.DEFAULTS, options);

      /** Error catching for modal definitions */
      try {
        defineModal();
      } catch (error) {
        console.error(error);
        return;
      }
      bindListeners();

      /** Callback function on setup complete */
      if ($.isFunction( plugin.settings.complete )) {
        plugin.settings.complete.call( this );
      }
    };

    /**
     * defineModal
     *
     * @description Determine $modalElement based on selectorType. Returns nothing - private
     */
    var defineModal = function() {
      switch(plugin.settings.selectorType) {
        case 'data':
          if (!$($element.data('modal')).length) { throw new Error('No matching modal was found on the page'); }
          plugin.$modalElement = $($element.data('modal'));
          break;
        case 'element':
          if (!plugin.settings.elementSelectors) { throw new Error('Please provide an element selector array'); }
          if (!plugin.settings.elementSelectors[index]) { throw new Error('Please provide an element selector for modal ' + (index + 1)); }
          plugin.$modalElement = $(plugin.settings.elementSelectors[index]);
          break;
        case 'html':
          if (!plugin.settings.htmlContent){ throw new Error('Please provide content to populate the html element'); }
          plugin.$modalElement = generateModal(plugin.settings.htmlContent);
          break;
        default:
          throw new Error('Please provide selectorType of data, element, or html');
      }
    };

    /**
     * generateModal
     *
     * @description Auto-generate structure to wrap submitted content - private
     * @param {HTMLElement} content The HTMl content to insert into the wrapper
     * @return {jQuery} Generated jQuery modal element
     */
    var generateModal = function(content) {
      /** Generate bwbox__modal jQuery object */
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

      /** Append jQuery object to body */
      $('body').append($modal);

      // Return jQuery object for later manipulation
      return $modal;
    };

    /**
     * getScrollBarWidth
     *
     * @description Determine browser scrollbar width - private
     * @return {Number} Width of scrollbar
     */
    var getScrollBarWidth = function() {
      var $outer = $('<div>').css({visibility: 'hidden', width: 100, overflow: 'scroll'}).appendTo('body'),
          widthWithScroll = $('<div>').css({width: '100%'}).appendTo($outer).outerWidth();
      $outer.remove();
      return 100 - widthWithScroll;
    };

    /**
     * activateModal
     *
     * @description Activate modal element and overlay page. Returns nothing - public
     * @param {jQuery} $modal The modal element to activate
     */
    plugin.activateModal = function() {
      var $middlepop = plugin.$modalElement.find('.bwbox__modal__middle');
      var scrollbarWidth = getScrollBarWidth() > 0 ? (getScrollBarWidth() - 1) : 0;
      window.bwboxCurrentScrollTop = $('body').scrollTop();
      $('body').css('top', -window.bwboxCurrentScrollTop);

      // +++++ ADD ANIMATION OPTIONS TO AFFECT DROPDOWN +++++
      $middlepop.css('top', '-3%');

      /** Fade in and animate modal into position */
      plugin.$modalElement.fadeIn({ queue: false, duration: 200 });
      $middlepop.animate({ top: '0%' }, 200);

      /** Disable scrolling on body & position fixed to resolve mobile issues */
      // +++++ ADD OPTION TO DISABLE FIXED POSITIONING AS IT COULD CAUSE ISSUES WITH CERTAIN LAYOUTS +++++
      $('body').css({ 'position': 'fixed', 'overflow': 'hidden', 'width': '100%' }).css('width', '-=' + scrollbarWidth);
    };

    /**
     * deactivateModal
     *
     * @description Deactivate current modal element. Returns nothing - public
     * @param {jQuery} $modal The modal element to deactivate
     */
    plugin.deactivateModal = function() {
      plugin.$modalElement.fadeOut();
      $('body').css({ 'position': 'static', 'overflow': 'auto', 'width': '100%' });
      $('body').scrollTop(window.bwboxCurrentScrollTop);
    };

    /**
     * bindListeners
     *
     * @description Add click listeners to modal elements. Returns nothing - private
     */
    var bindListeners = function() {
      $element.on('click', function(e) {
        plugin.activateModal();
        e.preventDefault();
      });

      plugin.$modalElement.on('click', '.bwbox__modal__inner__close', function(e) {
        plugin.deactivateModal();
        e.preventDefault();
      });

      /** On click anywhere besides modal content, hide modal */
      $(document).on("mouseup touchend", function(event) {
        if (plugin.$modalElement.is(':visible')) {
          var container = plugin.$modalElement.find(".bwbox__modal__inner");
          var parentContainer = container.parents(".bwbox__modal");
          if (container.css("display") === "block" || container.css("display") === "inline-block") {
            /** If click event is on container, or container child do nothing - otherwise, deactivate modal */
            if (!container.is(event.target) && container.has(event.target).length === 0) {
              plugin.deactivateModal();
            }
          }
        }
      });
    };

    plugin.init();
  };

  $.fn.bwBox = function( options ) {
    /** Return jQuery object for chaining */
    return this.each(function(index) {
      window.bwboxCurrentScrollTop = 0;

      /** If plugin is not yet attached to this element, attach */
      if (undefined === $(this).data('bwBox')) {
        var plugin = new $.bwBox(this, options, index);
        $(this).data('bwBox', plugin);
      }
    });
  };

})(jQuery);
