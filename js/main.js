// Banner rotativo automático
document.addEventListener('DOMContentLoaded', function() {
    // Banner functionality
    const slides = document.querySelectorAll('.banner-slide');
    const prevBtn = document.querySelector('.banner-btn.prev');
    const nextBtn = document.querySelector('.banner-btn.next');
    const dotsContainer = document.querySelector('.banner-dots');
    let currentSlide = 0;
    let slideInterval;

    if (slides.length > 0) {
        // Create dots
        slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.dot');

        function goToSlide(n) {
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');
            currentSlide = (n + slides.length) % slides.length;
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        }

        function nextSlide() {
            goToSlide(currentSlide + 1);
        }

        function prevSlide() {
            goToSlide(currentSlide - 1);
        }

        // Auto advance slides
        function startSlideShow() {
            slideInterval = setInterval(nextSlide, 5000);
        }

        function stopSlideShow() {
            clearInterval(slideInterval);
        }

        // Event listeners
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                stopSlideShow();
                startSlideShow();
            });

            nextBtn.addEventListener('click', () => {
                nextSlide();
                stopSlideShow();
                startSlideShow();
            });
        }

        // Pause on hover
        const bannerContainer = document.querySelector('.banner-container');
        if (bannerContainer) {
            bannerContainer.addEventListener('mouseenter', stopSlideShow);
            bannerContainer.addEventListener('mouseleave', startSlideShow);
        }

        // Start slideshow
        startSlideShow();
    }

    // Form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Here you would typically send the data to a server
            console.log('Form submitted:', data);
            
            // Show success message
            alert('Gracias por contactarnos. Te responderemos a la brevedad.');
            this.reset();
        });
    }

    // Service Worker registration
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.service-card, .value-item, .card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Offline detection
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

function updateOnlineStatus() {
    if (navigator.onLine) {
        document.body.classList.remove('offline');
    } else {
        document.body.classList.add('offline');
        // Show offline notification
        const offlineMsg = document.createElement('div');
        offlineMsg.className = 'offline-message';
        offlineMsg.textContent = 'Estás trabajando sin conexión. Algunas funciones pueden no estar disponibles.';
        offlineMsg.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #ff6b6b;
            color: white;
            text-align: center;
            padding: 1rem;
            z-index: 9999;
        `;
        document.body.prepend(offlineMsg);
    }
}