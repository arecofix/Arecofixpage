const fs = require('fs');

function getJpegSize(filePath) {
  const buffer = fs.readFileSync(filePath);
  let offset = 2;

  while (offset < buffer.length) {
    if (buffer[offset] === 0xFF) {
      if (buffer[offset + 1] === 0xC0 || buffer[offset + 1] === 0xC2) {
        return {
          height: buffer.readUInt16BE(offset + 5),
          width: buffer.readUInt16BE(offset + 7)
        };
      }
      offset += 2 + buffer.readUInt16BE(offset + 2);
    } else {
      offset++;
    }
  }
  return null;
}

const size = getJpegSize('temp_img.jpg');
console.log(size);
