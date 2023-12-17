(function () {
    'use strict';

    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var width = canvas.width = window.innerWidth;
    var height = canvas.height = window.innerHeight;
    var mouseX = null;
    var mouseY = null;
    var distance = 80;
    var smallerThan = Math.sqrt(distance * distance + distance * distance);
    var mouseDistance = 150;
    var numShapes;
    var shapes = [];
    var easeFactor = 0.3;
    var friction = 0.9;
    var lineWidth = 5;
    var isWide = width > height;
    numShapes = isWide ? width / distance : height / distance;

    if (width < 768) {
        lineWidth = 2;
        distance = 40;
        smallerThan = Math.sqrt(distance * distance + distance * distance);
        mouseDistance = 50;
        numShapes = isWide ? width / distance : height / distance;
    }

    window.requestAnimationFrame =
        window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (cb) {
            setTimeout(cb, 17);
        };

    function Shape(context, x, y, i) {
        this.context = context;
        this.initialize(x, y, i);
    }

    Shape.prototype.initialize = function (x, y, i) {
        this.x = x;
        this.y = y;
        this.xi = x;
        this.yi = y;
        this.i = i;
        this.r = 1;
        this.v = {
            x: 0,
            y: 0
        };
        this.color = randomNum(0, 360);
    };

    Shape.prototype.draw = function () {
        var context = this.context;
        context.save();
        context.fillStyle = 'hsl(' + this.color + ', ' + '80%, 60%)';
        context.beginPath();
        context.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
        context.fill();
        context.restore();
    };

    Shape.prototype.mouseDistance = function () {
        var x = mouseX - this.x;
        var y = mouseY - this.y;
        var d = x * x + y * y;
        var distance = Math.sqrt(d);
        if (distance < mouseDistance) {
            this.v.x = +this.v.x;
            this.v.y = +this.v.y;
            var collisionAngle = Math.atan2(mouseY - this.y, mouseX - this.x);
            this.v.x = -Math.cos(collisionAngle) * 5;
            this.v.y = -Math.sin(collisionAngle) * 5;
            this.x += this.v.x;
            this.y += this.v.y;
        } else if (distance > mouseDistance && distance < mouseDistance + 10) {
            this.v.x = 0;
            this.v.y = 0;
        } else {
            this.v.x += (this.xi - this.x) * easeFactor;
            this.v.y += (this.yi - this.y) * easeFactor;
            this.v.x *= friction;
            this.v.y *= friction;
            this.x += this.v.x;
            this.y += this.v.y;
        }
    };

    Shape.prototype.drawLines = function (i) {
        var j = i;
        for (var i = 0; i < shapes.length; i++) {
            if (j !== i) {
                var x = this.x - shapes[i].x;
                var y = this.y - shapes[i].y;
                var d = x * x + y * y;
                var distance = Math.floor(Math.sqrt(d));
                if (distance <= smallerThan) {
                    context.save();
                    context.lineWidth = lineWidth;
                    context.strokeStyle = 'hsl(' + this.color + ', ' + '80%, 60%)';
                    context.beginPath();
                    context.moveTo(this.x, this.y);
                    context.lineTo(shapes[i].x, shapes[i].y);
                    context.stroke();
                    context.restore();
                }
            }
        }
    };

    Shape.prototype.render = function (i) {
        this.drawLines(i);
        if (mouseX !== null) this.mouseDistance();
        this.draw();
    };

    for (var i = 0; i < numShapes + 1; i++) {
        for (var j = 0; j < numShapes + 1; j++) {
            if (j * distance - distance > height) break;
            var shape = new Shape(context, i * distance, j * distance, i, j);
            shapes.push(shape);
        }
    }

    function render() {
        context.clearRect(0, 0, width, height);
        for (var i = 0; i < shapes.length; i++) {
            shapes[i].render(i);
        }
        requestAnimationFrame(render);
    }

    render();

    function onResize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        shapes = [];
        if (width < 768) {
            lineWidth = 2;
            distance = 40;
            smallerThan = Math.sqrt(distance * distance + distance * distance);
            mouseDistance = 50;
            numShapes = isWide ? width / distance : height / distance;
        } else {
            lineWidth = 5;
            distance = 80;
            smallerThan = Math.sqrt(distance * distance + distance * distance);
            mouseDistance = 150;
            numShapes = isWide ? width / distance : height / distance;
        }
        for (var i = 0; i < numShapes + 1; i++) {
            for (var j = 0; j < numShapes + 1; j++) {
                if (j * distance - distance > height) break;
                var shape = new Shape(context, i * distance, j * distance, i, j);
                shapes.push(shape);
            }
        }
    }

    window.addEventListener('resize', function () {
        onResize();
    });

    window.addEventListener('mousemove', function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }, false);

    canvas.addEventListener('touchmove', function (e) {
        var touch = e.targetTouches[0];
        mouseX = touch.pageX;
        mouseY = touch.pageY;
    });

    function randomNum(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
})();
