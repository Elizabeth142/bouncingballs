var canvas = document.querySelector('canvas');


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
 
canvas.style.backgroundColor = 'Black';

var ctx = canvas.getContext('2d');


var colorArray = [
  '#8B4513', '#A0522D', '#CD853F', '#DEB887', '#D2691E', '#556B2F', '#6B8E23', '#228B22', '#2E8B57', '#008080',
  '#4682B4', '#4169E1', '#191970', '#483D8B', '#5F9EA0', '#B22222', '#800000', '#A52A2A', '#808000', '#3CB371'
];



function Circle(x, y, radius, dx, dy, color, isStatic = false) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.dx = dx;
    this.dy = dy;
    this.color = color || colorArray[Math.floor(Math.random() * colorArray.length)];
    this.isStatic = isStatic;

    this.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.lineWidth = 4;
        if (!isStatic) {
            ctx.fillStyle = this.color;
            ctx.fill();
        } else {
            ctx.strokeStyle = this.color;
            ctx.stroke();
        }
    };

    this.update = function () {
        if (!this.isStatic) {
            if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
                this.dx = -this.dx;
            }
            this.x += this.dx;

            if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
                this.dy = -this.dy;
            }
            this.y += this.dy;
        }

        this.draw();
    };

    this.setPosition = function (x, y) {
        this.x = x;
        this.y = y;
    };

    this.isCollidingWith = function (otherCircle) {
        var dx = this.x - otherCircle.x;
        var dy = this.y - otherCircle.y;
        var distSquared = dx * dx + dy * dy;
        var radiusSumSquared = (this.radius + otherCircle.radius) ** 2;
        return distSquared < radiusSumSquared;
    };
}

var circleArray = [];
var disappearedCirclesCount = 0;
for (let index = 0; index < 25; index++) {
    let radius = 15;
    var x = Math.random() * (innerWidth - radius * 2) + radius;
    var y = Math.random() * (innerHeight - radius * 2) + radius;
    var dx = (Math.random() - 0.5) * 10;
    var dy = (Math.random() - 0.5) * 10;
    circleArray.push(new Circle(x, y, radius, dx, dy));
}
let whiteRadius = 15;
var whiteX = Math.random() * (innerWidth - whiteRadius * 2) + whiteRadius;
var whiteY = Math.random() * (innerHeight - whiteRadius * 2) + whiteRadius;
var whiteCircle = new Circle(whiteX, whiteY, whiteRadius, 0, 0, 'white', true);
circleArray.push(whiteCircle);

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Ball Count: ${25-disappearedCirclesCount}`, innerWidth - 250, 90);

    circleArray = circleArray.filter(circle => {
        if (circle !== whiteCircle && whiteCircle.isCollidingWith(circle)) {
            disappearedCirclesCount++;
            return false;
        }
        circle.update();
        return true;
    });
}

animate();

canvas.addEventListener('mousemove', function (event) {
    var rect = canvas.getBoundingClientRect();
    var mouseX = event.clientX - rect.left;
    var mouseY = event.clientY - rect.top;
    whiteCircle.setPosition(mouseX, mouseY);
});


canvas.addEventListener('touchmove', function (event) {
    var touch = event.touches[0];
    var rect = canvas.getBoundingClientRect();
    var touchX = touch.clientX - rect.left;
    var touchY = touch.clientY - rect.top;
    whiteCircle.setPosition(touchX, touchY);
});