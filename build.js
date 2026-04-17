const fs = require('fs');
const path = require('path');

console.log('Starting custom static build...');

const dist = path.join(__dirname, 'dist');

// Create dist directory
if (!fs.existsSync(dist)) {
  fs.mkdirSync(dist, { recursive: true });
}

// Ensure copying assets recursively
fs.cpSync(path.join(__dirname, 'assets'), path.join(dist, 'assets'), { recursive: true });

// Copy root files
fs.copyFileSync(path.join(__dirname, 'index.html'), path.join(dist, 'index.html'));
fs.copyFileSync(path.join(__dirname, 'style.css'), path.join(dist, 'style.css'));
fs.copyFileSync(path.join(__dirname, 'script.js'), path.join(dist, 'script.js'));

console.log('Build successfully copied all static files to dist/ folder.');
