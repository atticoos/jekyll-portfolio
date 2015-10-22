// http://hakim.se/experiments/html5/wave/03/js/hakim.wave.js
(function ($) {
  'use strict';

  var WAVE_PARTICLES = 20,
      WAVE_VELOCITY = 2,
      WAVE_DENSITY = .75,
      WAVE_FRICTION = 1.14,
      BUBBLE_PARTICLES = 2,
      MIN_BUBBLE_DIAMETER = 10,
      MAX_BUBBLE_DIAMETER = 30,
      LARGE_BUBBLE_DISSOLVE = 20,
      SMALL_BUBBLE_DISSOLVE = 6,
      BUBBLE_VELOCITY = 15,
      WATER_DENSITY = 1.07,
      AIR_DENSITY = 1.02,
      MOUSE_PULL = 0.09,
      RIPPLE_FORCE = 5,
      RIPPLE_INTERVAL = 1000,
      AOE = 150,
      WAVE_COLOR_START = '#00AABB',
      WAVE_COLOR_END = 'rgba(0, 200, 250, 0)',
      BUBBLE_COLOR = '#rgba(0,200,255,0)';

  function WaveCanvas ($container) {
    var self = this;
    this.$container = $container;
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.canvas.width = this.$container.outerWidth();
    this.canvas.height = this.$container.outerHeight();
    this.$container.prepend(this.canvas);
    this.mousePosition = {x: 0, y: 0};
    this.mouseSpeed = {x: 0, y: 0};
    this.particles = {};
    this.particles.waves = _.times(WAVE_PARTICLES + 1, function (i) {
      return new WaveParticle(
        this.canvas.width / (WAVE_PARTICLES - 4) * (i - 2),
        this.canvas.height / 2
      );
    }, this);
    this.particles.bubbles = [];
    this.addBubble();

    $(this.canvas).mousemove(function (e) {
      self.mouseMove(e);
    });
    this.rippleInterval = setInterval(function () {
      self.ripple();
    }, RIPPLE_INTERVAL);
    this.bubbleInterval = setInterval(function () {
      self.addBubble();
    }, 500);
    this.render();
  }

  /**
   * Invoke a random ripple
   */
  WaveCanvas.prototype.ripple = function () {
    var waveParticle;
    if (this.mouseSpeed.x > 5 || this.mouseSpeed.y > 5) {
      return;
    }
    // grab a random wave particle to manipulate
    waveParticle = _.sample(this.particles.waves);
    // apply a force to the particle to cause a ripple
    waveParticle.force.y += (Math.random() * (RIPPLE_FORCE * 2) - RIPPLE_FORCE);
  };

  /**
   * Add a bubble to the wave
   */
  WaveCanvas.prototype.addBubble = function () {
    var dissolvedBubbleParticle;
    // if we exceed the number of bubble particles, blow one up
    if (this.particles.bubbles.length > BUBBLE_PARTICLES) {
      dissolvedBubbleParticle = _.find(this.particles.bubbles, {dissolved: false});
      if (dissolvedBubbleParticle !== _.first(this.particles.bubbles)) {
        dissolvedBubbleParticle.dissolveSize = SMALL_BUBBLE_DISSOLVE;
      }
      this.dissolveBubble(dissolvedBubbleParticle);
    }

    // create a new bubble particle
    this.particles.bubbles.push(new BubbleParticle(this.canvas.width, this.canvas.height));
  };

  /**
   * Dissolve a bubble
   */
  WaveCanvas.prototype.dissolveBubble = function (bubbleParticle) {
    var self = this;
    if (!bubbleParticle.dissolved) {
      bubbleParticle.dissolved = true;
      setTimeout(function () {
        // remove the bubble from the collection
        _.remove(self.particles.bubbles, bubbleParticle);
      }, 2000);
    }
  }

  /**
   * Receive mouse move events and track the current position and the speed based on the last position
   */
  WaveCanvas.prototype.mouseMove = function (e) {
    var x = e.layerX || e.offsetX,
        y = e.layerY || e.offsetY;
    this.mouseSpeed.x = Math.max(Math.min(e.offsetX - this.mousePosition.x, 40), -40);
    this.mouseSpeed.y = Math.max(Math.min(e.offsetY - this.mousePosition.y, 40), -40);
    this.mousePosition.x = e.offsetX;
    this.mousePosition.y = e.offsetY;
  };

  /**
   * The rendering cycle of the canvas
   */
  WaveCanvas.prototype.render = function () {
    var self = this;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.renderWaveParticles();
    this.renderBubbleParticles();
    requestAnimationFrame(function () {
      self.render();
    });
  };

  WaveCanvas.prototype.renderBubbleParticles = function () {
    this.context.fillStyle = BUBBLE_COLOR;
    this.context.beginPath();
    _.forEach(this.particles.bubbles, function (bubbleParticle) {
      var waveParticle = this.getClosestWaveParticle(bubbleParticle),
          distance = distanceBetween(this.mousePosition, bubbleParticle);

      bubbleParticle.velocity.y /= (bubbleParticle.y > waveParticle.y) ? WATER_DENSITY : AIR_DENSITY;
      bubbleParticle.velocity.y += (waveParticle.y > bubbleParticle.y) ? (1 / bubbleParticle.mass) : -((bubbleParticle.y - waveParticle.y) * 0.01) / bubbleParticle.mass;
      bubbleParticle.y += bubbleParticle.velocity.y;

      if (bubbleParticle.x > this.canvas.width - bubbleParticle.currentSize) {
        bubbleParticle.velocity.x = -bubbleParticle.velocity.x;
      }
      if (bubbleParticle.x < bubbleParticle.currentSize) {
        bubbleParticle.velocity.x = Math.abs(bubbleParticle.velocity.x);
      }

      bubbleParticle.velocity.x /= 1.04;
      bubbleParticle.velocity.x = bubbleParticle.velocity.x < 0 ? Math.min(bubbleParticle.velocity.x, -0.8/bubbleParticle.mass) :
        Math.max(bubbleParticle.velocity.x, 0.8/bubbleParticle.mass);
      bubbleParticle.x += bubbleParticle.velocity.x;

      if (!bubbleParticle.dissolved) {
        this.context.moveTo(bubbleParticle.x, bubbleParticle.y);
        this.context.arc(bubbleParticle.x, bubbleParticle.y, bubbleParticle.currentSize, 0, Math.PI * 2, true);
      } else {
        bubbleParticle.velocity.x /= 1.15;
        bubbleParticle.velocity.y /= 1.05;

        while (bubbleParticle.children.length < bubbleParticle.dissolveSize) {
          bubbleParticle.children.push({
            x: 0,
            y: 0,
            size: Math.random() * bubbleParticle.dissolveSize,
            velocity: {
              x: (Math.random() * 20) - 10,
              y: -(Math.random() * 10)
            }
          });
        }

        _.forEach(bubbleParticle.children, function (childParticle) {
          childParticle.x += childParticle.velocity.x;
          childParticle.y += childParticle.velocity.y;
          childParticle.velocity.x /= 1.1;
          childParticle.velocity.y += 0.4;
          childParticle.size /= 1.1;

          this.context.moveTo(
            bubbleParticle.x + childParticle.x,
            bubbleParticle.y + childParticle.y
          );
          this.context.arc(
            bubbleParticle.x + childParticle.x,
            bubbleParticle.y + childParticle.y,
            childParticle.size,
            0,
            Math.PI * 2,
            true
          );
        }, this);
      }


    }, this);
    this.context.fill();
  };

  WaveCanvas.prototype.getClosestWaveParticle = function (point) {
    var closest = _.first(this.particles.waves),
        closestDistance = 1000;

    _.forEach(this.particles.waves, function (waveParticle) {
      var distance = distanceBetween(waveParticle, point);
      if (distance < closestDistance) {
        closest = waveParticle;
        closestDistance = distance;
      }
    });
    return closest;
  };

  WaveCanvas.prototype.renderWaveParticles = function () {
    var gradientFill = this.context.createLinearGradient(
      this.canvas.width * 0.5,
      this.canvas.height * 0.2,
      this.canvas.width * 0.5,
      this.canvas.height
    );
    gradientFill.addColorStop(0, WAVE_COLOR_START);
    gradientFill.addColorStop(1, WAVE_COLOR_END);

    this.context.fillStyle = gradientFill;
    this.context.beginPath();
    this.context.moveTo(
      _.first(this.particles.waves).x,
      _.first(this.particles.waves).y
    );
    // draw each segment of the wave
    _.forEach(this.particles.waves, function (current, index) {
      var previous = this.particles.waves[index - 1],
          next = this.particles.waves[index + 1],
          forceY = 0,
          distance;

      if (!next || !previous) {
        return;
      }

      forceY += -WAVE_DENSITY * (previous.y - current.y);
      forceY += WAVE_DENSITY * (current.y - next.y);
      forceY += WAVE_DENSITY/15 * (current.y - current.original.y);

      current.velocity.y += - (forceY / current.mass) + current.force.y;
      current.velocity.y /= WAVE_FRICTION;
      current.force.y /= WAVE_FRICTION;
      current.y += current.velocity.y;

      distance = distanceBetween(this.mousePosition, current);

      if (distance < AOE) {
        distance = distanceBetween(this.mousePosition, current.original);
        this.mouseSpeed.x = this.mouseSpeed.x * 0.98;
        this.mouseSpeed.y = this.mouseSpeed.y * 0.98;

        current.force.y += (MOUSE_PULL * (1 - (distance / AOE))) * this.mouseSpeed.y;
      }

      this.context.quadraticCurveTo(
        previous.x,
        previous.y,
        previous.x + (current.x - previous.x) / 2,
        previous.y + (current.y - previous.y) / 2
      );
    }, this);

    this.context.lineTo(
      _.last(this.particles.waves).x,
      _.last(this.particles.waves).y
    );

    this.context.lineTo(this.canvas.width, this.canvas.height);
    this.context.lineTo(0, this.canvas.height);
    this.context.lineTo(
      _.first(this.particles.waves).x,
      _.first(this.particles.waves).y
    );
    this.context.fill();
  };

  function WaveParticle (x, y) {
    this.x = x;
    this.y = y;
    this.mass = 10;
    this.original = {
      x: this.x,
      y: this.y
    };
    this.velocity = {
      x: 0,
      y: Math.random() * WAVE_VELOCITY
    };
    this.force = {
      x: 0,
      y: 0
    };
  }

  function BubbleParticle (canvasWidth, canvasHeight) {
    this.x = Math.round(Math.random() * canvasWidth);
    this.y = canvasHeight;
    this.size = MIN_BUBBLE_DIAMETER + Math.random() * (MAX_BUBBLE_DIAMETER - MIN_BUBBLE_DIAMETER);
    this.currentSize = this.size;
    this.mass = (this.size / MAX_BUBBLE_DIAMETER) + 1;
    this.velocity = {
      x: (Math.random() * BUBBLE_VELOCITY) - BUBBLE_VELOCITY / 2,
      y: 0
    };
    this.dissolved = false;
    this.dissolveSize = LARGE_BUBBLE_DISSOLVE;
    this.children = [];
  }

  function distanceBetween (a, b) {
    var dx = b.x - a.x,
        dy = b.y - a.y;
    return Math.sqrt(dx*dx + dy*dy);
  }

  $(window).on('load', function () {
    var canvases = [];
    $('.background.wave').each(function () {
      canvases.push(new WaveCanvas($(this)));
    });
  })

}).call(this, jQuery);
