const fs = require('fs');
const https = require('https');
const path = require('path');

const url = process.argv[2];
const outDir = process.argv[3];

if (!url || !outDir) {
    console.error('Usage: node extract-behance.cjs <url> <outDir>');
    process.exit(1);
}

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

https.get(url, {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
}, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        // Regex to match Behance project images
        const regex = /https:\/\/mir-s3-cdn-cf\.behance\.net\/project_modules\/[\w-]+\/[\w-]+\.(jpg|png|webp)/g;
        // or just look for the high-res 1400/max ones
        const regexMax = /https:\/\/mir-s3-cdn-cf\.behance\.net\/project_modules\/1400[\w_]*\/[\w-]+\.(jpg|png|webp)/g;

        let matches = data.match(regexMax);
        if (!matches) {
            matches = data.match(regex);
        }

        if (!matches) {
            console.log('No matches found. The page might require JS rendering.');
            process.exit(0);
        }

        matches = Array.from(new Set(matches));
        console.log(`Found ${matches.length} unique large images.`);

        matches.forEach((imgUrl, i) => {
            // Force https if missing
            if (imgUrl.startsWith('//')) imgUrl = 'https:' + imgUrl;

            const ext = path.extname(imgUrl.split('?')[0]);
            const filename = `img_${i.toString().padStart(2, '0')}${ext}`;
            const dest = path.join(outDir, filename);

            const file = fs.createWriteStream(dest);
            https.get(imgUrl, (response) => {
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    console.log(`Downloaded: ${filename}`);
                });
            }).on('error', (err) => {
                fs.unlink(dest, () => { });
                console.error(`Error downloading ${imgUrl}: ${err.message}`);
            });
        });
    });
}).on('error', (err) => {
    console.error(`Error fetching URL: ${err.message}`);
});
