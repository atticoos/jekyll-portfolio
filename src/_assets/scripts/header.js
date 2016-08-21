(function ($) {
  $(document).ready(function () {
    $('.site-header .amburgah').click(function () {
      $('.site-header').toggleClass('active');
      return false;
    });

    $('.landing .amburgah').click(function () {
      $('.landing').toggleClass('ham');
      return false;
    });
  });
}).call(this, jQuery);
