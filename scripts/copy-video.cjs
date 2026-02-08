const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '..', 'public', 'dance-dancing.mp4');
const destPath = path.join(__dirname, '..', 'dist', 'dance-dancing.mp4');

if (fs.existsSync(sourcePath)) {
  fs.copyFileSync(sourcePath, destPath);
  console.log('✓ Video file copied to dist/dance-dancing.mp4');
} else {
  console.warn('⚠ Video file not found in public folder');
}
