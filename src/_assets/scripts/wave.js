/**
 * Inspired by @hakimel
 * http://hakim.se/experiments/html5/wave/03/
 */
(function ($) {
  'use strict';

      // the number of wave particles
  var WAVE_PARTICLES = 20,

      // the starting velocity of the wave
      WAVE_VELOCITY = 2,

      // the density of the wave
      WAVE_DENSITY = .75,

      // the friction to apply to the wave
      WAVE_FRICTION = 1.14,

      // the mass of a wave particle
      WAVE_MASS = 10,

      // the number of bubble particles
      BUBBLE_PARTICLES = 15,

      // the friction to apply to a bubble particle
      BUBBLE_FRICTION = 1.04,

      // the minimum diameter of a bubble
      MIN_BUBBLE_DIAMETER = 10,

      // the maximum diameter of a bubble
      MAX_BUBBLE_DIAMETER = 30,

      // a large size of a dissolving bubble
      LARGE_BUBBLE_DISSOLVE = 30,

      // a normal size of a dissolving bubble
      NORMAL_BUBBLE_DISSOLVE = 20,

      // a small size of a dissolving bubble
      SMALL_BUBBLE_DISSOLVE = 6,

      // the initial velocity to apply to a bubble
      BUBBLE_VELOCITY = 15,

      // the horizontal velocity to apply to a bubble when dissolving
      DISSOLVED_BUBBLE_HORIZONTAL_VELOCITY = 1.15,

      // the vertical velocity to apply to a bubble when dissolving
      DISSOLVED_BUBBLE_VERTICAL_VELOCITY = 1.05,

      // the horizontal velocity to apply to a child bubble particle
      CHILD_BUBBLE_HORIZONTAL_VELOCITY = 1.1,

      // the vertical velocity to apply to a child bubble particle
      CHILD_BUBBLE_VERTICAL_VELOCITY = 0.4,

      // the velocity to apply to the diameter of a child particle
      CHILD_BUBBLE_SHRINK_VELOCITY = 1.1,

      // the density to apply to particles inside the water
      WATER_DENSITY = 1.07,

      // the density to apply to particles outside the water
      AIR_DENSITY = 1.02,

      // additional hitbox buffer for clicking bubbles
      MOUSE_CLICK_BUFFER = 15,

      // the strength that the mouse pulls wave particles
      MOUSE_PULL = 0.09,

      // the zone the mouse intersects with a wave particle
      AOE = 150,

      // the minimum speed of a mouse movement
      MOUSE_SPEED_THRESHOLD = 6,

      // the force when applying a ripple
      RIPPLE_FORCE = 5,

      // the interval between ripples
      RIPPLE_INTERVAL = 1000,

      // interval between spawning new bubbles
      BUBBLE_INTERVAL = 500,

      //colors
      WAVE_COLOR_START = '#00AABB',
      WAVE_COLOR_END = 'rgba(0, 200, 250, 0)',
      BUBBLE_COLOR = '#rgba(0,200,255,0)';

  function WaveCanvas ($container) {
    var self = this;
    this.animating = false;
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
    $(this.canvas).mousedown(function (e) {
      self.mouseDown(e);
    });

    this.$container.bind('inview', function (e, inView) {
      if (inView) {
        self.resume();
      } else {
        self.pause();
      }
    });
  }

  WaveCanvas.prototype.pause = function () {
    this.animating = false;
    clearInterval(this.rippleInterval);
    clearInterval(this.bubbleInterval);
  };

  WaveCanvas.prototype.resume = function () {
    var self = this;
    if (this.animating) {
      return;
    }
    this.animating = true;
    this.rippleInterval = setInterval(function () {
      self.ripple();
    }, RIPPLE_INTERVAL);
    this.bubbleInterval = setInterval(function () {
      self.addBubble();
    }, BUBBLE_INTERVAL);
    this.render();
  };

  /**
   * Invoke a random ripple
   */
  WaveCanvas.prototype.ripple = function () {
    var waveParticle;
    if (this.mouseSpeed.x > MOUSE_SPEED_THRESHOLD || this.mouseSpeed.y > MOUSE_SPEED_THRESHOLD) {
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
    var dissolvedBubbleParticle,
        dissolveSize;
    // if we exceed the number of bubble particles, blow one up
    if (this.particles.bubbles.length > BUBBLE_PARTICLES) {
      dissolvedBubbleParticle = _.find(this.particles.bubbles, {dissolved: false});
      if (dissolvedBubbleParticle !== _.first(this.particles.bubbles)) {
        dissolveSize = SMALL_BUBBLE_DISSOLVE;
      }
      this.dissolveBubble(dissolvedBubbleParticle, dissolveSize);
    }

    // create a new bubble particle
    this.particles.bubbles.push(new BubbleParticle(this.canvas.width, this.canvas.height));
  };

  /**
   * Dissolve a bubble
   */
  WaveCanvas.prototype.dissolveBubble = function (bubbleParticle, dissolveSize) {
    var self = this;
    if (!bubbleParticle.dissolved) {
      bubbleParticle.dissolved = true;
      if (dissolveSize) {
        bubbleParticle.dissolveSize = dissolveSize;
      }
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
    this.mouseSpeed.x = Math.max(Math.min(e.offsetX - this.mousePosition.x, 40), -40);
    this.mouseSpeed.y = Math.max(Math.min(e.offsetY - this.mousePosition.y, 40), -40);
    this.mousePosition.x = e.offsetX;
    this.mousePosition.y = e.offsetY;
  };

  /**
   * Receive mouse click events to pop a bubble
   */
  WaveCanvas.prototype.mouseDown = function (e) {
    var point = {
          x: e.offsetX,
          y: e.offsetY
        },
        bubbleParticle = this.getBubbleParticleIntersection(point, MOUSE_CLICK_BUFFER);

    if (bubbleParticle) {
      this.dissolveBubble(bubbleParticle, LARGE_BUBBLE_DISSOLVE);
    }
  };

  WaveCanvas.prototype.getBubbleParticleIntersection = function (point, buffer) {
    buffer = buffer || 0;
    return _.find(this.particles.bubbles, function (bubble) {
      return ((bubble.x - bubble.size - buffer) < point.x && point.x < (bubble.x + bubble.size + buffer) &&
          (bubble.y - bubble.size - buffer) < point.y && point.y < (bubble.y + bubble.size + buffer));
    });
  };

  /**
   * The rendering cycle of the canvas
   */
  WaveCanvas.prototype.render = function () {
    var self = this;
    if (!this.animating) {
      return;
    }
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.renderWaveParticles();
    this.renderBubbleParticles();
    requestAnimationFrame(function () {
      self.render();
    });
  };

  /**
   * Render the bubble particles
   */
  WaveCanvas.prototype.renderBubbleParticles = function () {
    this.context.fillStyle = BUBBLE_COLOR;
    this.context.beginPath();
    _.forEach(this.particles.bubbles, function (bubbleParticle) {
      var waveParticle = this.getClosestWaveParticle(bubbleParticle),
          distance = distanceBetween(this.mousePosition, bubbleParticle);

      // the velocity should be factor of water or air depending on if it's above or below the water line
      bubbleParticle.velocity.y /= (bubbleParticle.y > waveParticle.y) ? WATER_DENSITY : AIR_DENSITY;

      if (waveParticle.y > bubbleParticle.y) {
        // if the bubble is below the waterline, it should rise by its density
        bubbleParticle.velocity.y += (1 / bubbleParticle.mass);
      } else {
        // if the bubble is above the waterline, it should fall based on its mass
        bubbleParticle.velocity.y -= ((bubbleParticle.y - waveParticle.y) * 0.01) / bubbleParticle.mass;
      }

      // transition the bubble by vertical velocity
      bubbleParticle.y += bubbleParticle.velocity.y;


      // if the bubble exceeds a boundary of the canvas, reverse its direction
      if (bubbleParticle.x > this.canvas.width - bubbleParticle.currentSize ||
          bubbleParticle.x < bubbleParticle.currentSize) {
        bubbleParticle.velocity.x = -bubbleParticle.velocity.x;
      }

      // apply a slight friction to the bubble
      bubbleParticle.velocity.x /= BUBBLE_FRICTION;

      if (bubbleParticle.velocity.x < 0) {
        // if the bubble is moving to the left, take the negative velocity as a factor of the mass
        bubbleParticle.velocity.x = Math.min(bubbleParticle.velocity.x, -0.8 / bubbleParticle.mass);
      } else {
        // if the bubble is moving to the right, take the positive velocity as a factor of the mass
        bubbleParticle.velocity.x = Math.max(bubbleParticle.velocity.x, 0.8 / bubbleParticle.mass);
      }

      // transition the bubble by the horizontal velocity
      bubbleParticle.x += bubbleParticle.velocity.x;

      if (!bubbleParticle.dissolved) {
        // if the bubble is not dissolved, draw it
        this.context.moveTo(bubbleParticle.x, bubbleParticle.y);
        this.context.arc(bubbleParticle.x, bubbleParticle.y, bubbleParticle.currentSize, 0, Math.PI * 2, true);
      } else {
        // if the bubble is disolved, reduce the velocity for the next render
        bubbleParticle.velocity.x /= DISSOLVED_BUBBLE_HORIZONTAL_VELOCITY;
        bubbleParticle.velocity.y /= DISSOLVED_BUBBLE_VERTICAL_VELOCITY;

        // create the child particles
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
          // transition the child particle
          childParticle.x += childParticle.velocity.x;
          childParticle.y += childParticle.velocity.y;

          // apply the velocity
          childParticle.velocity.x /= CHILD_BUBBLE_HORIZONTAL_VELOCITY;
          childParticle.velocity.y += CHILD_BUBBLE_VERTICAL_VELOCITY;
          childParticle.size /= CHILD_BUBBLE_SHRINK_VELOCITY;

          // draw the child particle
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

  /**
   * Find the closest wave particle for a given point
   * - map the collection into pairs of wave particles and distances from the point
   * - sort the collection by the distance
   * - take the first item
   * - return the wave particle
   */
  WaveCanvas.prototype.getClosestWaveParticle = function (point) {
    return _(this.particles.waves)
      .map(function (waveParticle) {
        return {
          distance: distanceBetween(waveParticle, point),
          waveParticle: waveParticle
        }
      })
      .sortBy('distance')
      .first()
      .waveParticle;
  };

  /**
   * Render the wave
   */
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

      // derive the vertical force to apply for elasticity and to come back to the original point
      forceY += -WAVE_DENSITY * (previous.y - current.y);
      forceY += WAVE_DENSITY * (current.y - next.y);
      forceY += WAVE_DENSITY/15 * (current.y - current.original.y);

      // apply the vertical force and friction
      current.velocity.y += - (forceY / current.mass) + current.force.y;
      current.velocity.y /= WAVE_FRICTION;
      current.force.y /= WAVE_FRICTION;

      // transition the wave node
      current.y += current.velocity.y;

      distance = distanceBetween(this.mousePosition, current);

      // apply any mouse interactions
      if (distance < AOE) {
        distance = distanceBetween(this.mousePosition, current.original);
        this.mouseSpeed.x = this.mouseSpeed.x * 0.98;
        this.mouseSpeed.y = this.mouseSpeed.y * 0.98;

        current.force.y += (MOUSE_PULL * (1 - (distance / AOE))) * this.mouseSpeed.y;
      }

      // draw the curve
      this.context.quadraticCurveTo(
        previous.x,
        previous.y,
        previous.x + (current.x - previous.x) / 2,
        previous.y + (current.y - previous.y) / 2
      );
    }, this);

    // fill the last point
    this.context.lineTo(
      _.last(this.particles.waves).x,
      _.last(this.particles.waves).y
    );

    // fill the body
    this.context.lineTo(this.canvas.width, this.canvas.height);
    this.context.lineTo(0, this.canvas.height);

    // fill the first point
    this.context.lineTo(
      _.first(this.particles.waves).x,
      _.first(this.particles.waves).y
    );
    this.context.fill();
  };

  WaveCanvas.prototype.windowResized = function (width, height) {
    this.canvas.width = this.$container.outerWidth();
    this.canvas.height = this.$container.outerHeight();
    _.forEach(this.particles.waves, function (wave, index) {
      wave.x = this.canvas.width / (WAVE_PARTICLES - 4) * (index - 2);
      wave.original.x = wave.x;
      wave.original.y = this.canvas.height / 2;
    }, this);
  };

  /**
   * A wave particle
   */
  function WaveParticle (x, y) {
    this.mass = WAVE_MASS;
    this.x = x;
    this.y = y;
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

  /**
   * A bubble particle
   */
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
    this.dissolveSize = NORMAL_BUBBLE_DISSOLVE;
    this.children = [];
  }

  /**
   * Find the distance between two points
   */
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

    $(window).resize(function () {
      _.forEach(canvases, function (canvas) {
        canvas.windowResized(window.innerWidth, window.innerHeight);
      });
    });
  });
}).call(this, jQuery);
