(() => {
        'use strict';

        // ---- Mouse Spotlight ----
        const spotlight = document.getElementById('mouse-spotlight');
        if (spotlight) {
            document.addEventListener('mousemove', e => {
                spotlight.style.left = e.clientX + 'px';
                spotlight.style.top  = e.clientY + 'px';
            });
        }

        // ---- Hamburger / Mobile Menu ----
        const hamburger = document.getElementById('hamburger-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        let menuOpen = false;

        function toggleMenu(force) {
            menuOpen = (force !== undefined) ? force : !menuOpen;
            hamburger.classList.toggle('open', menuOpen);
            mobileMenu.classList.toggle('open', menuOpen);
            hamburger.setAttribute('aria-expanded', menuOpen);
            mobileMenu.setAttribute('aria-hidden', !menuOpen);
        }

        if (hamburger && mobileMenu) {
            hamburger.addEventListener('click', () => toggleMenu());
            // Close on link click
            mobileMenu.querySelectorAll('a').forEach(a => {
                a.addEventListener('click', () => toggleMenu(false));
            });
            // Close on outside click
            document.addEventListener('click', e => {
                if (menuOpen && !hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
                    toggleMenu(false);
                }
            });
        }

        // ---- Sticky Header Scroll Blur ----
        const header = document.getElementById('site-header');
        function handleHeaderScroll() {
            if (window.scrollY > 20) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        window.addEventListener('scroll', handleHeaderScroll, { passive: true });
        handleHeaderScroll();

        // ---- Back to Top & Scroll Progress ----
        const backBtn = document.getElementById('back-to-top');
        const progressCircle = document.getElementById('progress-circle');
        let lastScrollY = window.scrollY;

        if (backBtn) {
            window.addEventListener('scroll', () => {
                const currentScrollY = window.scrollY;
                backBtn.classList.toggle('visible', currentScrollY > 400);
                
                if (currentScrollY > lastScrollY) {
                    // Scrolling down
                    backBtn.classList.add('scrolling-down');
                } else {
                    // Scrolling up
                    backBtn.classList.remove('scrolling-down');
                }
                lastScrollY = currentScrollY;

                if (progressCircle) {
                    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
                    const scrollProgress = Math.min(Math.max(currentScrollY / scrollHeight, 0), 1);
                    progressCircle.style.strokeDashoffset = 289 - (scrollProgress * 289);
                }
            }, { passive: true });
            
            backBtn.addEventListener('click', () => {
                // If pointing down, scroll to bottom? User just asked for arrow direction, 
                // but let's make it actually scroll to bottom if it's pointing down!
                if (backBtn.classList.contains('scrolling-down')) {
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        }

        // ---- Active Nav Link (Path matching) ----
        const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link, .dropdown-link');
        const path = window.location.pathname;
        let pathMatched = false;

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href') || '';
            // For sub-pages, exact match
            if (path !== '/' && href === path) {
                link.classList.add('active');
                pathMatched = true;
                
                // If it's a dropdown link, make the "Solutions" button active too
                if (link.classList.contains('dropdown-link')) {
                    const solutionsBtn = document.getElementById('solutions-btn');
                    if (solutionsBtn) {
                        solutionsBtn.classList.add('active');
                        // Update button text to match the active link
                        const linkText = link.textContent.trim();
                        solutionsBtn.innerHTML = linkText + `
                            <svg class="dropdown-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/>
                            </svg>
                        `;
                    }
                }
            }
        });

        // Set Home active if on root
        if (path === '/') {
            const homeBtn = document.getElementById('nav-home');
            if (homeBtn) homeBtn.classList.add('active');
            
            // Basic scrollspy for home sections
            const homeSections = document.querySelectorAll('section[id]');
            window.addEventListener('scroll', () => {
                let current = '';
                homeSections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    if (scrollY >= sectionTop - 100) {
                        current = section.getAttribute('id');
                    }
                });
                navLinks.forEach(li => {
                    li.classList.remove('active');
                    if (li.getAttribute('href') === `/{% url 'home' %}#${current}` || li.getAttribute('href') === `/#${current}` || li.getAttribute('href') === `#${current}`) {
                        li.classList.add('active');
                    }
                });
                if (!current || current === 'home') {
                    if (homeBtn) homeBtn.classList.add('active');
                }
            }, { passive: true });
        } else if (!pathMatched) {
            const sections = document.querySelectorAll('section[id], div[id="solar_calculator"]');
            if (sections.length > 0) {
                const observer = new IntersectionObserver(entries => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            navLinks.forEach(l => l.classList.remove('active'));
                            const id = entry.target.getAttribute('id');
                            document.querySelectorAll(`a[href*="#${id}"]`).forEach(l => l.classList.add('active'));
                        }
                    });
                }, { rootMargin: '-25% 0px -60% 0px', threshold: 0 });
                sections.forEach(s => observer.observe(s));
            }
        }

    })();
        // ---- Dropdown Click Toggle ----
        const dropdownBtn = document.getElementById('solutions-btn');
        const dropdownWrapper = dropdownBtn?.closest('.dropdown-wrapper');
        
        if (dropdownBtn && dropdownWrapper) {
            dropdownBtn.addEventListener('click', (e) => {
                e.preventDefault();
                dropdownWrapper.classList.toggle('show');
            });

            // Close when clicking outside
            document.addEventListener('click', (e) => {
                if (!dropdownWrapper.contains(e.target)) {
                    dropdownWrapper.classList.remove('show');
                }
            });
            
            // Close when pressing Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    dropdownWrapper.classList.remove('show');
                }
            });
        }
