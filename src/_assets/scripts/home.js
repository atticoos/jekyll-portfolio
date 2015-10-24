(function ($) {
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
          position = 0;

      if (targetSelector !== '#') {
        position = $(targetSelector).offset().top;
      }
      $('html,body').animate({
        scrollTop: position + 'px'
      });
    });
  });
}).call(this, jQuery);
