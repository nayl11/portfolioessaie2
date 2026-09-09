const cursor = document.querySelector('.cursor');
const heroSection = document.querySelector('.hero-section');

window.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';

    if (heroSection) {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        heroSection.style.setProperty('--hero-offset-x', x + 'px');
        heroSection.style.setProperty('--hero-offset-y', y + 'px');
    }
});

const interactives = document.querySelectorAll('a, button, .skill-badge, .cert-card, .card, input, textarea, .btn, .project-card, .feature-card, .doc-card, .experience-card, .contact-card');
interactives.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            if (entry.target.classList.contains('skill-card')) {
                const fill = entry.target.querySelector('.progress-fill');
                const width = fill.style.width;
                fill.style.width = '0%';
                setTimeout(() => {
                    fill.style.width = width;
                }, 200);
            }
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

document.querySelectorAll('.skill-card').forEach(el => observer.observe(el));

const heroH1 = document.querySelector('.hero-copy h1');
const originalText = heroH1.innerHTML;
heroH1.innerHTML = '';
let index = 0;

function typeWriter() {
    if (index < originalText.length) {
        heroH1.innerHTML += originalText.charAt(index);
        index++;
        setTimeout(typeWriter, 100);
    }
}

setTimeout(typeWriter, 1500);

const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    themeToggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
});

// Particle system
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
const particleCount = 100;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = document.body.classList.contains('dark') ? 
            `hsl(${Math.random() * 60 + 40}, 100%, 70%)` : 
            `hsl(${Math.random() * 40 + 20}, 70%, 60%)`;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

// Update particles on theme change
themeToggle.addEventListener('click', () => {
    particles.forEach(particle => {
        particle.color = document.body.classList.contains('dark') ? 
            `hsl(${Math.random() * 60 + 40}, 100%, 70%)` : 
            `hsl(${Math.random() * 40 + 20}, 70%, 60%)`;
    });
});

const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    backToTop.style.display = (window.pageYOffset > 500) ? 'flex' : 'none';
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

const tiltCards = document.querySelectorAll('.project-card, .feature-card, .doc-card, .experience-card, .contact-card');

tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rotateX = (y - 0.5) * 8;
        const rotateY = (x - 0.5) * 8;
        card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY + window.innerHeight / 2;
    sections.forEach(section => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        const id = section.getAttribute('id');

        if (currentScroll >= top && currentScroll <= bottom) {
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
        }
    });
});

const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalCaption = document.getElementById('modalCaption');
const closeModal = document.querySelector('.modal-close');
const modalContent = document.querySelector('.modal-content');

const lightboxImages = document.querySelectorAll('.lightbox-img');
lightboxImages.forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
        modalImage.src = img.src;
        modalImage.alt = img.alt;
        modalCaption.textContent = img.alt;
        modal.classList.add('show');
    });
});

const closeModalFn = () => modal.classList.remove('show');
closeModal.addEventListener('click', closeModalFn);
modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModalFn();
    }
});
