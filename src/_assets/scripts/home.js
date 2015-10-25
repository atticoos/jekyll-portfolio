(function ($, window) {
  'use strict';

  $(document).ready(function () {
    if (!$('body').hasClass('page-index')) {
      return;
    }
    $('.skills .more').click(function () {
      $('.skills .row.hidden').removeClass('hidden');
      $('.skills').removeClass('collapsed');
      $(this).hide();
      return false;
    });
    $('.site-nav nav a[href*=#]').click(function () {
      var targetSelector = $(this).attr('href').replace('/', ''),
          headerHeight = $('.site-header').height(),
          position = 0;

      if (targetSelector !== '#') {
        position = $(targetSelector).offset().top - headerHeight - 14;
      }
      $('html,body').animate({
        scrollTop: position + 'px'
      });
    });
  });

  // callback defined in the deferred script
  window.initMaps = function () {
    var mapElement = document.getElementById('contact-map');
    if (!mapElement) {
      return;
    }
    var map = new google.maps.Map(mapElement, {
      center: {lat: 42.3702, lng: -71.0470833},
      zoom: 13,
      disableDefaultUI: true
    });
  };
}).call(this, jQuery, window);
