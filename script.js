const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 1;
        this.vy = (Math.random() - 0.5) * 1;
        this.radius = Math.random() * 2 + 1;
        this.originalX = this.x;
        this.originalY = this.y;
    }

    update() {
        const dx = this.originalX - this.x;
        const dy = this.originalY - this.y;
        this.x += dx * 0.01;
        this.y += dy * 0.01;

        if (mouse.x !== null && mouse.y !== null) {
            const mouseDistance = Math.hypot(this.x - mouse.x, this.y - mouse.y);
            if (mouseDistance < mouse.radius) {
                const angle = Math.atan2(this.y - mouse.y, this.x - mouse.x);
                const force = (mouse.radius - mouseDistance) / mouse.radius;
                
                this.x += Math.cos(angle) * force * 2;
                this.y += Math.sin(angle) * force * 2;
            }
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        if (mouse.x !== null && mouse.y !== null) {
            const mouseDistance = Math.hypot(this.x - mouse.x, this.y - mouse.y);
            if (mouseDistance < mouse.radius) {
                particles.forEach(particle => {
                    const distance = Math.hypot(this.x - particle.x, this.y - particle.y);
                    if (distance < mouse.radius && distance > 0) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance/mouse.radius})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(this.x, this.y);
                        ctx.lineTo(particle.x, particle.y);
                        ctx.stroke();
                    }
                });
            }
        }
    }
}

const particles = [];
const particleCount = 150;

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

let mouse = {
    x: null,
    y: null,
    radius: 150
};

window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('mouseout', function() {
    mouse.x = null;
    mouse.y = null;
});

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    requestAnimationFrame(animate);
}

animate(); 