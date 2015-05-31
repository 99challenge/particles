window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(loop) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

var main = (function () {
    var canvas, ctx;
    var particles = [];
    var radius = 100;
    var cx, cy;

    function Particle(o) {
        this.x = o.x;
        this.y = o.y;
        this.r = o.r;
        this.colour = o.colour;

        this.draw = function () {
            circle(this.x, this.y, this.r, this.colour);
        };

        this.update = function () {

        };
    }

    var circle = function (x, y, r, colour) {
        ctx.beginPath();
        ctx.fillStyle = colour;
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.fill();
    };

    var insideCircle = function (x0, y0, x1, y1, r) {
        return Math.sqrt((x1-x0)*(x1-x0) + (y1-y0)*(y1-y0)) < r;
    };

    var draw = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (var i = 0, l = particles.length; i < l; i++) {
            particles[i].draw();
        }
    };

    var update = function () {

        for (var i = 0, l = particles.length; i < l; i++) {
            var particle = particles[i];

            if (insideCircle(cx, cy, particle.x, particle.y, radius)) {
                if (particle.r < radius - Math.sqrt((particle.x-cx)*(particle.x-cx) + (particle.y-cy)*(particle.y-cy))) {
                    particle.r++;
                }
            }
            else if (particle.r > 5) {
                // Decrease radius
                particle.r--;
            }
        }

    };

    var loop = function _loop () {
        window.requestAnimationFrame(_loop);

        update();
        draw();
    };

    var init = function () {

        canvas = document.getElementById('world');
        ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Place particles
        var xs = Math.round(canvas.width / 50);
        var ys = Math.round(canvas.height / 50);

        for (var y = 0; y < ys; y++) {
            for (var x = 0; x < xs; x++) {
                particles.push(new Particle({
                    'x': 20 + x * 50,
                    'y': 20 + y * 50,
                    'r': 5,
                    'colour': 'rgba(255, 255, 255, 0.5)'
                }));
            }
        }

        window.addEventListener('mousemove', function (e) {
            cx = e.clientX;
            cy = e.clientY;
        });

        window.addEventListener('touchmove', function (e) {

        });

        window.addEventListener('resize', function() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }, false);

        loop();
    };

    return {
        'init': init
    }

})();

window.onload = main.init;