document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('planetCanvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const sun = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 50,
        color: 'yellow'
    };

    // Creating an array of planets with varying attributes
    const planets = [];
    for (let i = 0; i < 30; i++) {
        planets.push({
            radius: (Math.random() * 10), // Increasing size with index
            distance: 100 + i * (Math.random() * 20), // Increasing distance from sun
            angle: Math.random() * Math.PI * (Math.random() * 20), // Random start angle
            speed: 0.01 + i * (Math.random()*0.002), // Increasing speed with index
            color: `hsl(${Math.random() * 360}, 100%, 50%)` // Random color
        });
    }

    function drawSun() {
        ctx.beginPath();
        ctx.arc(sun.x, sun.y, sun.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = sun.color;
        ctx.fill();
    }

    function drawPlanets() {
        planets.forEach(planet => {
            const x = sun.x + planet.distance * Math.cos(planet.angle);
            const y = sun.y + planet.distance * Math.sin(planet.angle);
            ctx.beginPath();
            ctx.arc(x, y, planet.radius, 0, Math.PI * 2);
            ctx.fillStyle = planet.color;
            ctx.fill();
            planet.angle += planet.speed; // Update the angle for next frame
        });
    }

    function animate() {
        ctx.fillStyle = 'black'; // Set the background color to black
        ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill canvas with black
        drawSun();
        drawPlanets();
        requestAnimationFrame(animate);
    }

    animate();
});