/* --- Extracted from home.html --- */

/* ---- Preloader ---- */
(function() {
    const preloader  = document.getElementById('preloader');
    if (!preloader) {
        // If there's no preloader on this page, initialize immediately
        document.addEventListener('DOMContentLoaded', () => {
            if (typeof initAnimations === 'function') initAnimations();
            if (typeof initCounters === 'function') initCounters();
            if (typeof calculateSolarOutputs === 'function') calculateSolarOutputs();
        });
        return;
    }

    const bar        = document.getElementById('preloader-bar');
    const pct        = document.getElementById('pl-pct');
    const msg        = document.getElementById('pl-msg');
    const irrEl      = document.getElementById('pl-irr');
    const genEl      = document.getElementById('pl-gen');

    const states = [
        {t:0,  s:'Booting Telemetry Arrays...'},
        {t:25, s:'Mapping Regional Irradiance...'},
        {t:55, s:'Simulating String Array Voltages...'},
        {t:80, s:'Grid Injection Connection Safe...'}
    ];

    let p = 0;
    const iv = setInterval(() => {
        p += Math.floor(Math.random() * 9) + 4;
        if (p > 100) p = 100;
        if (bar) bar.style.width = p + '%';
        if (pct) pct.textContent = p + '%';
        if (irrEl) irrEl.textContent = Math.round(p / 100 * 1025) + ' W/m²';
        if (genEl) genEl.textContent = (p / 100 * 14.85).toFixed(2) + ' kW';
        const match = states.reduce((a, c) => p >= c.t ? c : a);
        if (msg) msg.textContent = match.s;

        if (p >= 100) {
            clearInterval(iv);
            setTimeout(() => {
                preloader.classList.add('hidden');
                setTimeout(() => preloader.remove(), 800);
                
                // Init GSAP after preloader hides
                if (typeof initAnimations === 'function') initAnimations();
                if (typeof initCounters === 'function') initCounters();
                if (typeof calculateSolarOutputs === 'function') calculateSolarOutputs();
            }, 600);
        }
    }, 70);
})();

/* ---- Tariff Slider ---- */
function updateTariffLabel(val) {
    const el = document.getElementById('tariff-val');
    if (el) el.textContent = val;
    const slider = document.getElementById('calc-tariff');
    if (slider) {
        const pct = ((val - slider.min) / (slider.max - slider.min)) * 100;
        slider.style.background = `linear-gradient(to right, var(--clr-primary) 0%, var(--clr-secondary) ${pct}%, var(--bg-overlay) ${pct}%, var(--bg-overlay) 100%)`;
    }
}

