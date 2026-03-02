document.addEventListener('DOMContentLoaded', () => {
    initInfiniteCanvas();
});

function initInfiniteCanvas() {
    const canvas = document.getElementById('assets-canvas');
    const grid = document.getElementById('assets-grid');
    if (!canvas || !grid) return;

    // Helper function to resolve URLs so Vite bundles them properly in production
    const getAssetUrl = (name) => new URL(`../assets/images/${name}`, import.meta.url).href;

    // Ordered list of the AI Assets provided by user
    const assets = [
        getAssetUrl("ai-assets/ai_asset_1.png"),
        getAssetUrl("ai-assets/ai_asset_2.png"),
        getAssetUrl("ai-assets/ai_asset_3.png"),
        getAssetUrl("ai-assets/ai_asset_4.png"),
        getAssetUrl("ai-assets/ai_asset_5.png"),
        getAssetUrl("ai-assets/ai_asset_6.png"),
        getAssetUrl("ai-assets/ai_asset_7.png"),
        getAssetUrl("ai-assets/ai_asset_8.png"),
        getAssetUrl("ai-assets/ai_asset_9.png"),
        getAssetUrl("ai-assets/ai_asset_10.png"),
        getAssetUrl("ai-assets/ai_asset_11.png"),
        getAssetUrl("ai-assets/ai_asset_12.png"),
        getAssetUrl("ai-assets/ai_asset_13.png"),
        getAssetUrl("ai-assets/ai_asset_14.png"),
        getAssetUrl("ai-assets/ai_asset_15.png"),
        getAssetUrl("ai-assets/ai_asset_16.png"),
        getAssetUrl("ai-assets/ai_asset_17.png"),
        getAssetUrl("ai-assets/ai_asset_18.png"),
        getAssetUrl("ai-assets/ai_asset_19.png"),
        getAssetUrl("ai-assets/ai_asset_20.png"),
        getAssetUrl("ai-assets/ai_asset_21.png"),
        getAssetUrl("ai-assets/ai_asset_22.png"),
        getAssetUrl("ai-assets/ai_asset_23.png"),
        getAssetUrl("ai-assets/ai_asset_24.png"),
        getAssetUrl("ai-assets/ai_asset_25.png"),
        getAssetUrl("ai-assets/ai_asset_26.png"),
        getAssetUrl("ai-assets/ai_asset_27.png"),
        getAssetUrl("ai-assets/ai_asset_28.png"),
        getAssetUrl("ai-assets/ai_asset_29.png"),
        getAssetUrl("ai-assets/ai_asset_30.png")
    ];

    // Responsive item sizing & tighter spacing for clean masonry layout
    const isMobile = window.innerWidth <= 768;
    const itemWidth = isMobile ? 100 : 160;
    const itemHeight = isMobile ? 100 : 160;

    const gapX = isMobile ? 24 : 48;
    const gapY = isMobile ? 24 : 48;

    const cellW = itemWidth + gapX;
    const cellH = itemHeight + gapY;

    // We calculate a virtual grid larger than any typical monitor
    // We pad it by +2 on each axis to handle the wrapping without snapping on the bleeding edge
    const maxMonitorWidth = Math.max(window.innerWidth, 3000);
    const maxMonitorHeight = Math.max(window.innerHeight, 2000);

    const numCols = Math.ceil(maxMonitorWidth / cellW) + 2;
    const numRows = Math.ceil(maxMonitorHeight / cellH) + 2;

    const totalW = numCols * cellW;
    const totalH = numRows * cellH;

    let elements = [];

    // Function to shuffle the assets array for an organic distribution
    const shuffleArray = (arr) => arr.slice().sort(() => Math.random() - 0.5);

    // Scaffold the 2D plane with nodes
    const gridAssignment = [];

    // Check if an asset is valid for this spot (no identical repeats within distance 2)
    const isValid = (r, c, asset) => {
        if (c > 0 && gridAssignment[r][c - 1] === asset) return false;
        if (c > 1 && gridAssignment[r][c - 2] === asset) return false;
        if (r > 0 && gridAssignment[r - 1][c] === asset) return false;
        if (r > 1 && gridAssignment[r - 2][c] === asset) return false;
        if (r > 0 && c > 0 && gridAssignment[r - 1][c - 1] === asset) return false;
        if (r > 0 && c < numCols - 1 && gridAssignment[r - 1][c + 1] === asset) return false;
        return true;
    };

    let shuffledBag = shuffleArray(assets);
    let bagIndex = 0;

    for (let row = 0; row < numRows; row++) {
        gridAssignment[row] = [];
        for (let col = 0; col < numCols; col++) {

            // Pick next asset from the shuffled bag to guarantee equal distribution
            let chosenAsset = null;
            let attempts = 0;

            while (!chosenAsset && attempts < assets.length) {
                if (bagIndex >= shuffledBag.length) {
                    shuffledBag = shuffleArray(assets);
                    bagIndex = 0;
                }

                let candidate = shuffledBag[bagIndex];
                if (isValid(row, col, candidate)) {
                    chosenAsset = candidate;
                    bagIndex++;
                } else {
                    // Try the next one in the bag
                    bagIndex++;
                    attempts++;
                }
            }

            // Fallback just in case rules are too tight
            if (!chosenAsset) {
                chosenAsset = assets[Math.floor(Math.random() * assets.length)];
            }

            gridAssignment[row][col] = chosenAsset;

            const el = document.createElement('div');
            el.className = 'asset-item';

            // Assign data attribute for lightbox handling
            el.dataset.assetIndex = assets.indexOf(chosenAsset);

            const img = document.createElement('img');
            img.src = chosenAsset;
            img.alt = 'AI Asset';

            // No random offsets for a clean grid mapping like thiings.co 
            const randomOffsetX = 0;
            const randomOffsetY = 0;

            el.appendChild(img);
            grid.appendChild(el);

            elements.push({
                el: el,
                baseX: col * cellW + randomOffsetX,
                baseY: row * cellH + randomOffsetY
            });
        }
    }

    // Physics Engine variables
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    // 1. Mouse/Trackpad WHEEL PAN
    window.addEventListener('wheel', (e) => {
        // Delta speed multiplier for scrolling
        targetX -= e.deltaX * 1.5;
        targetY -= e.deltaY * 1.5;

        // Prevent default window scrolling behavior BUT allow native pinch-to-zoom (ctrlKey)
        if (!e.ctrlKey) {
            e.preventDefault();
        }
    }, { passive: false });

    // 2. MOUSE DRAG AND PAN
    let isDragging = false;
    let startX = 0, startY = 0;

    canvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        // Accumulate targets
        targetX += dx;
        targetY += dy;

        startX = e.clientX;
        startY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // 3. TOUCH PAN SUPPORT (Mobile Devices)
    canvas.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const dx = e.touches[0].clientX - startX;
        const dy = e.touches[0].clientY - startY;

        targetX += dx * 1.5;
        targetY += dy * 1.5;

        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchend', () => {
        isDragging = false;
    });

    // The point at which a node wraps to the other side off screen
    const viewportBufferX = cellW * 1.5;
    const viewportBufferY = cellH * 1.5;

    // Master Animation Loop
    function update() {
        // Lerp for buttery smooth momentum decay
        currentX += (targetX - currentX) * 0.08;
        currentY += (targetY - currentY) * 0.08;

        elements.forEach(item => {
            // Calculate absolute position based on panning
            let x = (item.baseX + currentX) % totalW;
            if (x < 0) x += totalW;

            let y = (item.baseY + currentY) % totalH;
            if (y < 0) y += totalH;

            // Teleport element from the trailing edge to the leading edge if shifted far enough
            // This happens OFF SCREEN, maintaining the seamless illusion
            if (x > totalW - viewportBufferX) x -= totalW;
            if (y > totalH - viewportBufferY) y -= totalH;

            // Apply 3D accelerated translation
            item.el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        });

        requestAnimationFrame(update);
    }

    // === LIGHTBOX LOGIC ===
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    // We create a slider track that holds exactly 3 images at all times (prev, current, next)
    lightbox.innerHTML = `
        <div class="lightbox-close">&times;</div>
        <div class="lightbox-container">
            <div class="lightbox-arrow lightbox-prev">&#10094;</div>
            <div class="lightbox-slider-wrapper">
                <div class="lightbox-slider-track">
                    <div class="lightbox-slide clone-left">
                        <img src="" class="lightbox-img-left" alt="Previous">
                    </div>
                    <div class="lightbox-slide slide-main">
                        <img src="" class="lightbox-img-main" alt="Current">
                    </div>
                    <div class="lightbox-slide clone-right">
                        <img src="" class="lightbox-img-right" alt="Next">
                    </div>
                </div>
            </div>
            <div class="lightbox-arrow lightbox-next">&#10095;</div>
        </div>
    `;
    document.body.appendChild(lightbox);

    let activeLightboxIndex = 0;
    let lightboxTimer = null;

    const resetTimer = () => {
        clearInterval(lightboxTimer);
        lightboxTimer = setInterval(() => {
            if (lightbox.classList.contains('active')) {
                slideTo('next');
            }
        }, 3000); // 3 seconds auto-scroll
    };

    const clearTimer = () => {
        clearInterval(lightboxTimer);
    };

    const track = lightbox.querySelector('.lightbox-slider-track');
    let isSliding = false;

    // Set initial track position
    track.style.transform = 'translateX(-33.333%)';

    const renderLightboxImages = (index) => {
        let prevIndex = (index - 1 + assets.length) % assets.length;
        let nextIndex = (index + 1) % assets.length;

        lightbox.querySelector('.lightbox-img-left').src = assets[prevIndex];
        lightbox.querySelector('.lightbox-img-main').src = assets[index];
        lightbox.querySelector('.lightbox-img-right').src = assets[nextIndex];

        activeLightboxIndex = index;

        // Ensure track is in center without animation
        track.style.transition = 'none';
        track.style.transform = 'translateX(-33.333%)';
    };

    const slideTo = (direction) => {
        if (isSliding || assets.length === 0) return;
        isSliding = true;

        const newIndex = direction === 'next'
            ? (activeLightboxIndex + 1) % assets.length
            : (activeLightboxIndex - 1 + assets.length) % assets.length;

        // Slide the track
        track.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
        track.style.transform = direction === 'next' ? 'translateX(-66.666%)' : 'translateX(0%)';

        // Wait for animation, then swap images instantly and snap back
        setTimeout(() => {
            renderLightboxImages(newIndex);
            isSliding = false;
        }, 600); // match CSS transition duration
    };

    lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
        lightbox.classList.remove('active');
        clearTimer();
    });

    lightbox.querySelector('.lightbox-prev').addEventListener('click', () => {
        slideTo('prev');
        resetTimer();
    });

    lightbox.querySelector('.lightbox-next').addEventListener('click', () => {
        slideTo('next');
        resetTimer();
    });

    lightbox.querySelector('.clone-left').addEventListener('click', () => {
        slideTo('prev');
        resetTimer();
    });

    lightbox.querySelector('.clone-right').addEventListener('click', () => {
        slideTo('next');
        resetTimer();
    });

    // Keyboard support
    window.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'ArrowLeft') {
            slideTo('prev');
            resetTimer();
        } else if (e.key === 'ArrowRight') {
            slideTo('next');
            resetTimer();
        } else if (e.key === 'Escape') {
            lightbox.classList.remove('active');
            clearTimer();
        }
    });

    // Detect Click vs Drag
    let dragDistance = 0;

    canvas.addEventListener('mousedown', () => { dragDistance = 0; });
    canvas.addEventListener('touchstart', () => { dragDistance = 0; }, { passive: true });

    window.addEventListener('mousemove', (e) => {
        if (isDragging) dragDistance += Math.abs(e.movementX) + Math.abs(e.movementY);
    });

    window.addEventListener('touchmove', (e) => {
        if (isDragging) dragDistance += 5;
    }, { passive: true });

    grid.addEventListener('click', (e) => {
        const item = e.target.closest('.asset-item');
        if (item && dragDistance < 15) {
            const idx = parseInt(item.dataset.assetIndex, 10);

            // Pre-set images instantly before showing
            renderLightboxImages(idx);

            lightbox.classList.add('active');
            resetTimer();
        }
    });

    // Kick off animation and start with an initial offset in the middle
    targetX = window.innerWidth / 2;
    targetY = window.innerHeight / 2;
    update();
}
