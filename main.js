window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
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
    }

    // Create a circle
    var circle = function (x, y, r, colour) {
        ctx.beginPath();
        ctx.fillStyle = colour;
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.fill();
    };

    // Check if a point is inside a circumference
    var insideCircle = function (x0, y0, x1, y1, r) {
        return r - Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0)); // < r
    };

    // Draw circles
    var draw = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (var i = 0, l = particles.length; i < l; i++) {
            particles[i].draw();
        }
    };

    // Update logic
    var update = function () {

        for (var i = 0, l = particles.length; i < l; i++) {
            var particle = particles[i];
            var diff = insideCircle(cx, cy, particle.x, particle.y, radius);

            if (diff > 0) {
                if (particle.r < diff) {
                    particle.r++;
                }
            }
            else if (particle.r > 5) {
                // Decrease radius
                particle.r--;
            }
        }

    };

    // Main loop
    var loop = function _loop () {
        window.requestAnimationFrame(_loop);

        update();
        draw();
    };

    // Initialisation
    var init = function () {

        canvas = document.getElementById('world');
        ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Place particles
        var xs = Math.round(canvas.width / 50),
            ys = Math.round(canvas.height / 50);

        for (var y = 0; y < ys; y++) {
            for (var x = 0; x < xs; x++) {
                particles.push(new Particle({
                    'x': 20 + x * 50,
                    'y': 20 + y * 50,
                    'r': 5,
                    'colour': 'rgba(255, 255, 255, 0.7)'
                }));
            }
        }

        // Event listeners
        window.addEventListener('mousemove', function (e) {
            cx = e.clientX;
            cy = e.clientY;
        });

        window.addEventListener('touchmove', function (e) {
            cx = e.clientX;
            cy = e.clientY;
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