(function ($) {
  'use strict';

  function animateCircles () {
    var $circles = {
      left: $('.circles .skills'),
      center: $('.circles .me'),
      right: $('.circles .work')
    };

    $('.circles').addClass('animated');
    $circles.center.fadeIn();

    setTimeout(function () {
      $circles.left.show(); //('display', 'block').css('color', 'red');
      $circles.right.show();
      setTimeout(function () {
        $circles.left.addClass('animate')
        $circles.right.addClass('animate');
        setTimeout(function () {
          $('.circles').addClass('done');
        }, 1000);
      }, 100);
    }, 500);
  }

  $(document).ready(animateCircles);
})(jQuery);
