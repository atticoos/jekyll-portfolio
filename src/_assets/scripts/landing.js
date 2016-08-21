(function ($) {

  var MAX_DIAMETER = 30;
  var VELOCITY = 0.8;
  var DOT_COUNT = 30;
  var COLOR = '#eaf0f8';

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
  }

  Canvas.prototype.drawArc = function () {
    var arcX = (this.arc.a.x + this.arc.b.x) / 2;
    var arcY = (this.arc.a.y + this.arc.b.y) / 2;


    var arcR = Math.sqrt(
      Math.pow(Math.abs(this.arc.b.x - this.arc.a.x), 2) +
      Math.pow(Math.abs(this.arc.b.y - this.arc.a.y), 2)
    );

    // this.context.beginPath();
    // this.context.fillStyle = 'green';
    // this.context.arc(arcX, arcY, 10, 0, Math.PI * 2, false);
    // this.context.fill();


    // Center between two points
    var cX = (this.arc.a.x + this.arc.b.x) / 2;
    var cY = (this.arc.a.y + this.arc.b.y) / 2;

    // Distance between points
    var dX = this.arc.b.x - this.arc.a.x;
    var dY = this.arc.b.y - this.arc.a.y;

    var r = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2)) / 2;

    // Cartesian to polar point
    var aTheta = Math.PI + Math.atan((this.arc.a.y - cY) / (this.arc.a.x - cX));
    var bTheta = Math.atan((this.arc.b.y - cY) / (this.arc.b.x - cX));

    // Theta delta
    var dTheta = bTheta - aTheta;
    var thetaStep = dTheta / 100;

    this.context.beginPath();
    this.context.strokeStyle = COLOR;
    this.context.lineWidth = 4;
    if (this.arc.toProgress < 100) {
      var d = thetaStep * this.arc.toProgress;
      this.arc.toProgress += 2;
      this.context.arc(cX, cY, r, aTheta, aTheta - d);
    } else if (this.arc.fromProgress < 100) {
      var d = thetaStep * this.arc.fromProgress;
      this.arc.fromProgress += 2;
      this.context.arc(cX, cY, r, aTheta - d, bTheta);
    }
    this.context.stroke();
  };

  Canvas.prototype.drawDot = function (dot, time) {
    dot.updatePosition(time);
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
    this.render();
  };

  Canvas.prototype.stop = function () {
    this.animating = false;
  }

  Canvas.prototype.render = function () {
    var time = Date.now();
    if (!this.animating) {
      return;
    }

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    _.forEach(this.dots, function (dot, i) {
      this.drawDot(dot, time);
      if (this.isDotOutOfBounds(dot)) {
        this.dots[i] = new Dot(
          Math.round(Math.random() * this.canvas.width),
          Math.round(Math.random() * this.canvas.height)
        );
      }
    }.bind(this));

    this.drawArc();


    if (this.arc.isComplete() && time - this.lastArc > 1000 * 3) {

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

      var a = Math.floor(this.dots.length * Math.random());
      var b = Math.floor(this.dots.length * Math.random());
      this.arc.a.color = COLOR;
      this.arc.b.color = COLOR;

      this.arc = nextArc;
      this.lastArc = time;
    }

    requestAnimationFrame(function () {
      this.render();
    }.bind(this));
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

    // a.color = 'blue';
    // b.color = 'red';

    this.toProgress = 0;
    this.fromProgress = 0;

    this.x = a.x;
    this.y = a.y;
  }

  Arc.prototype.isComplete = function () {
    return this.toProgress >= 100 && this.fromProgress >= 100;
  }




  function Dot (x, y) {
    this.x = x;
    this.y = y;
    this.originalX = x;
    this.d = Math.max(5, Math.random() * MAX_DIAMETER);
    this.dx = generateRandomVelocity(VELOCITY);
    this.dy = generateRandomVelocity(VELOCITY);
    this.color = COLOR;
    this.speed = 1000 + Math.random() * 1000;
    this.wander = Math.random() * 100;
  }

  Dot.prototype.updatePosition = function (timestamp) {
    this.x = this.wander * Math.sin(timestamp / this.speed) + this.originalX;
    this.x += this.dx;
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
