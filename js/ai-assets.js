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
    // Coverflow UI with 5 elements total for smooth coming-in and fading-out
    lightbox.innerHTML = `
        <div class="lightbox-close">&times;</div>
        <div class="lightbox-container">
            <div class="lightbox-arrow lightbox-prev">&#10094;</div>
            <div class="lightbox-gallery">
                <img src="" class="gallery-item" id="gallery-prev2" alt="Hidden Left">
                <img src="" class="gallery-item" id="gallery-prev" alt="Previous">
                <img src="" class="gallery-item" id="gallery-main" alt="Current">
                <img src="" class="gallery-item" id="gallery-next" alt="Next">
                <img src="" class="gallery-item" id="gallery-next2" alt="Hidden Right">
            </div>
            <div class="lightbox-arrow lightbox-next">&#10095;</div>
        </div>
    `;
    document.body.appendChild(lightbox);

    let activeLightboxIndex = 0;
    let lightboxTimer = null;

    // Grab the 5 physical image nodes from DOM
    let galleryItems = [
        lightbox.querySelector('#gallery-prev2'),
        lightbox.querySelector('#gallery-prev'),
        lightbox.querySelector('#gallery-main'),
        lightbox.querySelector('#gallery-next'),
        lightbox.querySelector('#gallery-next2')
    ];

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

    const renderLightboxImages = (index) => {
        const len = assets.length;
        galleryItems[0].src = assets[(index - 2 + len) % len];
        galleryItems[1].src = assets[(index - 1 + len) % len];
        galleryItems[2].src = assets[index];
        galleryItems[3].src = assets[(index + 1) % len];
        galleryItems[4].src = assets[(index + 2) % len];
        activeLightboxIndex = index;
    };

    const slideTo = (direction) => {
        if (assets.length === 0) return;
        const len = assets.length;

        const newIndex = direction === 'next'
            ? (activeLightboxIndex + 1) % len
            : (activeLightboxIndex - 1 + len) % len;

        // Cyclically shift the DOM elements array depending on direction
        if (direction === 'next') {
            let first = galleryItems.shift();
            galleryItems.push(first);
        } else {
            let last = galleryItems.pop();
            galleryItems.unshift(last);
        }

        // Re-assign CSS IDs to their new positions to physically trigger the 3D transitions
        const ids = ['gallery-prev2', 'gallery-prev', 'gallery-main', 'gallery-next', 'gallery-next2'];
        galleryItems.forEach((item, i) => {
            item.id = ids[i];

            // Re-assign click events correctly based on their current visible role
            item.onclick = null; // reset
            if (ids[i] === 'gallery-prev') {
                item.onclick = () => { slideTo('prev'); resetTimer(); };
            } else if (ids[i] === 'gallery-next') {
                item.onclick = () => { slideTo('next'); resetTimer(); };
            }
        });

        // Now populate the image srcs correctly so they are ready before they slide in
        galleryItems[0].src = assets[(newIndex - 2 + len) % len];
        galleryItems[1].src = assets[(newIndex - 1 + len) % len];
        galleryItems[2].src = assets[newIndex];
        galleryItems[3].src = assets[(newIndex + 1) % len];
        galleryItems[4].src = assets[(newIndex + 2) % len];

        activeLightboxIndex = newIndex;
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

    // Initial click assignments for the side clones
    galleryItems[1].onclick = () => { slideTo('prev'); resetTimer(); };
    galleryItems[3].onclick = () => { slideTo('next'); resetTimer(); };

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
