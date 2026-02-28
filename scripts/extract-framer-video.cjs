const fs = require('fs');
const https = require('https');
const path = require('path');

const url = process.argv[2];

if (!url) {
    console.error('Usage: node extract-framer-video.cjs <url>');
    process.exit(1);
}

https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        // Look for mp4 URLs
        const regex = /https:\/\/framerusercontent\.com\/[a-zA-Z0-9\/_-]+\.mp4/g;
        const matches = Array.from(new Set(data.match(regex) || []));

        console.log(`Found ${matches.length} unique videos.`);

        matches.forEach((vidUrl, i) => {
            console.log(`Video ${i}: ${vidUrl}`);
        });
    });
}).on('error', (err) => {
    console.error(`Error fetching URL: ${err.message}`);
});
