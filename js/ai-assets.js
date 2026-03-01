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
        getAssetUrl("about-backpack.png"),
        getAssetUrl("10k-icon.png"),
        getAssetUrl("arch-icon.png"),
        getAssetUrl("banjaro-ui.png"),
        getAssetUrl("hobby-backpack.png"),
        getAssetUrl("hobby-headphones.png"),
        getAssetUrl("hobby-lamp.png"),
        getAssetUrl("hobby-microphone.png"),
        getAssetUrl("hobby-skateboard.png"),
        getAssetUrl("hobby-sneakers.png"),
        getAssetUrl("hobby-table.png"),
        getAssetUrl("intract-icon.png"),
        getAssetUrl("z42-icon-2.png"),
        getAssetUrl("banjaro-hover-1.png"),
        getAssetUrl("mobile-auto-3d.png"),
        getAssetUrl("toy-museum-int.png"),
        getAssetUrl("toy-museum-ext.png"),
        getAssetUrl("z42-card-website.png"),
        getAssetUrl("z42labs.png"),
        getAssetUrl("intract-card.png"),
        getAssetUrl("banjaro-hover-2.png")
    ];

    // Responsive item sizing (matching updated CSS sizes)
    const isMobile = window.innerWidth <= 768;
    const itemWidth = isMobile ? 80 : 120;
    const itemHeight = isMobile ? 80 : 120;

    // Tighter gap between items to match thiings.co dense look
    const gapX = isMobile ? 16 : 24;
    const gapY = isMobile ? 16 : 24;

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
        // Horizontal checks
        if (c > 0 && gridAssignment[r][c - 1] === asset) return false;
        if (c > 1 && gridAssignment[r][c - 2] === asset) return false;
        // Vertical checks
        if (r > 0 && gridAssignment[r - 1][c] === asset) return false;
        if (r > 1 && gridAssignment[r - 2][c] === asset) return false;
        // Diagonal checks
        if (r > 0 && c > 0 && gridAssignment[r - 1][c - 1] === asset) return false;
        if (r > 0 && c < numCols - 1 && gridAssignment[r - 1][c + 1] === asset) return false;
        return true;
    };

    for (let row = 0; row < numRows; row++) {
        gridAssignment[row] = [];
        for (let col = 0; col < numCols; col++) {

            // Pick a random asset that doesn't conflict
            let chosenAsset = null;
            let attempts = 0;
            // Shuffle assets and find the first one that fits the rules
            while (!chosenAsset && attempts < 50) {
                let candidate = assets[Math.floor(Math.random() * assets.length)];
                if (isValid(row, col, candidate)) {
                    chosenAsset = candidate;
                }
                attempts++;
            }
            // Fallback just in case rules are too tight
            if (!chosenAsset) chosenAsset = assets[Math.floor(Math.random() * assets.length)];

            gridAssignment[row][col] = chosenAsset;

            const el = document.createElement('div');
            el.className = 'asset-item';

            const img = document.createElement('img');
            img.src = chosenAsset;
            img.alt = 'AI Asset';

            // Give them a slight non-linear random offset within the grid to look "scattered" 
            const offsetLimit = isMobile ? 20 : 50;
            const randomOffsetX = (Math.random() - 0.5) * offsetLimit;
            const randomOffsetY = (Math.random() - 0.5) * offsetLimit;

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

    // Kick off animation and start with an initial offset in the middle
    targetX = window.innerWidth / 2;
    targetY = window.innerHeight / 2;
    update();
}
