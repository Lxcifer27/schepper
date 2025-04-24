// Hero Slider Functionality
const slider = {
    currentSlide: 0,
    slides: document.querySelectorAll('.slide'),
    dots: document.querySelectorAll('.dot'),
    prevBtn: document.getElementById('prev'),
    nextBtn: document.getElementById('next'),
    autoPlayInterval: null,
    autoPlayDelay: 6000, // 6 seconds for automatic slide transition

    init() {
        if (this.slides.length === 0) return;

        // Initialize event listeners
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Add click events to dots
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });

        // Start autoplay
        this.startAutoPlay();

        // Pause autoplay on hover
        const sliderContainer = document.querySelector('.slider-container');
        sliderContainer.addEventListener('mouseenter', () => this.stopAutoPlay());
        sliderContainer.addEventListener('mouseleave', () => this.startAutoPlay());
    },

    goToSlide(index) {
        if (index === this.currentSlide) return;
        
        // Remove active class from current slide and dot
        this.slides[this.currentSlide].classList.remove('active');
        this.dots[this.currentSlide].classList.remove('active');
        
        // Update current slide index
        this.currentSlide = index;
        
        // Handle index boundary
        if (this.currentSlide < 0) {
            this.currentSlide = this.slides.length - 1;
        } else if (this.currentSlide >= this.slides.length) {
            this.currentSlide = 0;
        }
        
        // Add active class to new current slide and dot
        this.slides[this.currentSlide].classList.add('active');
        this.dots[this.currentSlide].classList.add('active');
    },

    nextSlide() {
        this.goToSlide(this.currentSlide + 1);
    },

    prevSlide() {
        this.goToSlide(this.currentSlide - 1);
    },

    startAutoPlay() {
        this.stopAutoPlay(); // Clear any existing interval
        this.autoPlayInterval = setInterval(() => this.nextSlide(), this.autoPlayDelay);
    },

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }
};

// Stats counter animation
const counter = {
    init(el, target, duration = 2000) {
        let startTime = null;
        const startValue = 0;
        
        // Handle if element should display with 'K+' suffix
        const hasK = el.textContent.includes('K');
        const hasSup = el.querySelector('sup') !== null;
        
        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const value = Math.floor(progress * (target - startValue) + startValue);
            
            if (hasK) {
                el.textContent = `${value}K`;
                if (hasSup) el.innerHTML = `${value}K<sup>+</sup>`;
            } else {
                el.textContent = `${value}`;
                if (hasSup) el.innerHTML = `${value}<sup>+</sup>`;
            }
            
            if (progress < 1) {
                window.requestAnimationFrame(animate);
            }
        };
        
        window.requestAnimationFrame(animate);
    }
};

// Scroll animation functionality
const scrollAnimations = {
    elements: document.querySelectorAll('.animate-on-scroll'),
    animationTypes: {
        fadeIn: (el) => {
            el.style.transform = 'translateY(0)';
            el.style.opacity = '1';
        },
        slideInRight: (el) => {
            el.style.transform = 'translateX(0)';
            el.style.opacity = '1';
        },
        slideInLeft: (el) => {
            el.style.transform = 'translateX(0)';
            el.style.opacity = '1';
        },
        scaleUp: (el) => {
            el.style.transform = 'scale(1)';
            el.style.opacity = '1';
        },
        counter: (el) => {
            const target = parseInt(el.dataset.count, 10);
            counter.init(el.querySelector('h3'), target);
        }
    },

    init() {
        // Set initial styles based on animation type
        this.elements.forEach(el => {
            const animationType = el.dataset.animation || 'fadeIn';
            const delay = el.dataset.delay || 0;
            
            switch (animationType) {
                case 'slideInRight':
                    el.style.transform = 'translateX(50px)';
                    break;
                case 'slideInLeft':
                    el.style.transform = 'translateX(-50px)';
                    break;
                case 'scaleUp':
                    el.style.transform = 'scale(0.8)';
                    break;
                default: // fadeIn
                    el.style.transform = 'translateY(20px)';
            }
            
            el.style.opacity = '0';
            el.style.transitionDelay = `${delay}ms`;
        });
        
        // Check elements on load
        window.addEventListener('load', () => {
            this.checkElements();
            // Add small delay for first animations to allow everything to render
            setTimeout(() => {
                this.checkElements();
            }, 100);
        });
        
        // Add scroll event listener with throttling
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (!scrollTimeout) {
                scrollTimeout = setTimeout(() => {
                    this.checkElements();
                    scrollTimeout = null;
                }, 10); 
            }
        });
    },

    checkElements() {
        const triggerBottom = window.innerHeight * 0.85;
        
        this.elements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            
            if (elementTop < triggerBottom) {
                const animationType = el.dataset.animation || 'fadeIn';
                
                if (this.animationTypes[animationType]) {
                    this.animationTypes[animationType](el);
                } else {
                    // Default animation
                    this.animationTypes.fadeIn(el);
                }
                
                el.classList.add('animated');
            }
        });
    }
};

// Videos & thumbnails interaction
const videoPreview = {
    init() {
        const playButton = document.querySelector('.play-button');
        const thumbnails = document.querySelectorAll('.thumbnail');
        const mainImage = document.querySelector('.preview-image img');
        
        if (playButton) {
            playButton.addEventListener('click', () => {
                alert('Video player would start here in a real implementation.');
            });
        }
        
        if (thumbnails.length && mainImage) {
            thumbnails.forEach(thumbnail => {
                thumbnail.addEventListener('click', () => {
                    const thumbnailSrc = thumbnail.querySelector('img').src;
                    mainImage.src = thumbnailSrc;
                    
                    // Remove active class from all thumbnails
                    thumbnails.forEach(t => t.classList.remove('active'));
                    
                    // Add active class to clicked thumbnail
                    thumbnail.classList.add('active');
                });
            });
        }
    }
};

// Navigation hover effects
const navigation = {
    init() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', function() {
                this.style.transition = 'color 0.3s ease';
            });
        });

        // Add smooth scrolling to nav links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
};

// Hover effects for product items
const productEffects = {
    init() {
        const productItems = document.querySelectorAll('.product-item');
        
        productItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.querySelector('.product-overlay').style.opacity = '1';
                this.querySelector('.product-details').style.opacity = '1';
                this.querySelector('.product-details').style.transform = 'translateY(0)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.querySelector('.product-overlay').style.opacity = '0';
                this.querySelector('.product-details').style.opacity = '0';
                this.querySelector('.product-details').style.transform = 'translateY(20px)';
            });
        });
    }
};

// Initialize all functionality when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    slider.init();
    scrollAnimations.init();
    videoPreview.init();
    navigation.init();
    productEffects.init();
    
    // Add class to body after page is fully loaded
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        
        // Trigger animation for hero section
        const heroContent = document.querySelector('.hero-content.fade-in');
        if (heroContent) {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }
    });
}); 