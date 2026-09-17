const sharp = require('sharp');
const fs = require('fs');

const [input, output] = process.argv.slice(2);
if (!input || !output) {
  throw new Error('Usage: render-pulse-ad-desktop.js INPUT.png OUTPUT.png');
}

const width = 1920;
const height = 1080;
const brightBlue = '#2F6BFF';
const fontData = fs.readFileSync('fonts/HankenGrotesk-VariableFont_wght.ttf').toString('base64');
const fontFace = `
  <style>
    @font-face {
      font-family: 'Hanken Grotesk';
      src: url(data:font/ttf;base64,${fontData}) format('truetype');
      font-weight: 100 900;
    }
  </style>`;

const textBehind = Buffer.from(`
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  ${fontFace}
  <text x="430" y="320" text-anchor="middle" letter-spacing="12"
    font-family="Hanken Grotesk" font-size="190" fill="#FFFFFF"><tspan font-weight="200">P</tspan><tspan font-weight="300">U</tspan><tspan font-weight="400">L</tspan><tspan font-weight="500">S</tspan><tspan font-weight="650">E</tspan><tspan font-weight="800">.</tspan></text>
</svg>`);

const textFront = Buffer.from(`
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  ${fontFace}
  <text x="430" y="510" text-anchor="middle"
    font-family="Hanken Grotesk" font-size="58" font-weight="500" fill="#FFFFFF">Hvert skridt tæller</text>
  <rect x="270" y="570" width="320" height="82" rx="41" fill="${brightBlue}"/>
  <text x="430" y="625" text-anchor="middle"
    font-family="Hanken Grotesk" font-size="36" font-weight="700" fill="#FFFFFF">Køb nu</text>
  <text x="430" y="745" text-anchor="middle"
    font-family="Hanken Grotesk" font-size="54" font-weight="500" fill="#FFFFFF">1.299 kr.</text>
</svg>`);

async function render() {
  const watches = await sharp(input)
    .resize(1040, 888, { fit: 'contain' })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
    .composite([
      { input: textBehind, top: 0, left: 0 },
      { input: watches, top: 96, left: 820 },
      { input: textFront, top: 0, left: 0 }
    ])
    .png()
    .toFile(output);
}

render().catch((error) => {
  console.error(error);
  process.exit(1);
});
