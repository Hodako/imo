const fs = require('fs');
const path = require('path');

const filesToDelete = [
  path.join(__dirname, 'pages', 'api', 'upload-apk.js'),
  path.join(__dirname, 'pages', 'api', 'upload-image.js'),
];

for (const file of filesToDelete) {
  try {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      console.log(`Deleted: ${file}`);
    } else {
      console.log(`Not found: ${file}`);
    }
  } catch (err) {
    console.error(`Failed to delete: ${file}`);
    console.error(err.message);
  }
}

console.log('Cleanup complete.');
console.log('Run: npm install formidable');
console.log('Then: npm run build');
