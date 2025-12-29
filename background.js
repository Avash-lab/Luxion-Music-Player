$(document).ready(function() {
    createParticleBackground();
    
    function createParticleBackground() {
        const particleContainer = $('.particle-background');
        
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const particleCount = isMobile ? 30 : 80; 
        
        particleContainer.empty(); 
        
        for (let i = 0; i < particleCount; i++) {
            const particle = $('<div class="particle"></div>');
            
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            
            const size = isMobile ? (0.5 + Math.random() * 1.5) : (1 + Math.random() * 2);
            
            const duration = isMobile ? (20 + Math.random() * 25) : (15 + Math.random() * 20);
            const delay = Math.random() * 10;
            
            const colors = ['#ffffff', '#b0c4de', '#2a5c8f'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            const opacity = isMobile ? (0.1 + Math.random() * 0.15) : (0.2 + Math.random() * 0.2);
            
            particle.css({
                position: 'absolute',
                left: posX + '%',
                top: posY + '%',
                width: size + 'px',
                height: size + 'px',
                'background-color': color,
                'border-radius': '50%',
                'pointer-events': 'none',
                'opacity': opacity,
                'animation': `float ${duration}s ease-in-out ${delay}s infinite alternate`,
                'will-change': 'transform, opacity' 
            });
            
            particleContainer.append(particle);
        }
        
        if (!$('#float-animation').length) {
            $('head').append(`
                <style id="float-animation">
                @keyframes float {
                    0% {
                        transform: translate(0, 0) scale(1);
                        opacity: ${isMobile ? '0.1' : '0.2'};
                    }
                    50% {
                        transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px) scale(1.1);
                        opacity: ${isMobile ? '0.25' : '0.4'};
                    }
                    100% {
                        transform: translate(${Math.random() * 30 - 15}px, ${Math.random() * 30 - 15}px) scale(1);
                        opacity: ${isMobile ? '0.1' : '0.2'};
                    }
                }
                </style>
            `);
        }
    }
    
    let resizeTimer;
    $(window).on('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            createParticleBackground();
        }, 250);
    });
});