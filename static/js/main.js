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