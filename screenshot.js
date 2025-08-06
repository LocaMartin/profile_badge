// screenshot.js
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

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

    const outputDir = path.resolve('badges');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    const fileName = file.replace('.html', '.png');
    const output = path.join(outputDir, fileName);

    // Capture only the badge span
    const badgeElement = await page.$('span');
    if (badgeElement) {
      await badgeElement.screenshot({ path: output });
      console.log(`✅ Saved: ${output}`);
    } else {
      console.log(`⚠️ Could not find badge in ${file}`);
    }
  }

  await browser.close();
})();

