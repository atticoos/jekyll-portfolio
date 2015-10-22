(function ($) {
  'use strict';

  var MAX_DIAMETER = 8,
      NUMBER_OF_DOTS = 70,
      VELOCITY = 0.7,
      COLORS = ['#FF9900', '#424242', '#BCBCBC', '#3299BB'];

  /**
   * The canvas control
   * This acts as a manager for rendering and managing particles
   */
  function DotCanvas ($container) {
    var self = this;
    this.$container = $container;
    this.canvas = document.createElement('canvas');
    this.canvas.width = $container.outerWidth();
    this.canvas.height = $container.outerHeight();
    this.context = this.canvas.getContext('2d');
    this.animating = false;
    this.dots = _.times(NUMBER_OF_DOTS, function () {
      return new Dot(this.canvas.width, this.canvas.height);
    }, this);
    this.$container.prepend(this.canvas);

    // only render the animation when in view
    this.$container.bind('inview', function (e, isInView) {
      if (isInView) {
        self.resume();
      } else {
        self.pause();
      }
    });
  }

  /**
   * Check if the dot is out of bounds.
   * The dot is out of bounds if it exceeds any edge of the canvas
   */
  DotCanvas.prototype.isDotOutOfBounds = function (dot) {
    return dot.x > (this.canvas.width + (dot.d / 2)) ||
      dot.x < -(dot.d / 2) ||
      dot.y > (this.canvas.height + (dot.d / 2)) ||
      dot.y < -(dot.d / 2);
  };

  /**
   * Updates the dots new position and draws it on the canvas
   */
  DotCanvas.prototype.drawDot = function (dot) {
    dot.updatePosition();
    this.context.fillStyle = dot.color;
    this.context.beginPath();
    this.context.arc(dot.x, dot.y, dot.d, 0, Math.PI * 2, false);
    this.context.fill();
  };

  /**
   * The rendering cycle of the canvas.
   * - Clear the canvas
   * - Draw the new dot positions
   * - Replace any dots that fall out of bounds
   */
  DotCanvas.prototype.render = function () {
    var self = this;
    if (!this.animating) {
      return;
    }

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // draw the dots
    _.forEach(this.dots, this.drawDot, this);

    // replace any dots that fall out of bounds
    this.dots = _.map(this.dots, function (dot) {
      if (this.isDotOutOfBounds(dot)) {
        // you are out of bounds. Here, take a new dot
        return new Dot(this.canvas.width, this.canvas.height);
      }
      return dot;
    }, this);

    requestAnimationFrame(function () {
      self.render();
    });
  };

  DotCanvas.prototype.pause = function () {
    this.animating = false;
  };

  DotCanvas.prototype.resume = function () {
    if (this.animating) {
      return;
    }
    this.animating = true;
    this.render();
  };

  /**
   * The dot
   * This keeps track of the particle properties and handles the delta
   */
  function Dot (canvasWidth, canvasHeight) {
    this.x = Math.round(Math.random() * canvasWidth);
    this.y = Math.round(Math.random() * canvasHeight);
    this.d = Math.random() * MAX_DIAMETER;
    this.dx = (Math.random() < 0.5 ? 1 : -1) * Math.random() * VELOCITY;
    this.dy = (Math.random() < 0.5 ? 1 : -1) * Math.random() * VELOCITY;
    this.color = _.sample(COLORS);
  }

  /**
   * Updates the new position by the delta
   */
  Dot.prototype.updatePosition = function () {
    this.x += this.dx;
    this.y += this.dy;
  };

  $(window).on('load', function () {
    var canvases = [];
    $('.background').each(function () {
      canvases.push(new DotCanvas($(this)));
    });
  });
}).call(this, jQuery);
