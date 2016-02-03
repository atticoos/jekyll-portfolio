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
      loadMaps();
    }
  });

  $('#contact-form').submit(function (event) {
    event.preventDefault();
    var fields = {
      name: $('#contact-form input[name=name]').val(),
      email: $('#contact-form input[name=email]').val(),
      message: $('#contact-form textarea[name=message]').val()
    };

    $('#contact-form').addClass('pending');
    $('#contact-form input[type=submit]').val('Sending...');

    $.post(window.site_api_url + '/contact-form', fields).done(function () {
      $('#contact-form').removeClass('pending').addClass('complete');
      $('#contact-form input[type=submit]').val('Sent!');
    }).fail(function (err) {
      $('#contact-form').removeClass('pending').addClass('failed');
      $('#contact-form input[type=submit]').val('Try again');
    });
    return false;
  });

  // callback defined in the deferred script
  function loadMaps () {
    var mapElement = document.getElementById('contact-map');
    if (!mapElement) {
      return;
    }
    var map = new google.maps.Map(mapElement, {
      center: {lat: 42.3702, lng: -71.0470833},
      zoom: 13,
      disableDefaultUI: true
    });
    hasLoadedMaps = true;
  }
  var hasLoadedMaps = false;
}).call(this, jQuery, window);
