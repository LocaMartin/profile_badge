const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp'); // install this with: npm install sharp

const badgeFiles = [
  'batch_script.html',
  'css.html',
  'nuclei.html',
  'powershell.html'
];

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (const file of badgeFiles) {
    const filePath = `file://${path.resolve(file)}`;
    await page.goto(filePath);
    await page.setViewport({ width: 300, height: 60, deviceScaleFactor: 2 });

    const outputDir = path.resolve('gif_badges');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    const baseName = file.replace('.html', '');
    const pngPath = path.join(outputDir, `${baseName}.png`);

    const badgeElement = await page.$('span');
    if (badgeElement) {
      await badgeElement.screenshot({ path: pngPath });
      console.log(`PNG Saved: ${pngPath}`);

      // Convert PNG → GIF
      await sharp(pngPath).gif().toFile(gifPath);
      console.log(`GIF Saved: ${gifPath}`);
    } else {
      console.log(`Badge not found in ${file}`);
    }
  }

  await browser.close();
})();
