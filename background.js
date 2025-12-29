// Particle animation for background
$(document).ready(function() {
    createParticleBackground();
    
    function createParticleBackground() {
        const particleContainer = $('.particle-background');
        
        // Create particles
        const particleCount = 80;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = $('<div class="particle"></div>');
            
            // Random position
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            
            // Random size
            const size = 1 + Math.random() * 2;
            
            // Random animation
            const duration = 15 + Math.random() * 20;
            const delay = Math.random() * 10;
            
            // Classic colors: white, light blue, navy blue
            const colors = ['#ffffff', '#b0c4de', '#2a5c8f'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            particle.css({
                position: 'absolute',
                left: posX + '%',
                top: posY + '%',
                width: size + 'px',
                height: size + 'px',
                'background-color': color,
                'border-radius': '50%',
                'pointer-events': 'none',
                'opacity': 0.2 + Math.random() * 0.2, // Reduced opacity for subtlety
                'animation': `float ${duration}s ease-in-out ${delay}s infinite alternate`
            });
            
            particleContainer.append(particle);
        }
        
        // Add CSS for float animation
        if (!$('#float-animation').length) {
            $('head').append(`
                <style id="float-animation">
                @keyframes float {
                    0% {
                        transform: translate(0, 0) scale(1);
                        opacity: 0.2;
                    }
                    50% {
                        transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px) scale(1.1);
                        opacity: 0.4;
                    }
                    100% {
                        transform: translate(${Math.random() * 30 - 15}px, ${Math.random() * 30 - 15}px) scale(1);
                        opacity: 0.2;
                    }
                }
                </style>
            `);
        }
    }
});