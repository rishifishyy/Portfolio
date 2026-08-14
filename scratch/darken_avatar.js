const fs = require('fs');
const zlib = require('zlib');

// Basic PNG Decoder & Encoder for RGBA
function processPNG(inputPath, outputPath) {
  const buffer = fs.readFileSync(inputPath);
  
  // Verify PNG signature
  if (buffer.readUInt32BE(0) !== 0x89504E47 || buffer.readUInt32BE(4) !== 0x0D0A1A0A) {
    throw new Error('Not a valid PNG');
  }

  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  let idatChunks = [];

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.slice(offset + 4, offset + 8).toString('ascii');
    const data = buffer.slice(offset + 8, offset + 8 + length);
    
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
      console.log(`PNG Info: ${width}x${height}, depth: ${bitDepth}, colorType: ${colorType}`);
    } else if (type === 'IDAT') {
      idatChunks.push(data);
    } else if (type === 'IEND') {
      break;
    }
    offset += 12 + length;
  }

  if (colorType !== 6 && colorType !== 2) {
    console.log('Unsupported color type for simple script:', colorType);
    return;
  }

  const allIdat = Buffer.concat(idatChunks);
  const decompressed = zlib.inflateSync(allIdat);

  const bytesPerPixel = colorType === 6 ? 4 : 3;
  const scanlineLength = 1 + width * bytesPerPixel;
  const rawData = Buffer.alloc(width * height * 4);

  // Unfilter scanlines
  let prevScanline = Buffer.alloc(width * bytesPerPixel);
  
  for (let y = 0; y < height; y++) {
    const filterType = decompressed[y * scanlineLength];
    const scanline = decompressed.slice(y * scanlineLength + 1, (y + 1) * scanlineLength);
    const uncompressedScanline = Buffer.alloc(width * bytesPerPixel);

    for (let x = 0; x < width * bytesPerPixel; x++) {
      const a = x >= bytesPerPixel ? uncompressedScanline[x - bytesPerPixel] : 0;
      const b = prevScanline[x];
      const c = x >= bytesPerPixel ? prevScanline[x - bytesPerPixel] : 0;
      const xVal = scanline[x];

      let val = 0;
      if (filterType === 0) val = xVal;
      else if (filterType === 1) val = (xVal + a) & 0xFF;
      else if (filterType === 2) val = (xVal + b) & 0xFF;
      else if (filterType === 3) val = (xVal + Math.floor((a + b) / 2)) & 0xFF;
      else if (filterType === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        let pr = c;
        if (pa <= pb && pa <= pc) pr = a;
        else if (pb <= pc) pr = b;
        val = (xVal + pr) & 0xFF;
      }
      uncompressedScanline[x] = val;
    }

    // Copy to rawData (RGBA)
    for (let x = 0; x < width; x++) {
      const srcIdx = x * bytesPerPixel;
      const dstIdx = (y * width + x) * 4;
      rawData[dstIdx] = uncompressedScanline[srcIdx];
      rawData[dstIdx + 1] = uncompressedScanline[srcIdx + 1];
      rawData[dstIdx + 2] = uncompressedScanline[srcIdx + 2];
      rawData[dstIdx + 3] = colorType === 6 ? uncompressedScanline[srcIdx + 3] : 255;
    }
    prevScanline = uncompressedScanline;
  }

  // Flood fill / background darkness conversion
  // Replace white background pixels (where r > 240, g > 240, b > 240 or transparent) with dark color #121215
  for (let i = 0; i < rawData.length; i += 4) {
    const r = rawData[i];
    const g = rawData[i + 1];
    const b = rawData[i + 2];
    const a = rawData[i + 3];

    // Check if pixel is white/near-white or transparent
    if (a < 30 || (r > 240 && g > 240 && b > 240) || (r > 230 && g > 230 && b > 230 && Math.abs(r-g) < 10 && Math.abs(g-b) < 10)) {
      // Dark background: #121216
      rawData[i] = 18;     // R
      rawData[i + 1] = 18; // G
      rawData[i + 2] = 22; // B
      rawData[i + 3] = 255;// Alpha
    }
  }

  // Re-encode PNG (filter type 0 for simplicity)
  const newScanlines = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    newScanlines[y * (1 + width * 4)] = 0; // Filter 0 (None)
    for (let x = 0; x < width * 4; x++) {
      newScanlines[y * (1 + width * 4) + 1 + x] = rawData[y * width * 4 + x];
    }
  }

  const compressed = zlib.deflateSync(newScanlines);

  // Build PNG Buffer
  function makeChunk(type, data) {
    const chunk = Buffer.alloc(12 + data.length);
    chunk.writeUInt32BE(data.length, 0);
    chunk.write(type, 4, 4, 'ascii');
    data.copy(chunk, 8);
    
    // Calculate CRC
    const crc = crc32(chunk.slice(4, 8 + data.length));
    chunk.writeInt32BE(crc, 8 + data.length);
    return chunk;
  }

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;  // bit depth
  ihdrData[9] = 6;  // RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  const pngHeader = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  const ihdrChunk = makeChunk('IHDR', ihdrData);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  const outBuffer = Buffer.concat([pngHeader, ihdrChunk, idatChunk, iendChunk]);
  fs.writeFileSync(outputPath, outBuffer);
  console.log('Successfully saved darkened avatar to', outputPath);
}

// CRC32 implementation
function crc32(buf) {
  let table = [];
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }

  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ (-1)) | 0;
}

processPNG('c:\\WEB DEV HTML\\Portfolio\\assets\\avatar.png', 'c:\\WEB DEV HTML\\Portfolio\\assets\\avatar.png');
