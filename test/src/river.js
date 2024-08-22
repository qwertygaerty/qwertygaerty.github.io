document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('riverCanvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    let lastTime = 0;
    const waves = [];
    const maxWaves = 5;
    const waveFrequency = 1;

    function initializeWaves() {
        for (let i = 0; i < maxWaves; i++) {
            waves.push({
                x: Math.random() * canvas.width,
                y: canvas.height * Math.random() / 2,
                amplitude: Math.random() * 30 + 20,
                wavelength: Math.random() * 100 + 50,
                speed: Math.random() * 5
            });
        }
    }

    function drawWave(wave, timeDiff) {
        ctx.beginPath();
        ctx.moveTo(0, wave.y);
        for (let x = 0; x < canvas.width; x++) {
            const y = wave.amplitude * Math.sin(x / wave.wavelength + wave.speed * timeDiff) + wave.y;
            ctx.lineTo(x, y);
        }
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fillStyle = `rgba(2, 2, 2, ${0.9 / maxWaves})`; // Semi-transparent blue
        ctx.fill();
    }

    function animate(timestamp) {
        const timeDiff = (timestamp - lastTime) / 1000; // time diff in seconds
        lastTime = timestamp;

        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

        waves.forEach(wave => {
            wave.x += timeDiff * waveFrequency * wave.speed * 100; // Update wave position
            drawWave(wave, timestamp / 1000);
        });

        requestAnimationFrame(animate);
    }

    initializeWaves();
    requestAnimationFrame(animate);
});