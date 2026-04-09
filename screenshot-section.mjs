import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotsDir = path.join(__dirname, 'temporary screenshots');
if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });

async function run() {
  const url = process.argv[2] || 'http://localhost:3000';

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args: ['--no-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

  // Scroll to trigger all animations
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 300) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 80));
    }
  });

  // Screenshot sections
  const sections = [
    { name: 'hero', scroll: 0 },
    { name: 'about', selector: '#about' },
    { name: 'services', selector: '#services' },
    { name: 'portfolio', selector: '#portfolio' },
    { name: 'testimonials', selector: '#testimonials' },
  ];

  for (const s of sections) {
    if (s.selector) {
      await page.evaluate(sel => {
        document.querySelector(sel)?.scrollIntoView({ behavior: 'instant' });
      }, s.selector);
    } else {
      await page.evaluate(y => window.scrollTo(0, y), s.scroll || 0);
    }
    await new Promise(r => setTimeout(r, 500));
    const filepath = path.join(screenshotsDir, `section-${s.name}.png`);
    await page.screenshot({ path: filepath });
    console.log(`✅ ${s.name}: temporary screenshots/section-${s.name}.png`);
  }

  await browser.close();
}

run();
