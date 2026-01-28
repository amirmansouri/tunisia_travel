const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const publicDir = path.join(__dirname, '..', 'public');

async function generateIcons() {
  const sizes = [192, 512];

  for (const size of sizes) {
    const svgPath = path.join(publicDir, `icon-${size}.svg`);
    const pngPath = path.join(publicDir, `icon-${size}.png`);

    if (fs.existsSync(svgPath)) {
      await sharp(svgPath)
        .resize(size, size)
        .png()
        .toFile(pngPath);

      console.log(`Generated icon-${size}.png`);
    }
  }

  console.log('Icons generated successfully!');
}

generateIcons().catch(console.error);
