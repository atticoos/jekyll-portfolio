(function ($) {
  $(document).ready(function () {
    // $('.site-header .amburgah').click(function () {
    //   $('.site-header').toggleClass('active');
    //   return false;
    // });
    //
    // $('.landing .amburgah').click(function () {
    //   $('.landing').toggleClass('ham');
    //   return false;
    // });
    //
    // $('.landing .ham-overlay .portfolio').click(function () {
    //   $('html,body').animate({
    //     scrollTop: $('#portfolio').offset().top
    //   });
    //   $('.landing').removeClass('ham')
    // });

    $('.amburgah').click(function () {
      $('body').toggleClass('ham');
      return false;
    });
  });
}).call(this, jQuery);
