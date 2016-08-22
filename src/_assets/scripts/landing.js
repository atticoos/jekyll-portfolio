(function ($) {

  var MAX_DIAMETER = 30;
  var VELOCITY = 0.8;
  var DOT_COUNT = 30;
  var COLOR = '#e0e6ed';

  function Canvas ($container) {
    this.$container = $container;
    this.canvas = document.createElement('canvas');
    this.canvas.width = $container.outerWidth();
    this.canvas.height = $container.outerHeight();
    this.context = this.canvas.getContext('2d');
    this.dots = _.times(DOT_COUNT, function () {
      return new Dot(
        Math.round(Math.random() * this.canvas.width),
        Math.round(Math.random() * this.canvas.height)
      );
    }.bind(this));
    this.arc = new Arc(this.dots[0], this.dots[1]);
    this.$container.prepend(this.canvas);
    this.animating = false;
    this.lastArc = Date.now();
    this.render = this.render.bind(this);
  }

  Canvas.prototype.drawArc = function () {
    var coordinates = this.arc.getCoordinates();
    var dTheta = (coordinates.polar.bTheta - coordinates.polar.aTheta) / 100;

    this.context.beginPath();
    this.context.strokeStyle = COLOR;
    this.context.lineWidth = 4;

    if (this.arc.toProgress < 100) {
      // Animate line filling in
      var d = dTheta * this.arc.toProgress;
      this.arc.toProgress += 2;
      this.context.arc(
        coordinates.cartesianCenter.x,
        coordinates.cartesianCenter.y,
        coordinates.polar.radius,
        coordinates.polar.aTheta,
        coordinates.polar.aTheta - d
      );
    } else if (this.arc.fromProgress < 100) {
      // Animate line leaving
      var d = dTheta * this.arc.fromProgress;
      this.arc.fromProgress += 2;
      this.context.arc(
        coordinates.cartesianCenter.x,
        coordinates.cartesianCenter.y,
        coordinates.polar.radius,
        coordinates.polar.aTheta - d,
        coordinates.polar.bTheta
      );
    }
    this.context.stroke();
  };

  Canvas.prototype.drawDot = function (dot, time) {
    this.context.fillStyle = dot.color;
    this.context.beginPath();
    this.context.arc(dot.x, dot.y, dot.d, 0, Math.PI * 2, false);
    this.context.fill();
  };

  Canvas.prototype.isDotOutOfBounds = function (dot) {
    return dot.x > (this.canvas.width + dot.d / 2) ||
      dot.x < (-dot.d / 2) ||
      dot.y > (this.canvas.height + (dot.d / 2)) ||
      dot.y < -(dot.d / 2);
  }

  Canvas.prototype.start = function () {
    this.animating = true;
    this.time = Date.now();
    this.render();
  };

  Canvas.prototype.stop = function () {
    this.animating = false;
  }

  Canvas.prototype.render = function (time) {
    if (!this.animating) {
      return;
    }
    time = this.time + time;
    // console.log(time, Date.n/ow());

    // Clear the frame for the new render
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update the position of each dot and render them
    _.forEach(this.dots, function (dot, i) {
      dot.updatePosition(time);
      this.drawDot(dot, time);

      // If a dot falls off the screen, trash it and create a new dot
      if (this.isDotOutOfBounds(dot)) {
        this.dots[i] = new Dot(
          Math.round(Math.random() * this.canvas.width),
          Math.round(Math.random() * this.canvas.height)
        );
      }
    }.bind(this));

    if (!this.arc.isComplete()) {
      // Draw an arc between two dots
      this.drawArc();
    } else if (time - this.lastArc > 1000 * 3) {
      // After the last arc expires, create a new arc.
      var dots = _.shuffle(this.dots);
      var nextArc;
      for (var i = 0; i < dots.length - 1; i++) {
        for (var j = i + 1; j < dots.length; j++) {
          if (nextArc) break;

          var dX = Math.abs(dots[j].x - dots[i].x);
          var dY = Math.abs(dots[j].y - dots[i].y);
          if (dX <= 350 && dY <= 350 && dX >= 80 && dY >= 80) {
            nextArc = new Arc(dots[i], dots[j]);
          }
        }
      }
      this.arc = nextArc;
      this.lastArc = time;
    }

    requestAnimationFrame(this.render);
  }

  function generateRandomVelocity (maxVelocity) {
    var direction = Math.random() < 0.5 ? 1 : -1;
    var lowerBound = 0.2;
    var velocity = direction * Math.random() * maxVelocity;

    if (direction > 0) {
      return Math.max(direction * lowerBound, velocity);
    } else {
      return Math.min(direction * lowerBound, velocity);
    }

    return Math.max(0.2, (Math.random() < 0.5 ? 1 : -1) * Math.random() * velocity);
  }

  function Arc (a, b) {
    this.a = a;
    this.b = b;
    this.toProgress = 0;
    this.fromProgress = 0;
  }

  Arc.prototype.isComplete = function () {
    return this.toProgress >= 100 && this.fromProgress >= 100;
  };

  Arc.prototype.getCoordinates = function () {
    // Center between two points
    var cX = (this.a.x + this.b.x) / 2;
    var cY = (this.a.y + this.b.y) / 2;

    // Distance between two points
    var dX = this.b.x - this.a.x;
    var dY = this.b.y - this.a.y;

    // Arc radius
    var r = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2)) / 2;

    // Cartesian to polar points.
    // Also construct a relative point system based on the center of the polar region.
    var aTheta = Math.PI + Math.atan((this.a.y - cY) / (this.a.x - cX));
    var bTheta = Math.atan((this.b.y - cY) / (this.b.x - cX));

    return {
      cartesianCenter: {
        x: cX,
        y: cY
      },
      polar: {
        radius: r,
        aTheta: aTheta,
        bTheta: bTheta
      }
    };
  };

  function Dot (x, y) {
    this.x = x;
    this.y = y;
    this.originalX = x;
    this.d = Math.max(5, Math.random() * MAX_DIAMETER);
    this.dy = generateRandomVelocity(VELOCITY);
    this.color = COLOR;
    this.speed = 1000 + Math.random() * 1000;
    this.wander = Math.random() * 100;
  }

  Dot.prototype.updatePosition = function (timestamp) {
    this.x = this.wander * Math.sin(timestamp / this.speed) + this.originalX;
    // this.x += this.dx;
    this.y += this.dy;
  };

  function buildCanvas (element) {
    element.height($(window).innerHeight());
    var canvas = new Canvas(element);
    canvas.start();
  }

  $(document).ready(function () {
    $('section.landing').each(function () {
      buildCanvas($(this));
    });
  });
})(jQuery);
