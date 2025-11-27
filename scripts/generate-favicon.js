const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

(async () => {
  const input = path.join(__dirname, "../public/logo.png");
  const output = path.join(__dirname, "../public/favicon.png");

  const size = 512; // favicon size

  // Create circular mask
  const circle = Buffer.from(
    `<svg width="${size}" height="${size}">
        <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="white"/>
     </svg>`
  );

  await sharp(input)
    .resize(size, size)
    .composite([{ input: circle, blend: "dest-in" }])
    .png()
    .toFile(output);

  console.log("Generated circular favicon at:", output);
})();

