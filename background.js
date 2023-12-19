(function () {
    'use strict';

    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var width, height, numShapes, smallerThan, mouseDistance, distance;
    var shapes = [];
    var isWide, lineWidth, mouseX = null, mouseY = null;
    var easeFactor = 0.3;
    var friction = 0.9;

    function initialize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        isWide = width > height;
        distance = isWide ? 100 : 10;
        smallerThan = Math.sqrt(distance * distance + distance * distance);
        mouseDistance = isWide ? 140 : 100;
        numShapes = isWide ? Math.floor(width / distance) : Math.floor(height / distance);

        if (width < 768) {
            lineWidth = 2;
            distance = 40;
            smallerThan = Math.sqrt(distance * distance + distance * distance);
            mouseDistance = 50;
            numShapes = isWide ? Math.floor(width / distance) : Math.floor(height / distance);
        } else {
            lineWidth = 5;
        }
    }

    function requestAnimationFrame(cb) {
        window.requestAnimationFrame =
            window.requestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (cb) {
                setTimeout(cb, 17);
            };

        window.requestAnimationFrame(cb);
    }

    function Shape(x, y, i, j) {
        this.x = x;
        this.y = y;
        this.xi = x;
        this.yi = y;
        this.i = i;
        this.r = 1;
        this.v = { x: 0, y: 0 };
        this.color = randomNum(0, 360);
    }

    Shape.prototype.draw = function () {
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

    Shape.prototype.drawLines = function () {
        for (var i = 0; i < shapes.length; i++) {
            if (this.i !== shapes[i].i || this.j !== shapes[i].j) {
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

    Shape.prototype.initialize = function () {
        this.drawLines();
        if (mouseX !== null) this.mouseDistance();
        this.draw();
    };

    function render() {
        context.clearRect(0, 0, width, height);
        for (var i = 0; i < shapes.length; i++) {
            shapes[i].initialize();
        }
        requestAnimationFrame(render);
    }

    function onResize() {
        initialize();
        shapes = [];
        for (var i = 0; i < numShapes + 1; i++) {
            for (var j = 0; j < numShapes + 1; j++) {
                if (j * distance - distance > height) break;
                var shape = new Shape(i * distance, j * distance, i, j);
                shapes.push(shape);
            }
        }
    }

    window.addEventListener('resize', onResize);
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

    initialize();
    for (var i = 0; i < numShapes + 1; i++) {
        for (var j = 0; j < numShapes + 1; j++) {
            if (j * distance - distance > height) break;
            var shape = new Shape(i * distance, j * distance, i, j);
            shapes.push(shape);
        }
    }

    render();
})();
