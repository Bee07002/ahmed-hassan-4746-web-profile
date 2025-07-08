// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
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

// Navbar background change on scroll
const navbar = document.querySelector('.navbar');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
    
    // Hide/show navbar on scroll
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
});

// Intersection Observer for animations
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

// Observe feature cards and blog cards
document.querySelectorAll('.feature-card, .blog-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// 3D Mouse Movement Effect for Hero Section
const hero3d = document.querySelector('.hero-3d');
const floatingElements = document.querySelectorAll('.floating-cube, .floating-sphere');

if (hero3d) {
    hero3d.addEventListener('mousemove', (e) => {
        const rect = hero3d.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        
        floatingElements.forEach((element, index) => {
            const intensity = (index + 1) * 10;
            const rotateX = (y - 0.5) * intensity;
            const rotateY = (x - 0.5) * intensity;
            
            element.style.transform = `
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                translateZ(${intensity}px)
            `;
        });
    });
    
    hero3d.addEventListener('mouseleave', () => {
        floatingElements.forEach(element => {
            element.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    });
}

// Button 3D Effect
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'perspective(1000px) rotateX(-10deg) translateY(-2px)';
    });
    
    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'perspective(1000px) rotateX(0deg) translateY(0px)';
    });
    
    btn.addEventListener('mousedown', function() {
        this.style.transform = 'perspective(1000px) rotateX(5deg) translateY(1px)';
    });
    
    btn.addEventListener('mouseup', function() {
        this.style.transform = 'perspective(1000px) rotateX(-10deg) translateY(-2px)';
    });
});

// Card Tilt Effect
document.querySelectorAll('.feature-card, .blog-card').forEach(card => {
    card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        this.style.transform = `
            perspective(1000px) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg) 
            translateZ(10px)
        `;
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    });
});

// Parallax Effect for 3D Elements
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    document.querySelectorAll('.floating-cube').forEach((cube, index) => {
        const speed = (index + 1) * 0.2;
        cube.style.transform = `translateY(${rate * speed}px) rotateX(${scrolled * 0.1}deg) rotateY(${scrolled * 0.05}deg)`;
    });
    
    document.querySelectorAll('.floating-sphere').forEach((sphere, index) => {
        const speed = (index + 1) * 0.3;
        sphere.style.transform = `translateY(${rate * speed}px) rotate(${scrolled * 0.1}deg)`;
    });
});

// Loading Animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Feature Cards Stagger Animation
const featureCards = document.querySelectorAll('.feature-card');
const featureObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) rotateX(0deg)';
            }, index * 100);
        }
    });
}, { threshold: 0.1 });

featureCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px) rotateX(-15deg)';
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    featureObserver.observe(card);
});

// Blog Cards Entrance Animation
const blogCards = document.querySelectorAll('.blog-card');
const blogObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) perspective(1000px) rotateY(0deg)';
            }, index * 150);
        }
    });
}, { threshold: 0.1 });

blogCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px) perspective(1000px) rotateY(-15deg)';
    card.style.transition = `opacity 0.8s ease ${index * 0.15}s, transform 0.8s ease ${index * 0.15}s`;
    blogObserver.observe(card);
});

// Dynamic Background for Hero Section
const hero = document.querySelector('.hero');
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX / window.innerWidth;
    mouseY = e.clientY / window.innerHeight;
});

function animateBackground() {
    const gradientX = 50 + (mouseX - 0.5) * 20;
    const gradientY = 50 + (mouseY - 0.5) * 20;
    
    if (hero) {
        hero.style.background = `
            radial-gradient(circle at ${gradientX}% ${gradientY}%, 
            rgba(102, 126, 234, 0.8) 0%, 
            rgba(118, 75, 162, 0.9) 100%),
            linear-gradient(135deg, #667eea 0%, #764ba2 100%)
        `;
    }
    
    requestAnimationFrame(animateBackground);
}

animateBackground();

// Add click effects to buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);