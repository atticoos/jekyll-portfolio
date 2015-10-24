(function ($) {
  'use strict';

  $(document).ready(function () {
    $('.skills .more').click(function () {
      $('.skills .row.hidden').removeClass('hidden');
      $('.skills').removeClass('collapsed');
      $(this).hide();
      return false;
    });
  });
}).call(this, jQuery);
