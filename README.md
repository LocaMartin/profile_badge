### How I Created Custom Markdown Badges for My GitHub Profile (Without Shields.io)

I wanted to add some cool-looking badges to my GitHub `README.md` — but I hit a wall.

Shields.io didn’t have logos for some of the tools I use (like `Nuclei`, `Batch Scripts`, `PowerShell`), so I decided to build my own badges manually with HTML and CSS, and convert them into images using Puppeteer.

```bash
mkdir profile
```
```bash
cd profile
```
```bash
mkdir res # resource directory 
# Place your logos (e.g., batch.png, nuclei.svg) inside the res/ folder.
```
### Create the HTML Badge Template
```bash
touch batch_script.html css.html nuclei.html package-lock.json package.json powershell.html # create html files
```
```html
<!-- batch_script.html -->
<span style="display: inline-flex; align-items: center; padding: 4px 10px; background-color: #0D1117; color: white; border-radius: 0; font-family: 'Segoe UI', sans-serif; font-size: 13px; font-weight: bold; gap: 6px; box-shadow: 0 0 0 1px #30363D;">
  <img src="res/batch.png" alt="Batch Script" style="height: 18px;" /> <!--'res/batch.png' location of logo-->
  BATCH SCRIPT <!--TEXT YOU WANT TO APPEAR ON THE BADGE-->
</span>
```

| Part                        | What It Does                                        |
| --------------------------- | --------------------------------------------------- |
| `<span>`                    | Inline container for the badge.                     |
| `display: inline-flex`      | Aligns text and image horizontally inside the span. |
| `align-items: center`       | Vertically centers image and text.                  |
| `padding: 4px 10px`         | Adds spacing inside the badge.                      |
| `background-color: #0D1117` | Gives it a dark background (GitHub-style).          |
| `color: white`              | Makes the text white.                               |
| `border-radius: 0`          | Removes rounded corners.                            |
| `font-family: 'Segoe UI'`   | Modern sans-serif font.                             |
| `font-size: 13px`           | Sets the text size.                                 |
| `font-weight: bold`         | Makes the text bold.                                |
| `gap: 6px`                  | Adds spacing between the icon and text.             |
| `box-shadow`                | Adds a thin border around the badge.                |
### Take Screenshots Using Puppeteer
Install the dependencies 
```bash
npm node init -y
```
```bash
npm install 
```
create a screenshot
```bash
touch screenshot.js
```
```js
// screenshot.js # static png
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
      console.log(`Saved: ${output}`);
    } else {
      console.log(`Could not find badge in ${file}`);
    }
  }

  await browser.close();
})();
```
### Folder Structure
```
profile/
├── res/
│   └── batch.png
├── css.html
├── batch_script.html
├── nuclei.html
├── powershell.html
├── badges/              <-- Final PNGs will go here
│   └── nuclei.png
├── screenshot.js        <-- Puppeteer script
```
### Run the Script
```bash
# run
node screenshot.js
# you will get png(s) inside badges directory
```
### You can make animated markdown badges too replace image source inside `<img>` tag to animated logo (e.g. svg,gif) `src="icon.svg"` or if you want to animate with the text you can do it too

```html
<span style="display: inline-flex; align-items: center; padding: 4px 10px; background-color: #0D1117; color: white; border-radius: 0; font-family: 'Segoe UI', sans-serif; font-size: 13px; font-weight: bold; gap: 6px; box-shadow: 0 0 0 1px #30363D;">
  <img src="res/batch.svg" alt="Batch Script" style="height: 18px;" /> <!--'res/batch.png' location of logo-->
  BATCH SCRIPT <!--TEXT YOU WANT TO APPEAR ON THE BADGE-->
</span>
```

modify `screenshot,js` to save output as `.svg` or `.gif` to `badges/animated_badges`as github only allows images not html
```js
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
    const fileName = path.basename(file, '.html');
    const filePath = `file://${path.resolve(file)}`;
    const frameDir = path.resolve('badges/frames', fileName);

    fs.mkdirSync(frameDir, { recursive: true });

    await page.goto(filePath);
    await page.setViewport({ width: 300, height: 60, deviceScaleFactor: 2 });

    const duration = 2; // seconds
    const fps = 10;
    const totalFrames = duration * fps;

    for (let i = 0; i < totalFrames; i++) {
      await page.evaluate((t) => {
        window.scrollTo(0, 0); // force reflow
      }, i * (1000 / fps));

      const framePath = path.join(frameDir, `frame-${String(i).padStart(3, '0')}.png`);
      await page.screenshot({ path: framePath });
      await new Promise((res) => setTimeout(res, 1000 / fps));
    }

    console.log(`Captured frames for ${fileName}`);
  }

  await browser.close();
})();
```
```bash
ffmpeg -framerate 10 -i badges/frames/nuclei/frame-%03d.png -loop 0 badges/animated_badges/nuclei.gif
```

Now I have fully customized badges with my own icons, custom styles, and total control — and I can show off tools I actually use, even if no one else makes badges for them.

