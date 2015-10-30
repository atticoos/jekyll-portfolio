(function ($) {
  $(document).ready(function () {
    $('.site-header .amburgah').click(function () {
      $('.site-header').toggleClass('active');
      return false;
    });
  });
}).call(this, jQuery);
