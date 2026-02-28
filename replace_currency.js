const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            results.push(file);
        }
    });
    return results;
}

const files = walk('src');
let changedCount = 0;

files.forEach(f => {
    if (f.endsWith('.tsx') || f.endsWith('.ts')) {
        let content = fs.readFileSync(f, 'utf8');
        let original = content;

        // Split by ${ and temporarily replace it with a weird string
        let parts = content.split('${');

        // For each part, replace literal '$' with '₹'
        parts = parts.map(part => part.replace(/\$/g, '₹'));

        // Join them back with '${'
        let newContent = parts.join('${');

        if (newContent !== original) {
            fs.writeFileSync(f, newContent);
            console.log('Updated:', f);
            changedCount++;
        }
    }
});

console.log('Total files updated:', changedCount);
