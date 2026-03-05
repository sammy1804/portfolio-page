const fs = require('fs');

const aboutContent = fs.readFileSync('about.html', 'utf8');
const indexContent = fs.readFileSync('index.html', 'utf8');

if (indexContent.includes('<!-- ===== SECTION 7: MY JOURNEY ===== -->')) {
    console.log('Journey section already exists in index.html');
    process.exit(0);
}

const lines = aboutContent.split('\n');
let journeyLines = [];
let inJourney = false;

for (const line of lines) {
    if (line.includes('<!-- ===== SECTION 7: MY JOURNEY ===== -->')) {
        inJourney = true;
    }
    if (inJourney) {
        if (line.includes('<!-- ===== SECTION 4: HOBBIES / STORYTELLING ===== -->')) {
            break;
        }
        journeyLines.push(line);
    }
}

const indexLines = indexContent.split('\n');
const newIndexLines = [];
for (const line of indexLines) {
    if (line.includes('<!-- ===== SECTION 6: SKILLS ===== -->')) {
        newIndexLines.push(journeyLines.join('\n'));
        newIndexLines.push('');
    }
    newIndexLines.push(line);
}

fs.writeFileSync('index.html', newIndexLines.join('\n'), 'utf8');
console.log('Journey section restored to index.html');
