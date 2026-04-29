const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\Charles\\Documents\\My Projects\\Lumina\\src\\components\\blocks';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

const variants = ['sm', 'md', 'lg', 'xl', '2xl'];

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    variants.forEach(v => {
        // Match variants that are NOT already prefixed with @
        const regex = new RegExp(`(?<![@])\\b${v}:`, 'g');
        content = content.replace(regex, `@${v}:`);
    });
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
});
