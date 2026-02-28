const fs = require('fs');
const https = require('https');
const path = require('path');

const url = process.argv[2];
const outDir = process.argv[3];

if (!url || !outDir) {
    console.error('Usage: node extract-framer.js <url> <outDir>');
    process.exit(1);
}

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        // Regex to match framerusercontent image URLs
        const regex = /https:\/\/framerusercontent\.com\/images\/[a-zA-Z0-9_-]+\.(png|jpg|jpeg|webp|gif)/g;
        const matches = Array.from(new Set(data.match(regex) || []));

        console.log(`Found ${matches.length} unique images.`);

        matches.forEach((imgUrl, i) => {
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
