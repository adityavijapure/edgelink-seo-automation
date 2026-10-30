const fs = require('fs');
const path = require('path');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06b6d4" />
      <stop offset="50%" stop-color="#0d9488" />
      <stop offset="100%" stop-color="#10b981" />
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="16" fill="url(#edgeGrad)" />
  <path d="M16 16h32c1.66 0 3 1.34 3 3v2c0 1.66-1.34 3-3 3H26v8h18c1.66 0 3 1.34 3 3v2c0 1.66-1.34 3-3 3H26v8h22c1.66 0 3 1.34 3 3v2c0 1.66-1.34 3-3 3H16c-1.66 0-3-1.34-3-3V19c0-1.66 1.34-3 3-3z" fill="#ffffff" />
  <circle cx="49" cy="15" r="5" fill="#38bdf8" stroke="#ffffff" stroke-width="2" />
</svg>`;

const publicDir = path.join(__dirname, '..', 'public');
fs.writeFileSync(path.join(publicDir, 'icon.svg'), svg);

// Generate 32x32 raw BGRA bitmap for favicon.ico
const width = 32;
const height = 32;
const bpp = 32;
const imgSize = width * height * 4;
const maskSize = Math.ceil(width / 32) * 4 * height; // 128 bytes
const biSizeImage = imgSize + maskSize;

const bih = Buffer.alloc(40);
bih.writeUInt32LE(40, 0); // biSize
bih.writeInt32LE(width, 4); // biWidth
bih.writeInt32LE(height * 2, 8); // biHeight (doubled for ICO mask)
bih.writeUInt16LE(1, 12); // biPlanes
bih.writeUInt16LE(bpp, 14); // biBitCount
bih.writeUInt32LE(0, 16); // biCompression (BI_RGB)
bih.writeUInt32LE(biSizeImage, 20); // biSizeImage
bih.writeInt32LE(0, 24); // biXPelsPerMeter
bih.writeInt32LE(0, 28); // biYPelsPerMeter
bih.writeUInt32LE(0, 32); // biClrUsed
bih.writeUInt32LE(0, 36); // biClrImportant

const pixels = Buffer.alloc(imgSize);
// Fill pixels bottom-up with gradient and 'E' shape
for (let y = 0; y < height; y++) {
  const normY = (height - 1 - y) / (height - 1);
  for (let x = 0; x < width; x++) {
    const normX = x / (width - 1);
    const offset = (y * width + x) * 4;
    
    // Rounded corner check (radius 7px in 32x32)
    const r = 7;
    let inside = true;
    if (x < r && y < r && (x - r)**2 + (y - r)**2 > r**2) inside = false;
    if (x >= width - r && y < r && (x - (width - r - 1))**2 + (y - r)**2 > r**2) inside = false;
    if (x < r && y >= height - r && (x - r)**2 + (y - (height - r - 1))**2 > r**2) inside = false;
    if (x >= width - r && y >= height - r && (x - (width - r - 1))**2 + (y - (height - r - 1))**2 > r**2) inside = false;

    if (!inside) {
      pixels.writeUInt8(0, offset);
      pixels.writeUInt8(0, offset + 1);
      pixels.writeUInt8(0, offset + 2);
      pixels.writeUInt8(0, offset + 3);
      continue;
    }

    const pxY = height - 1 - y;
    const pxX = x;

    let isWhite = false;
    if (pxX >= 8 && pxX <= 12 && pxY >= 8 && pxY <= 24) isWhite = true;
    if (pxX >= 8 && pxX <= 24 && pxY >= 8 && pxY <= 11) isWhite = true;
    if (pxX >= 8 && pxX <= 21 && pxY >= 14 && pxY <= 17) isWhite = true;
    if (pxX >= 8 && pxX <= 24 && pxY >= 21 && pxY <= 24) isWhite = true;

    const isCyanDot = ((pxX - 25)**2 + (pxY - 7)**2) <= 7;

    if (isWhite) {
      pixels.writeUInt8(255, offset);     // B
      pixels.writeUInt8(255, offset + 1); // G
      pixels.writeUInt8(255, offset + 2); // R
      pixels.writeUInt8(255, offset + 3); // A
    } else if (isCyanDot) {
      pixels.writeUInt8(248, offset);     // B
      pixels.writeUInt8(189, offset + 1); // G
      pixels.writeUInt8(56, offset + 2);  // R
      pixels.writeUInt8(255, offset + 3); // A
    } else {
      const t = (normX + normY) / 2;
      const rVal = Math.round(6 + (16 - 6) * t);
      const gVal = Math.round(182 + (185 - 182) * t);
      const bVal = Math.round(212 + (129 - 212) * t);
      pixels.writeUInt8(bVal, offset);
      pixels.writeUInt8(gVal, offset + 1);
      pixels.writeUInt8(rVal, offset + 2);
      pixels.writeUInt8(255, offset + 3);
    }
  }
}

const mask = Buffer.alloc(maskSize, 0);

// ICO header (6 bytes)
const icoHeader = Buffer.alloc(6);
icoHeader.writeUInt16LE(0, 0); // reserved
icoHeader.writeUInt16LE(1, 2); // type 1 = icon
icoHeader.writeUInt16LE(1, 4); // count 1

// ICO Directory Entry (16 bytes)
const icoDir = Buffer.alloc(16);
icoDir.writeUInt8(width, 0);
icoDir.writeUInt8(height, 1);
icoDir.writeUInt8(0, 2); // color count
icoDir.writeUInt8(0, 3); // reserved
icoDir.writeUInt16LE(1, 4); // color planes
icoDir.writeUInt16LE(bpp, 6); // bits per pixel
const totalImageBytes = bih.length + pixels.length + mask.length;
icoDir.writeUInt32LE(totalImageBytes, 8); // image size
icoDir.writeUInt32LE(6 + 16, 12); // image offset

const icoBuffer = Buffer.concat([icoHeader, icoDir, bih, pixels, mask]);
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);

const base64Svg = Buffer.from(svg).toString('base64');
console.log('SUCCESS! ICO size:', icoBuffer.length);
console.log('BASE64_SVG: data:image/svg+xml;base64,' + base64Svg);
