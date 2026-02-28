const fs = require('fs');
const https = require('https');
const path = require('path');

const urls = [
    "https://mir-s3-cdn-cf.behance.net/project_modules/2800_webp/e467a2227413803.683fa0f684d0e.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/max_3840_webp/ed1b94227413803.683fa0f493238.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/2800_webp/1f9df9227413803.683fa0f6838ea.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/2800_webp/90215b227413803.683fa0f68841a.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/2800_webp/e37e87227413803.683fa0f6847b6.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/2800_webp/9c9d4e227413803.683fa0f683ee6.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/2800_webp/d16f4f227413803.683fa0f687ed6.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/2800_webp/49dde1227413803.683fa0f687594.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/2800_webp/b5a195227413803.683fa0f688c98.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/2800_webp/dffa72227413803.683fa0f6865b8.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/2800_webp/4554de227413803.683fa0f689165.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/2800_webp/ceaf00227413803.683fa0f685c91.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/2800_webp/1e84ba227413803.683fa0f68a757.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/2800_webp/b92b31227413803.683fa0f689ea5.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/2800_webp/8a6d7f227413803.683fa0f685396.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/2800_webp/af213e227413803.683fa0f689948.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/2800_webp/4348ae227413803.683fa0f686dc3.jpg",
    "https://mir-cdn.behance.net/v1/rendition/project_modules/max_1200_webp/4c95f5227413803.683fa0f4929d8.gif"
];

const outDir = 'assets/images/banjaro';

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

urls.forEach((imgUrl, i) => {
    const filename = `img_${String(i + 1).padStart(2, '0')}.webp`;
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