/* ---- Solar Calculator ---- */
function calculateSolarOutputs() {
    const billInput   = document.getElementById('calc-bill');
    const tariffInput = document.getElementById('calc-tariff');
    const outSize     = document.getElementById('out-sys-size');
    const outCons     = document.getElementById('out-consumption');
    const outPanels   = document.getElementById('out-panels');
    const outCost     = document.getElementById('out-system-cost');
    const outMonth    = document.getElementById('out-monthly-savings');
    const outAnnual   = document.getElementById('out-annual-savings');
    const roiArc      = document.getElementById('roi-arc');
    const roiPct      = document.getElementById('roi-pct');
    const fCap        = document.getElementById('f-capacity');
    const fBill       = document.getElementById('f-bill');
    const fScale      = document.getElementById('f-scale');

    const reset = () => { [outSize,outCons,outPanels,outCost,outMonth,outAnnual].forEach(e => { if(e) e.textContent = '—'; }); };

    if (!billInput || !tariffInput) return;
    const rawBill = billInput.value.toString().trim().replace(/,/g, '');
    if (!rawBill) { reset(); return; }

    const monthlyBill     = parseFloat(rawBill) || 0;
    const tariffRate      = parseFloat(tariffInput.value) || 1;
    const monthlyUnits    = Math.round(monthlyBill / tariffRate);
    const exactKW         = monthlyUnits / (30 * 4);
    const sysKW           = exactKW === 0 ? 0 : Math.ceil(exactKW);
    const panels          = sysKW > 0 ? Math.ceil(sysKW * 1000 / 550) : 0;
    let costPerKW = 55000;
    if (sysKW > 10)  costPerKW = 50000;
    if (sysKW > 100) costPerKW = 48000;
    if (sysKW > 500) costPerKW = 43000;
    const estimatedCost = Math.round(sysKW * costPerKW);
    const annualSavings = monthlyBill * 12;

    if (outSize)   outSize.textContent   = sysKW >= 1000 ? (sysKW/1000).toFixed(2)+' MW' : sysKW+' kW';
    if (outCons)   outCons.textContent   = monthlyUnits.toLocaleString('en-IN') + ' Units';
    if (outPanels) outPanels.textContent = panels.toLocaleString('en-IN');
    if (outCost)   outCost.textContent   = '₹' + estimatedCost.toLocaleString('en-IN');
    if (outMonth)  outMonth.textContent  = '₹' + monthlyBill.toLocaleString('en-IN');
    if (outAnnual) outAnnual.textContent = '₹' + annualSavings.toLocaleString('en-IN');

    const roiFactor = Math.min(Math.round((sysKW / 150) * 100), 100) || 12;
    if (roiArc) roiArc.setAttribute('stroke-dasharray', roiFactor + ', 100');
    if (roiPct) roiPct.textContent = roiFactor + '%';

    if (fCap)   fCap.value   = sysKW;
    if (fBill)  fBill.value  = monthlyBill;
    if (fScale) fScale.value = sysKW >= 100 ? 'MW' : sysKW >= 10 ? 'COM' : 'RES';
}

/* ---- Animated Counters ---- */
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            observer.unobserve(entry.target);
            const target = parseFloat(entry.target.dataset.target);
            const duration = 1800;
            const start = performance.now();
            function step(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
                entry.target.textContent = Math.floor(eased * target);
                if (progress < 1) requestAnimationFrame(step);
                else entry.target.textContent = target;
            }
            requestAnimationFrame(step);
        });
    }, { threshold: 0.5 });
    counters.forEach(c => observer.observe(c));
}

/* ---- Particle Canvas ---- */
function initParticles() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles;

    const isMobile = () => window.innerWidth < 768;
    const particleCount = () => isMobile() ? 40 : 80;

    function resize() {
        W = canvas.width  = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
    }

    function getThemeColor() {
        return document.documentElement.getAttribute('data-theme') === 'light' ? '30,58,138' : '245,158,11';
    }
    let pColor = getThemeColor();

    const observer = new MutationObserver(() => { pColor = getThemeColor(); });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    function createParticles() {
        particles = Array.from({ length: particleCount() }, () => ({
            x: Math.random() * W,
            y: Math.random() * H,
            r: Math.random() * 1.5 + 0.3,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            alpha: Math.random() * 0.5 + 0.1
        }));
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0) p.x = W;
            if (p.x > W) p.x = 0;
            if (p.y < 0) p.y = H;
            if (p.y > H) p.y = 0;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${pColor},${p.alpha})`;
            ctx.fill();
        });
        // Connection lines
        particles.forEach((a, i) => {
            for (let j = i + 1; j < particles.length; j++) {
                const b = particles[j];
                const dist = Math.hypot(a.x - b.x, a.y - b.y);
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.strokeStyle = `rgba(${pColor},${0.15 * (1 - dist/100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        });
        requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    draw();
    window.addEventListener('resize', () => { resize(); createParticles(); }, { passive: true });
}

/* ---- GSAP Scroll Animations ---- */
function initAnimations() {
    if (typeof gsap === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    // Fade-up reveals
    gsap.utils.toArray('.reveal').forEach(el => {
        gsap.to(el, {
            opacity: 1, y: 0,
            duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true }
        });
    });
    gsap.utils.toArray('.reveal-left').forEach(el => {
        gsap.to(el, {
            opacity: 1, x: 0,
            duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true }
        });
    });
    gsap.utils.toArray('.reveal-right').forEach(el => {
        gsap.to(el, {
            opacity: 1, x: 0,
            duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true }
        });
    });
    // Stagger cards
    gsap.utils.toArray('.stagger-item').forEach((el, i) => {
        gsap.to(el, {
            opacity: 1, y: 0,
            duration: 0.7, delay: i * 0.08, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true }
        });
    });
}

