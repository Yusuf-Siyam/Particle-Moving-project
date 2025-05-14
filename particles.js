document.addEventListener('DOMContentLoaded', function() {
    const cursorContainer = document.querySelector('.cursor-container');
    let mouseX = 0;
    let mouseY = 0;
    let lastX = 0;
    let lastY = 0;
    
    // INCREASED PARTICLE COUNTS
    const config = {
        particlesPerFrame: 15,      // INCREASED: More particles per frame
        particleCount: 2000,        // INCREASED: Much higher maximum particles
        particleSize: {min: 1, max: 3},  // Size range
        particleLifespan: 5000,     // INCREASED: Particles stay visible longer
        fadeSpeed: 0.005,           // DECREASED: Slower fade for longer trails
        colors: ['#ffffff'],        // White particles
        trail: true,                // Enable trail effect
        gravity: 0.005,             // Reduced gravity for more floating
        randomness: 0.2,            // Random movement factor
        dispersion: 2,              // How much particles disperse
        backgroundParticles: 300    // ADDED: Static background particles
    };
    
    // Store particles
    const particles = [];
    
    // Track mouse position and create particles on movement
    document.addEventListener('mousemove', (e) => {
        lastX = mouseX;
        lastY = mouseY;
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Create particles on mouse movement
        if (config.trail) {
            const distance = Math.sqrt(Math.pow(mouseX - lastX, 2) + Math.pow(mouseY - lastY, 2));
            // INCREASED: More particles for even small movements
            const particlesToCreate = Math.min(Math.ceil(distance / 2) * config.particlesPerFrame, 50);
            
            for (let i = 0; i < particlesToCreate; i++) {
                const ratio = i / particlesToCreate;
                createParticle(
                    lastX + (mouseX - lastX) * ratio,
                    lastY + (mouseY - lastY) * ratio
                );
            }
        }
    });
    
    // Create particles even when mouse is still (pulsing effect)
    setInterval(() => {
        if (mouseX !== 0 && mouseY !== 0) {
            // INCREASED: More particles when still
            for (let i = 0; i < 8; i++) {
                createParticle(
                    mouseX + (Math.random() - 0.5) * 20, 
                    mouseY + (Math.random() - 0.5) * 20
                );
            }
        }
    }, 30); // DECREASED: More frequent particle creation
    
    // ADDED: Create background particles
    function createBackgroundParticles() {
        for (let i = 0; i < config.backgroundParticles; i++) {
            const element = document.createElement('div');
            element.className = 'particle background-particle';
            
            // Random properties
            const size = Math.random() * 2 + 0.5; // Smaller background particles
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            
            // Set element styles
            element.style.width = `${size}px`;
            element.style.height = `${size}px`;
            element.style.backgroundColor = '#ffffff';
            element.style.opacity = Math.random() * 0.5 + 0.1; // Varying opacity
            element.style.transform = `translate(${x}px, ${y}px)`;
            
            // Add to DOM
            cursorContainer.appendChild(element);
            
            // Add subtle animation
            const duration = Math.random() * 30 + 20;
            element.style.animation = `float ${duration}s infinite ease-in-out`;
        }
    }
    
    // Animation loop
    function animate() {
        // Update each particle
        for (let i = particles.length - 1; i >= 0; i--) {
            const particle = particles[i];
            
            // Apply gravity and random movement
            particle.vy += config.gravity;
            particle.vx += (Math.random() - 0.5) * config.randomness;
            particle.vy += (Math.random() - 0.5) * config.randomness;
            
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Apply rotation for some particles
            if (particle.rotation) {
                particle.rotation += particle.rotationSpeed;
                particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px) rotate(${particle.rotation}deg)`;
            } else {
                particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px)`;
            }
            
            // Update opacity based on life
            particle.life -= 16; // Approximately 16ms per frame
            particle.opacity = (particle.life / config.particleLifespan) * particle.initialOpacity;
            particle.element.style.opacity = Math.max(0, particle.opacity);
            
            // Remove dead particles
            if (particle.life <= 0) {
                particle.element.remove();
                particles.splice(i, 1);
            }
        }
        
        // Limit particles if way too many
        while (particles.length > config.particleCount) {
            particles[0].element.remove();
            particles.shift();
        }
        
        requestAnimationFrame(animate);
    }
    
    // Create a new particle
    function createParticle(x, y) {
        const element = document.createElement('div');
        element.className = 'particle';
        
        // Random properties
        const size = Math.random() * (config.particleSize.max - config.particleSize.min) + config.particleSize.min;
        const color = config.colors[Math.floor(Math.random() * config.colors.length)];
        
        // Add some dispersal from cursor position
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * config.dispersion;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        
        // Set element styles
        element.style.width = `${size}px`;
        element.style.height = `${size}px`;
        element.style.backgroundColor = color;
        
        // Add glow effect to some particles
        if (Math.random() > 0.7) {
            element.style.boxShadow = `0 0 ${size * 2}px ${color}`;
        }
        
        // Add to DOM
        cursorContainer.appendChild(element);
        
        // Create particle object
        const initialOpacity = Math.random() * 0.3 + 0.7; // Varying initial opacity
        element.style.opacity = initialOpacity;
        
        const particle = {
            element,
            x,
            y,
            size,
            vx,
            vy,
            life: config.particleLifespan,
            initialOpacity,
            opacity: initialOpacity
        };
        
        // Add rotation to some particles
        if (Math.random() > 0.8) {
            particle.rotation = Math.random() * 360;
            particle.rotationSpeed = (Math.random() - 0.5) * 3;
        }
        
        particles.push(particle);
    }
    
    // ADDED: Particle explosion function
    function createParticleExplosion(x, y, count = 50) {
        for (let i = 0; i < count; i++) {
            const element = document.createElement('div');
            element.className = 'particle explosion-particle';
            
            // Random properties
            const size = Math.random() * 2 + 1;
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5 + 2;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            
            // Set element styles
            element.style.width = `${size}px`;
            element.style.height = `${size}px`;
            element.style.backgroundColor = '#ffffff';
            
            // Add to DOM
            cursorContainer.appendChild(element);
            
            // Create particle object
            const particle = {
                element,
                x,
                y,
                size,
                vx,
                vy,
                life: Math.random() * 1000 + 500,
                initialOpacity: 1,
                opacity: 1
            };
            
            particles.push(particle);
        }
    }
    
    // Add click effect
    document.addEventListener('click', (e) => {
        createParticleExplosion(e.clientX, e.clientY, 100);
    });
    
    // ADDED: Create initial background particles
    createBackgroundParticles();
    
    // Start animation
    animate();
    
    // Add keyframe animation for background particles
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes float {
            0% { transform: translate(var(--x), var(--y)); }
            50% { transform: translate(calc(var(--x) + 10px), calc(var(--y) - 10px)); }
            100% { transform: translate(var(--x), var(--y)); }
        }
        
        .background-particle {
            position: absolute;
            background-color: #ffffff;
            border-radius: 50%;
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);
    
    // Update background particles with custom properties
    const bgParticles = document.querySelectorAll('.background-particle');
    bgParticles.forEach(particle => {
        const rect = particle.getBoundingClientRect();
        particle.style.setProperty('--x', `${rect.left}px`);
        particle.style.setProperty('--y', `${rect.top}px`);
    });
});