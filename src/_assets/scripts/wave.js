// http://hakim.se/experiments/html5/wave/03/js/hakim.wave.js
(function ($) {
  'use strict';

  var WAVE_PARTICLES = 20,
      WAVE_VELOCITY = 20,
      WAVE_DENSITY = .75,
      WAVE_FRICTION = 1.14,
      MIN_BUBBLE_DIAMETER = 10,
      MAX_BUBBLE_DIAMETER = 30,
      BUBBLE_VELOCITY = 30,
      WATER_DENSITY = 1.07,
      AIR_DENSITY = 1.02,
      MOUSE_PULL = 0.09,
      AOE = 100;


  function WaveCanvas ($container) {
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
    console.log('particles', this.particles.waves);
    // this.render();



    var self = this;
    $(this.canvas).mousemove(function (e) {
      self.mouseMove(e);
    });
    this.timeUpdateInterval = setInterval(function () {
      self.render()
    }, 40);
    this.twitchInterval = setInterval(function () {
      self.twitch();
    }, 2000);
  }

  WaveCanvas.prototype.twitch = function () {
    var forceRange = 5;
    var particle = _.sample(this.particles.waves),
        forceY = (Math.random() * (forceRange * 2) - forceRange);
    // console.log('twitching from', particle.force.y, 'to', forceY);
    particle.force.y += forceY;
  };

  WaveCanvas.prototype.mouseMove = function (e) {
    var x = e.layerX || e.offsetX,
        y = e.layerY || e.offsetY;
    this.mouseSpeed.x = Math.max(Math.min(e.offsetX - this.mousePosition.x, 40), -40);
    this.mouseSpeed.y = Math.max(Math.min(e.offsetY - this.mousePosition.y, 40), -40);
    this.mousePosition.x = e.offsetX;
    this.mousePosition.y = e.offsetY;
  };

  WaveCanvas.prototype.render = function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.renderWaveParticles();
    var self = this;
    // requestAnimationFrame(function () {
    //   self.render();
    // });
  };

  WaveCanvas.prototype.renderWaveParticles = function () {
    var gradientFill = this.context.createLinearGradient(
      this.canvas.width * 0.5,
      this.canvas.height * 0.2,
      this.canvas.width * 0.5,
      this.canvas.height
    );
    gradientFill.addColorStop(0, '#00AABB');
    gradientFill.addColorStop(1, 'rgba(0, 200, 250, 0)');

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
      y: Math.random() * 3
    };
    this.force = {
      x: 0,
      y: 0
    };
  }

  function Bubble (canvasWidth, canvasHeight) {
    this.x = Math.round(Math.random() * canvasWidth);
    this.y = canvasHeight;
    this.d = MIN_BUBBLE_DIAMETER + Math.random() * (MAX_BUBBLE_DIAMETER - MIN_BUBBLE_DIAMETER);
    this.dx = (Math.random() * BUBBLE_VELOCITY) - BUBBLE_VELOCITY / 2;
    this.dy = 0;
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
