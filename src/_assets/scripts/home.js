(function ($, window) {
  'use strict';

  $(document).ready(function () {
    if (!$('body').hasClass('page-index')) {
      return;
    }
		$('img[data-original]').lazyload({
			threshold:200
		});
    $('.portfolio-items img[data-original]').lazyload({
      threshold: 200,
      event: 'showLazyLoad'
    });
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
    $('#view-more-portfolio').click(function () {
      $('.featured-portfolio-items').hide();
      $('.portfolio-items').fadeIn();
      $('.portfolio-items img[data-original]').trigger('showLazyLoad');
      $('html,body').animate({
        scrollTop: $('#portfolio').offset().top
      })
      return false;
    });
    $('.fluid-label').fluidLabel();
    var $grid = $('.grid').masonry({
      itemSelector: '.item',
      columnWidth: '.sizer',
      percentagePosition: true
    });

    $('.grid img').on('load', function () {
      $grid.masonry('layout');
    });
  });

  $('section.skills, section.me').waypoint({
    handler: function () {
      $('.site-nav nav a').removeClass('active');
      $('.site-nav nav a.home').addClass('active');
      $('section.me').addClass('active');
    }
  });
  $('#portfolio').waypoint({
    handler: function () {
      $('.site-nav nav a').removeClass('active');
      $('.site-nav nav a.portfolio').addClass('active');
      $('section.me').removeClass('active');
    }
  });
  $('#labs').waypoint({
    handler: function () {
      $('.site-nav nav a').removeClass('active');
      $('.site-nav nav a.labs').addClass('active');
      $('section.me').removeClass('active');
    }
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
