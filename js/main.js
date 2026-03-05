// ====================================
//  SAMRIDHI PORTFOLIO — Main JS
// ====================================

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initNavScroll();
    initNavToggle();
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
//  NAV TOGGLE (Show/Hide Sections)
// ====================================
function initNavToggle() {
    const workLink = document.getElementById('nav-work-link');
    const logoLink = document.getElementById('nav-logo-link');

    const sectionsToToggle = [
        document.getElementById('hero'),
        document.getElementById('journey'),
        document.getElementById('skills')
    ];

    if (!workLink || !logoLink) return;

    // Show only work section
    workLink.addEventListener('click', (e) => {
        // e.preventDefault(); // allow it to scroll to #work if needed, or keep preventDefault
        sectionsToToggle.forEach(sec => {
            if (sec) sec.style.display = 'none';
        });
        // We ensure work section is visible and we scroll to it
        const workSection = document.getElementById('work');
        if (workSection) {
            workSection.style.display = 'block';
            workSection.scrollIntoView({ behavior: 'smooth' });
        }
    });

    // Show all sections
    logoLink.addEventListener('click', (e) => {
        e.preventDefault();
        sectionsToToggle.forEach(sec => {
            if (sec) sec.style.display = ''; // revert to default css display
        });
        const workSection = document.getElementById('work');
        if (workSection) workSection.style.display = '';

        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
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
    const blocks = document.querySelectorAll('.journey__block');
    const hoverGlass = document.getElementById('journey-hover-glass');
    const journeySection = document.getElementById('journey');

    if (!blocks.length || !hoverGlass || !journeySection) return;

    let activeImages = [];
    let targetX = 0, targetY = 0;
    let smoothX = 0, smoothY = 0;
    let isTracking = false;
    let currentActiveBlock = null;

    // Smooth lerping for the floating effect
    function animate() {
        if (!isTracking && !activeImages.length) return;

        smoothX += (targetX - smoothX) * 0.1;
        smoothY += (targetY - smoothY) * 0.1;

        activeImages.forEach((img, i) => {
            const speed = 0.04 + (i * 0.02);
            const dirX = i % 2 === 0 ? 1 : -1;
            const dirY = i % 2 === 0 ? -1 : 1;
            img.style.transform = `translate(${smoothX * speed * dirX}px, ${smoothY * speed * dirY}px) scale(1)`;
        });

        requestAnimationFrame(animate);
    }

    function activateBlock(block, mouseX, mouseY) {
        if (currentActiveBlock === block) return;
        currentActiveBlock = block;

        const highlights = block.querySelectorAll('.journey__highlight');
        let imgIds = Array.from(highlights).map(h => h.dataset.hover).filter(Boolean);

        // Hide previous
        activeImages.forEach(img => img.classList.remove('visible'));

        if (!imgIds.length) {
            activeImages = [];
            journeySection.classList.remove('is-hovering', 'is-dark-theme');
            journeySection.removeAttribute('data-active-hover');
            return;
        }

        // Gather all matching images for this block
        const imgs = [];
        imgIds.forEach(id => {
            const foundImgs = hoverGlass.querySelectorAll(`.journey__hover-img[data-img="${id}"]`);
            foundImgs.forEach(img => imgs.push(img));
        });

        activeImages = Array.from(new Set(imgs)); // unique

        if (!activeImages.length) {
            journeySection.classList.remove('is-hovering', 'is-dark-theme');
            journeySection.removeAttribute('data-active-hover');
            return;
        }

        const rect = hoverGlass.getBoundingClientRect();
        targetX = mouseX !== undefined ? mouseX - rect.width / 2 : 0;
        targetY = mouseY !== undefined ? mouseY - rect.height / 2 : 0;

        if (!isTracking) {
            smoothX = targetX;
            smoothY = targetY;
            journeySection.classList.add('is-hovering');
        } else {
            journeySection.classList.add('is-hovering');
        }

        const darkTriggers = ['shifting-scale'];
        const isDark = imgIds.some(id => darkTriggers.includes(id));
        if (isDark) journeySection.classList.add('is-dark-theme');
        else journeySection.classList.remove('is-dark-theme');

        journeySection.setAttribute('data-active-hover', imgIds.join(' '));

        activeImages.forEach((img, i) => {
            img.classList.add('visible');
            const speed = 0.04 + (i * 0.02);
            const dirX = i % 2 === 0 ? 1 : -1;
            const dirY = i % 2 === 0 ? -1 : 1;
            img.style.transform = `translate(${smoothX * speed * dirX}px, ${smoothY * speed * dirY}px) scale(1)`;
        });

        // Toggle highlights
        document.querySelectorAll('.journey__highlight').forEach(h => h.classList.remove('is-active'));
        highlights.forEach(h => h.classList.add('is-active'));

        if (!isTracking) {
            isTracking = true;
            animate();
        }
    }

    function deactivateAll() {
        currentActiveBlock = null;
        document.querySelectorAll('.journey__highlight').forEach(h => h.classList.remove('is-active'));
        activeImages.forEach(img => img.classList.remove('visible'));
        activeImages = [];
        isTracking = false;
        journeySection.classList.remove('is-hovering', 'is-dark-theme');
        journeySection.removeAttribute('data-active-hover');
    }

    blocks.forEach(block => {
        // Activate on mouseenter (hover)
        block.addEventListener('mouseenter', (e) => {
            activateBlock(block, e.clientX, e.clientY);
        });
    });

    document.addEventListener('mousemove', (e) => {
        if (!isTracking) return;
        const rect = hoverGlass.getBoundingClientRect();
        targetX = e.clientX - rect.width / 2;
        targetY = e.clientY - rect.height / 2;
    });

    // Deactivate when mouse fully leaves the entire journey section
    journeySection.addEventListener('mouseleave', () => {
        deactivateAll();
    });

    // Dim text logic for scribbles
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

    // Scroll Logic
    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -40% 0px', // triggers when the block enters the center part of the viewport
        threshold: 0.1
    };
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // If the user's mouse is not actively inside the journey section controlling things,
                // let the scroll seamlessly activate the in-view block.
                if (!journeySection.matches(':hover')) {
                    activateBlock(entry.target);
                }
            }
        });
    }, observerOptions);

    blocks.forEach(block => scrollObserver.observe(block));

    // Cleanup when journey section is entirely scrolled out of view
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                deactivateAll();
            }
        });
    }, { threshold: 0 });
    sectionObserver.observe(journeySection);
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
