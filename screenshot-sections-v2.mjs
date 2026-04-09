import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, 'temporary screenshots');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args: ['--no-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });

  // Scroll to trigger animations
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 300) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 80));
    }
  });

  // Screenshot at specific scroll positions (pixels from top)
  const positions = [
    { name: 'v2-hero', y: 0 },
    { name: 'v2-casestudies', y: 700 },
    { name: 'v2-dark-sections', y: 1600 },
    { name: 'v2-mobile-green-red', y: 2600 },
    { name: 'v2-footer', y: 3800 },
  ];

  for (const p of positions) {
    await page.evaluate(y => window.scrollTo(0, y), p.y);
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: path.join(dir, `${p.name}.png`) });
    console.log(`✅ ${p.name}`);
  }

  await browser.close();
}
run();
