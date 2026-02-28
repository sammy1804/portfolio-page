const { chromium } = require('playwright');
const path = require('path');

async function recordPage(url, outputName) {
    console.log(`Recording ${url}...`);
    const browser = await chromium.launch();
    const context = await browser.newContext({
        recordVideo: {
            dir: 'assets/images/z42_new',
            size: { width: 1440, height: 900 }
        },
        viewport: { width: 1440, height: 900 }
    });

    const page = await context.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });

    // Scroll down slowly
    for (let i = 0; i < 5; i++) {
        await page.mouse.wheel(0, 600);
        await page.waitForTimeout(1000);
    }
    // Scroll back up
    for (let i = 0; i < 5; i++) {
        await page.mouse.wheel(0, -600);
        await page.waitForTimeout(500);
    }

    await page.waitForTimeout(2000); // Give it a moment to finish recording

    const videoPath = await page.video().path();
    await context.close();
    await browser.close();

    // Rename the video file
    const fs = require('fs');
    const newPath = path.join('assets/images/z42_new', outputName);
    fs.renameSync(videoPath, newPath);
    console.log(`Saved video to ${newPath}`);
}

(async () => {
    try {
        await recordPage('https://samridhi.framer.website/z42', 'z42_home.webm');
        await recordPage('https://samridhi.framer.website/z42-2', 'z42_about.webm');
    } catch (err) {
        console.error(err);
    }
})();
