/**
 * ==========================================
 * PORTFOLIO MAIN JAVASCRIPT (ZERO CONSOLE ERRORS)
 * ==========================================
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. PAGE LOADER
       ================================---------- */
    const pageLoader = document.getElementById('pageLoader');
    window.addEventListener('load', () => {
        if (pageLoader) {
            setTimeout(() => {
                pageLoader.classList.add('fade-out');
            }, 300);
        }
    });

    /* ==========================================
       2. SCROLL PROGRESS BAR
       ================================---------- */
    const scrollProgress = document.getElementById('scrollProgress');
    window.addEventListener('scroll', () => {
        if (scrollProgress) {
            const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const currentScroll = window.scrollY;
            const progress = totalHeight > 0 ? (currentScroll / totalHeight) * 100 : 0;
            scrollProgress.style.width = `${progress}%`;
        }
    });

    /* ==========================================
       3. DARK / LIGHT MODE TOGGLE
       ================================---------- */
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;

    const savedTheme = localStorage.getItem('portfolio_theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('portfolio_theme', newTheme);
        });
    }

    /* ==========================================
       4. RESPONSIVE NAVIGATION & MOBILE MENU
       ================================---------- */
    const navMenu = document.getElementById('navMenu');
    const navToggle = document.getElementById('navToggle');
    const navClose = document.getElementById('navClose');
    const navLinks = document.querySelectorAll('.nav__link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('active');
        });
    }

    if (navClose && navMenu) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) navMenu.classList.remove('active');
        });
    });

    /* ==========================================
       5. ACTIVE NAVIGATION HIGHLIGHTING
       ================================---------- */
    const sections = document.querySelectorAll('section[id]');
    
    function scrollActive() {
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav__list a[href*="#${sectionId}"]`);

            if (correspondingLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    correspondingLink.classList.add('active');
                } else {
                    correspondingLink.classList.remove('active');
                }
            }
        });
    }

    window.addEventListener('scroll', scrollActive);

    /* ==========================================
       6. TYPED TEXT ANIMATION IN HERO
       ================================---------- */
    const typedTextSpan = document.getElementById('typedText');
    const roles = [
        "Full-Stack Developer",
        "Front-End Specialist",
        "Java Developer",
        "React Architect",
        "UI/UX Designer"
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeRole() {
        if (!typedTextSpan) return;
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typedTextSpan.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typedTextSpan.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typingSpeed = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500;
        }

        setTimeout(typeRole, typingSpeed);
    }

    typeRole();

    /* ==========================================
       7. ANIMATED COUNTERS IN ABOUT SECTION
       ================================---------- */
    const statNumbers = document.querySelectorAll('.stat__number');
    let counted = false;

    function startCounters() {
        statNumbers.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            let count = 0;
            const speed = target > 0 ? target / 50 : 1;

            function updateCount() {
                count += speed;
                if (count < target) {
                    counter.textContent = Math.ceil(count);
                    setTimeout(updateCount, 30);
                } else {
                    counter.textContent = target + "+";
                }
            }
            updateCount();
        });
    }

    const aboutSection = document.getElementById('about');
    if (aboutSection && statNumbers.length > 0) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !counted) {
                    startCounters();
                    counted = true;
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });

        counterObserver.observe(aboutSection);
    }

    /* ==========================================
       8. REUSABLE SHOW MORE / SHOW LESS LOGIC
       ================================---------- */
    function setupShowMore(gridId, btnId, itemSelector, showText, hideText) {
        const grid = document.getElementById(gridId);
        const btn = document.getElementById(btnId);

        if (!grid || !btn) return;

        btn.addEventListener('click', () => {
            const hiddenItems = grid.querySelectorAll(`${itemSelector}.hidden-item`);
            const isExpanded = btn.getAttribute('data-expanded') === 'true';

            if (!isExpanded) {
                hiddenItems.forEach(item => {
                    item.classList.remove('hidden-item');
                    item.style.opacity = 0;
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                        item.style.opacity = 1;
                        item.style.transform = 'translateY(0)';
                    }, 50);
                });
                btn.innerHTML = `${hideText} <i class="fa-solid fa-chevron-up"></i>`;
                btn.setAttribute('data-expanded', 'true');
            } else {
                const allItems = grid.querySelectorAll(itemSelector);
                allItems.forEach((item, index) => {
                    if (index >= 2) {
                        item.classList.add('hidden-item');
                    }
                });
                btn.innerHTML = `${showText} <i class="fa-solid fa-chevron-down"></i>`;
                btn.setAttribute('data-expanded', 'false');
                grid.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    }

    setupShowMore('certificationsGrid', 'certShowMoreBtn', '.cert__card', 'Show More Certifications', 'Show Less Certifications');
    setupShowMore('projectsGrid', 'projectShowMoreBtn', '.project__card', 'Show More Projects', 'Show Less Projects');

    /* ==========================================
       9. CERTIFICATE LIGHTBOX MODAL
       ================================---------- */
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const certZoomBtns = document.querySelectorAll('.cert-zoom-btn');

    certZoomBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const imgSrc = btn.getAttribute('data-img');
            if (lightboxImg && imgSrc) {
                lightboxImg.src = imgSrc;
            }
            if (lightboxModal) {
                lightboxModal.classList.add('active');
            }
        });
    });

    if (lightboxClose && lightboxModal) {
        lightboxClose.addEventListener('click', () => {
            lightboxModal.classList.remove('active');
        });
    }

    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                lightboxModal.classList.remove('active');
            }
        });
    }

    /* ==========================================
       10. CUSTOM TESTIMONIAL SLIDER
       ================================---------- */
    const reviewsTrack = document.getElementById('reviewsTrack');
    const reviewCards = document.querySelectorAll('.review__card');
    const prevReviewBtn = document.getElementById('prevReviewBtn');
    const nextReviewBtn = document.getElementById('nextReviewBtn');
    const sliderDotsContainer = document.getElementById('sliderDots');
    let currentSlide = 0;
    const totalSlides = reviewCards.length;

    if (sliderDotsContainer && totalSlides > 0) {
        reviewCards.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            sliderDotsContainer.appendChild(dot);
        });
    }

    const dots = sliderDotsContainer ? sliderDotsContainer.querySelectorAll('.dot') : [];

    function updateSlider() {
        if (reviewsTrack && totalSlides > 0) {
            reviewsTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }
    }

    function goToSlide(index) {
        currentSlide = index;
        updateSlider();
    }

    if (nextReviewBtn && prevReviewBtn && totalSlides > 0) {
        nextReviewBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
        });

        prevReviewBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateSlider();
        });

        setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
        }, 6000);
    }

    /* ==========================================
       11. CONTACT FORM VALIDATION & PERSISTENCE
       ================================---------- */
    const contactForm = document.getElementById('contactForm');
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const formStatusAlert = document.getElementById('formStatusAlert');
    const successModal = document.getElementById('successModal');
    const successModalClose = document.getElementById('successModalClose');

    const formFields = [fullNameInput, emailInput, subjectInput, messageInput];

    formFields.forEach(field => {
        if (field) {
            const savedValue = localStorage.getItem(`portfolio_contact_${field.id}`);
            if (savedValue) {
                field.value = savedValue;
            }
            field.addEventListener('input', () => {
                localStorage.setItem(`portfolio_contact_${field.id}`, field.value);
            });
        }
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
            document.querySelectorAll('.form__input, .form__textarea').forEach(el => el.classList.remove('error'));
            if (formStatusAlert) {
                formStatusAlert.className = 'form-status-alert';
                formStatusAlert.textContent = '';
            }

            if (fullNameInput && fullNameInput.value.trim() === '') {
                const err = document.getElementById('nameError');
                if (err) err.textContent = 'Full name is required.';
                fullNameInput.classList.add('error');
                isValid = false;
            }

            if (emailInput) {
                if (emailInput.value.trim() === '') {
                    const err = document.getElementById('emailError');
                    if (err) err.textContent = 'Email address is required.';
                    emailInput.classList.add('error');
                    isValid = false;
                } else if (!validateEmail(emailInput.value.trim())) {
                    const err = document.getElementById('emailError');
                    if (err) err.textContent = 'Please enter a valid email address.';
                    emailInput.classList.add('error');
                    isValid = false;
                }
            }

            if (subjectInput && subjectInput.value.trim() === '') {
                const err = document.getElementById('subjectError');
                if (err) err.textContent = 'Subject is required.';
                subjectInput.classList.add('error');
                isValid = false;
            }

            if (messageInput && messageInput.value.trim() === '') {
                const err = document.getElementById('messageError');
                if (err) err.textContent = 'Message is required.';
                messageInput.classList.add('error');
                isValid = false;
            }

            if (isValid) {
                const submitBtn = document.getElementById('submitBtn');
                const originalBtnContent = submitBtn ? submitBtn.innerHTML : '';

                if (submitBtn) {
                    submitBtn.innerHTML = `<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
                    submitBtn.disabled = true;
                }

                // Simulate successful form submission or integrate with EmailJS here
                setTimeout(() => {
                    formFields.forEach(field => {
                        if (field) {
                            localStorage.removeItem(`portfolio_contact_${field.id}`);
                        }
                    });
                    contactForm.reset();

                    if (successModal) {
                        successModal.classList.add('active');
                    }

                    if (submitBtn) {
                        submitBtn.innerHTML = originalBtnContent;
                        submitBtn.disabled = false;
                    }
                }, 1000);
            } else {
                if (formStatusAlert) {
                    formStatusAlert.className = 'form-status-alert error';
                    formStatusAlert.textContent = 'Please correct the highlighted errors above.';
                }
            }
        });
    }

    if (successModalClose && successModal) {
        successModalClose.addEventListener('click', () => {
            successModal.classList.remove('active');
        });
    }

    if (successModal) {
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                successModal.classList.remove('active');
            }
        });
    }

    /* ==========================================
       12. INTERSECTION OBSERVER FOR SCROLL REVEALS
       ================================---------- */
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ==========================================
       13. SCROLL-TO-TOP BUTTON
       ================================---------- */
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    window.addEventListener('scroll', () => {
        if (scrollTopBtn) {
            if (window.scrollY > 400) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        }
    });

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

});