/* ---- 3D Tilt Card ---- */
function init3DCard() {
    const card = document.getElementById('hero-3d-card');
    if (!card) return;
    const parent = card.parentElement;
    parent.addEventListener('mousemove', e => {
        const r = parent.getBoundingClientRect();
        const xc = (e.clientX - r.left) / r.width  - 0.5;
        const yc = (e.clientY - r.top)  / r.height - 0.5;
        card.style.transform = `rotateX(${yc * -12}deg) rotateY(${xc * 12}deg)`;
    });
    parent.addEventListener('mouseleave', () => {
        card.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
}

/* ---- Drag-to-Swipe & Auto-Scroll Sliders ---- */
function initSliders() {
    function setupSlider(wrapSelector, trackSelector, reverse = false) {
        const wrap = document.querySelector(wrapSelector);
        const track = document.querySelector(trackSelector);
        if (!wrap || !track) return;
        
        const content = track.innerHTML;
        track.innerHTML = content + content;
        
        let isDown = false;
        let startX;
        let currentTranslate = 0;
        let prevTranslate = 0;
        let autoScrollSpeed = 1;
        let rAF;
        
        // Disable native scroll, we use CSS transforms now
        wrap.style.overflow = 'hidden';
        
        function onStart(x) {
            isDown = true;
            wrap.style.cursor = 'grabbing';
            startX = x;
            cancelAnimationFrame(rAF);
        }
        function onMove(x) {
            if (!isDown) return;
            const walk = (x - startX) * 1.5;
            currentTranslate = prevTranslate + walk;
            track.style.transform = `translateX(${currentTranslate}px)`;
        }
        function onEnd() {
            isDown = false;
            wrap.style.cursor = 'grab';
            prevTranslate = currentTranslate;
            rAF = requestAnimationFrame(loop);
        }
        
        // Mouse Events
        wrap.addEventListener('mousedown', e => onStart(e.pageX));
        wrap.addEventListener('mouseleave', () => { if (isDown) onEnd(); });
        wrap.addEventListener('mouseup', onEnd);
        wrap.addEventListener('mousemove', e => {
            if (isDown) e.preventDefault();
            onMove(e.pageX);
        });
        
        // Touch Events
        wrap.addEventListener('touchstart', e => onStart(e.touches[0].pageX), {passive: true});
        wrap.addEventListener('touchend', onEnd);
        wrap.addEventListener('touchmove', e => onMove(e.touches[0].pageX), {passive: true});
        
        // Pause on Hover
        wrap.addEventListener('mouseenter', () => {
            if (!isDown) cancelAnimationFrame(rAF);
        });
        wrap.addEventListener('mouseleave', () => {
            if (!isDown) rAF = requestAnimationFrame(loop);
        });
        
        function loop() {
            if (!isDown) {
                const halfWidth = track.scrollWidth / 2;
                if (reverse) {
                    currentTranslate += autoScrollSpeed;
                    if (currentTranslate > 0) {
                        currentTranslate = -halfWidth;
                    }
                } else {
                    currentTranslate -= autoScrollSpeed;
                    if (currentTranslate < -halfWidth) {
                        currentTranslate = 0;
                    }
                }
                prevTranslate = currentTranslate;
                track.style.transform = `translateX(${currentTranslate}px)`;
            }
            rAF = requestAnimationFrame(loop);
        }
        
        if (reverse) {
            currentTranslate = -(track.scrollWidth / 2);
            prevTranslate = currentTranslate;
        }
        
        rAF = requestAnimationFrame(loop);
    }
    
    setupSlider('.project-slider-wrap', '#project-track', false); // Left
    setupSlider('.testimonials-slider-wrap', '#testimonials-track', true); // Right
    
    // Hide old manual nav if it exists
    const nav = document.querySelector('.project-nav');
    if (nav) nav.style.display = 'none';
}

/* ---- Run everything ---- */
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    init3DCard();
    initSliders();
    // Init tariff slider display
    const ts = document.getElementById('calc-tariff');
    if (ts) updateTariffLabel(ts.value);
    // Reduced motion check
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.stagger-item').forEach(el => {
            el.style.opacity = 1;
            el.style.transform = 'none';
        });
    }
});
