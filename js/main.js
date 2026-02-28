// ====================================
//  SAMRIDHI PORTFOLIO — Main JS
// ====================================

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initNavScroll();
    initHeroScroll();
    initHobbies();
    initWorkFilters();
    initJourneyHovers();
    initScrollReveal();
    initSkillsClone();
    initSkillsGlow();
    initWorkScroll();
});

// ====================================
//  LOADER
// ====================================
function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;
    window.addEventListener('load', () => {
        setTimeout(() => loader.classList.add('loaded'), 2000);
    });
    setTimeout(() => loader.classList.add('loaded'), 4000);
}

// ====================================
//  NAV — scroll → pill shape
// ====================================
function initNavScroll() {
    const nav = document.getElementById('nav');
    if (!nav) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > window.innerHeight * 0.35) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }, { passive: true });
}

// ====================================
//  HERO SCROLL
//   - Frame (fullscreen → shrink to ~500×356 card)
//   - Photo scales to 0.75×
//   - Title & scroll hint fade out
//   - 5 floating cards slide in from edges
// ====================================
function initHeroScroll() {
    const hero = document.querySelector('.hero');
    const frame = document.getElementById('hero-frame');
    const photo = document.querySelector('.hero__photo');
    const heroText = document.querySelector('.hero__text');
    const floatCards = document.querySelectorAll('.hero__float-card');

    if (!hero || !frame) return;

    const handleScroll = () => {
        const rect = hero.getBoundingClientRect();
        const scrolled = -rect.top;
        const vh = window.innerHeight;
        const vw = window.innerWidth;

        // Progress: 0 → 1 over 1.5× viewport height
        const progress = Math.max(0, Math.min(1, scrolled / (vh * 1.5)));

        // ── FRAME: shrink from fullscreen to ~456×314 centered, shifted up 84px ──
        // Target dimensions (380×1.12 + 30px width, 280×1.12 height)
        const targetW = Math.min(456, vw * 0.32);
        const targetH = 314;

        // Interpolated width/height
        const frameW = vw - progress * (vw - targetW);
        const frameH = vh - progress * (vh - targetH);

        // Border radius: 0 → 24px
        const radius = progress * 24;

        // Shift upward by 84px at full scroll
        const offsetY = progress * -84;

        frame.style.width = `${frameW}px`;
        frame.style.height = `${frameH}px`;
        frame.style.borderRadius = `${radius}px`;
        frame.style.marginTop = `${offsetY}px`;

        // ── PHOTO: scale from 1 → 0.75 ──
        if (photo) {
            const photoScale = 1 - progress * 0.25;
            photo.style.transform = `scale(${photoScale})`;
        }

        // ── TITLE & SCROLL HINT: fade out quickly ──
        if (heroText) {
            heroText.style.opacity = Math.max(0, 1 - progress * 3);
        }

        // ── 5 FLOATING CARDS: slide in after 30% progress ──
        const cardStart = 0.3;
        const cardProgress = Math.max(0, Math.min(1, (progress - cardStart) / (1 - cardStart)));

        floatCards.forEach((card, i) => {
            const stagger = i * 0.06;
            const cp = Math.max(0, Math.min(1, (cardProgress - stagger) / (1 - stagger)));
            const eased = 1 - Math.pow(1 - cp, 3);

            card.style.opacity = eased;

            switch (i) {
                case 0: // Maintain Streaks — from left
                    card.style.transform = `translateX(${-250 * (1 - eased)}px) rotate(${-5 * (1 - eased)}deg)`;
                    break;
                case 1: // Daily Visit — from right
                    card.style.transform = `translateX(${250 * (1 - eased)}px) rotate(${4 * (1 - eased)}deg)`;
                    break;
                case 2: // Refer & Earn — from bottom-left
                    card.style.transform = `translate(${-200 * (1 - eased)}px, ${150 * (1 - eased)}px) rotate(${-3 * (1 - eased)}deg)`;
                    break;
                case 3: // Follow Socials — from bottom
                    card.style.transform = `translateY(${200 * (1 - eased)}px) rotate(${2 * (1 - eased)}deg)`;
                    break;
                case 4: // Humanity Score — from right
                    card.style.transform = `translate(${200 * (1 - eased)}px, ${100 * (1 - eased)}px) rotate(${3 * (1 - eased)}deg)`;
                    break;
            }
        });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
}

// ====================================
//  HOBBIES section (scroll-driven)
// ====================================
function initHobbies() {
    const section = document.querySelector('.hobbies');
    const slides = document.querySelectorAll('.hobbies__slide');
    const faces = document.querySelectorAll('.hobbies__flip-face');
    const glow = document.querySelector('.hobbies__glow');

    if (!section || slides.length === 0) return;

    const numSlides = slides.length;
    let activeIndex = 0;

    const handleScroll = () => {
        const rect = section.getBoundingClientRect();
        const sectionHeight = section.offsetHeight;
        const vh = window.innerHeight;
        const scrolled = -rect.top;

        const totalScroll = sectionHeight - vh;
        const progress = Math.max(0, Math.min(1, scrolled / totalScroll));

        // Determine which slide is active
        const newIndex = Math.min(numSlides - 1, Math.floor(progress * numSlides));

        if (newIndex !== activeIndex) {
            // Icon slides
            slides[activeIndex]?.classList.remove('is-active');
            slides[newIndex]?.classList.add('is-active');

            // Text flipper — flip out old face, flip in new
            const oldFace = faces[activeIndex];
            const newFace = faces[newIndex];
            if (oldFace) {
                oldFace.classList.remove('is-active');
                oldFace.classList.add('is-exiting');
                setTimeout(() => oldFace.classList.remove('is-exiting'), 600);
            }
            if (newFace) {
                newFace.classList.add('is-active');
            }

            activeIndex = newIndex;
        }

        // Parallax on active slide's icons
        const slideProgress = (progress * numSlides) - newIndex;
        const activeSlide = slides[newIndex];
        if (activeSlide) {
            const icons = activeSlide.querySelectorAll('.hobbies__icon');
            icons.forEach((icon, i) => {
                const speed = i === 0 ? 0.3 : 0.2;
                const yOffset = slideProgress * speed * vh * 0.3;
                icon.style.transform = `translateY(${-yOffset}px)`;
            });
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ── Red glow follows mouse anywhere in section ──
    section.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });
}

// ====================================
//  WORK FILTERS
// ====================================
function initWorkFilters() {
    const filters = document.querySelectorAll('.work__filter');
    const items = document.querySelectorAll('.work__item');

    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            filters.forEach(f => f.classList.remove('work__filter--active'));
            btn.classList.add('work__filter--active');
            const filter = btn.dataset.filter;

            items.forEach((item, index) => {
                const categories = item.dataset.category || '';
                if (filter === 'all' || categories.includes(filter)) {
                    item.classList.remove('hidden');
                    item.style.animation = `fadeInUp 0.5s ${index * 0.08}s ease forwards`;
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });
}

// ====================================
//  JOURNEY HOVER CARDS
// ====================================
// ====================================
//  JOURNEY HOVERS (Wabi.ai Style)
// ====================================
function initJourneyHovers() {
    const highlights = document.querySelectorAll('.journey__highlight');
    const hoverGlass = document.getElementById('journey-hover-glass');

    if (!highlights.length || !hoverGlass) return;

    let activeImages = [];
    let targetX = 0, targetY = 0;
    let smoothX = 0, smoothY = 0;
    let isTracking = false;

    // Smooth lerping for the floating effect
    function animate() {
        if (!isTracking && !activeImages.length) return;

        // Lerp towards target
        smoothX += (targetX - smoothX) * 0.1;
        smoothY += (targetY - smoothY) * 0.1;

        activeImages.forEach((img, i) => {
            // Apply different parallax speeds/directions to make it feel organic
            const speed = 0.04 + (i * 0.02);
            const dirX = i % 2 === 0 ? 1 : -1;
            const dirY = i % 2 === 0 ? -1 : 1;

            // Note: Transform applies on top of their absolute layout placement in CSS
            img.style.transform = `translate(${smoothX * speed * dirX}px, ${smoothY * speed * dirY}px) scale(1)`;
        });

        requestAnimationFrame(animate);
    }

    highlights.forEach(highlight => {
        highlight.addEventListener('mouseenter', (e) => {
            const imgId = highlight.dataset.hover;
            const imgs = hoverGlass.querySelectorAll(`.journey__hover-img[data-img="${imgId}"]`);

            // Hide previous active images
            activeImages.forEach(img => img.classList.remove('visible'));

            if (!imgs.length) {
                activeImages = [];
                isTracking = false;
                const journeySection = document.getElementById('journey');
                if (journeySection) {
                    journeySection.classList.remove('is-hovering');
                    journeySection.classList.remove('is-dark-theme');
                    journeySection.removeAttribute('data-active-hover');
                }
                return;
            }

            activeImages = Array.from(imgs);

            // Set initial mouse position
            const rect = hoverGlass.getBoundingClientRect();
            targetX = e.clientX - rect.width / 2;
            targetY = e.clientY - rect.height / 2;

            // If we weren't tracking before, snap smoothX/Y so they don't fly in from corner
            if (!isTracking) {
                smoothX = targetX;
                smoothY = targetY;
                const journeySection = document.getElementById('journey');
                if (journeySection) journeySection.classList.add('is-hovering');
            }

            const journeySection = document.getElementById('journey');
            if (journeySection) {
                const darkTriggers = ['shifting-scale'];
                if (darkTriggers.includes(imgId)) {
                    journeySection.classList.add('is-dark-theme');
                } else {
                    journeySection.classList.remove('is-dark-theme');
                }
                journeySection.setAttribute('data-active-hover', imgId);
            }

            activeImages.forEach(img => {
                img.classList.add('visible');
                // Ensure initial transform matches so it doesn't jump
                const i = activeImages.indexOf(img);
                const speed = 0.04 + (i * 0.02);
                const dirX = i % 2 === 0 ? 1 : -1;
                const dirY = i % 2 === 0 ? -1 : 1;
                img.style.transform = `translate(${smoothX * speed * dirX}px, ${smoothY * speed * dirY}px) scale(1)`;
            });

            // Mark the active highlight text
            highlights.forEach(h => h.classList.remove('is-active'));
            highlight.classList.add('is-active');

            if (!isTracking) {
                isTracking = true;
                animate();
            }
        });

        highlight.addEventListener('mouseleave', () => {
            highlight.classList.remove('is-active');
            activeImages.forEach(img => img.classList.remove('visible'));
            activeImages = [];
            isTracking = false;

            const journeySection = document.getElementById('journey');
            if (journeySection) {
                journeySection.classList.remove('is-hovering');
                journeySection.classList.remove('is-dark-theme');
            }
        });
    });

    // Track mouse globally while active
    document.addEventListener('mousemove', (e) => {
        if (!isTracking) return;
        const rect = hoverGlass.getBoundingClientRect();
        targetX = e.clientX - rect.width / 2;
        targetY = e.clientY - rect.height / 2;
    });

    const journeySection = document.getElementById('journey');

    // Also dim text when hovering over scribbles (which might not trigger images but still act as interactives)
    const scribbles = document.querySelectorAll('.journey__scribble');
    scribbles.forEach(scribble => {
        scribble.addEventListener('mouseenter', () => {
            if (journeySection) journeySection.classList.add('is-hovering');
            scribble.classList.add('is-active');
        });
        scribble.addEventListener('mouseleave', () => {
            if (journeySection && !isTracking) journeySection.classList.remove('is-hovering');
            scribble.classList.remove('is-active');
        });
    });

    // Hide if clicking outside or leaving the journey section
    if (journeySection) {
        journeySection.addEventListener('mouseleave', () => {
            activeImages = [];
            isTracking = false;
            journeySection.classList.remove('is-hovering');
            journeySection.classList.remove('is-dark-theme');
        });
    }
}

// ====================================
//  SCROLL REVEAL
// ====================================
function initScrollReveal() {
    const targets = document.querySelectorAll(
        '.about__heading, .about__bio, .about__tags, ' +
        '.work__header, .work__filters, .work__item, ' +
        '.skills__header, ' +
        '.journey__header, .journey__text p, ' +
        '.bento__item, ' +
        '.footer__heading, .footer__subtext, .footer__cta'
    );
    targets.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    targets.forEach(el => observer.observe(el));
}

// ====================================
//  SKILLS CLONE
// ====================================
function initSkillsClone() {
    const reel = document.querySelector('.skills__reel');
    if (!reel) return;
    const frames = reel.querySelectorAll('.skills__frame');
    frames.forEach(frame => reel.appendChild(frame.cloneNode(true)));
}

// ====================================
//  SKILLS BACKGROUND GLOW
// ====================================
function initSkillsGlow() {
    const skillsSection = document.getElementById('skills');
    const glow = document.querySelector('.skills__bg-glow');

    if (!skillsSection || !glow) return;

    skillsSection.addEventListener('mousemove', (e) => {
        // Since glow is inside a sticky full-viewport container,
        // we can directly map window clientX/Y to the element
        const x = e.clientX;
        const y = e.clientY;

        // Update CSS variables on the glow element
        glow.style.setProperty('--mouse-x', `${x}px`);
        glow.style.setProperty('--mouse-y', `${y}px`);
    });
}

// ====================================
//  UTILITY
// ====================================
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);

// ====================================
//  WORK SCROLL (FLAT)
// ====================================
function initWorkScroll() {
    const cards = document.querySelectorAll('.work__card');
    const sidebarTags = document.getElementById('work-sidebar-tags');
    const sidebarDesc = document.getElementById('work-sidebar-desc');
    const sidebarNote = document.getElementById('work-sidebar-note');
    const sidebarTitle = document.getElementById('work-sidebar-title');
    const leftSidebar = document.querySelector('.work__sidebar-left');
    const rightSidebar = document.querySelector('.work__sidebar-right');

    if (cards.length === 0 || !sidebarTags || !leftSidebar || !rightSidebar) return;

    const observerOptions = {
        root: null,
        rootMargin: '-40% 0px -40% 0px', // Triggers when element is precisely in the middle 20% of height
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;

                // Fade out text first
                leftSidebar.style.opacity = '0';
                rightSidebar.style.opacity = '0';

                // Wait for fade out, then swap text and fade back in
                setTimeout(() => {
                    if (card.dataset.tags) sidebarTags.innerHTML = card.dataset.tags;
                    if (card.dataset.desc) sidebarDesc.innerHTML = card.dataset.desc;
                    if (card.dataset.rightText) sidebarNote.innerHTML = card.dataset.rightText;
                    if (card.dataset.title) sidebarTitle.innerHTML = card.dataset.title;

                    leftSidebar.style.opacity = '1';
                    rightSidebar.style.opacity = '1';
                }, 300); // matches the 0.5s fade, but swaps text just before it's fully gone/visible
            }
        });
    }, observerOptions);

    cards.forEach(card => observer.observe(card));
}
