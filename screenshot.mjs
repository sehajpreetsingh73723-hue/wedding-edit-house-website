import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotsDir = path.join(__dirname, 'temporary screenshots');

// Create screenshots directory if it doesn't exist
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

async function takeScreenshot() {
  const url = process.argv[2] || 'http://localhost:3000';
  const label = process.argv[3] || '';

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    console.log(`📸 Taking screenshot of ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

    // Scroll through the page to trigger IntersectionObserver animations
    await page.evaluate(async () => {
      const step = 400;
      const delay = 100;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise(r => setTimeout(r, delay));
      }
      window.scrollTo(0, 0);
      await new Promise(r => setTimeout(r, 500));
    });

    // Get the full page height
    const bodyHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    await page.setViewport({ width: 1920, height: bodyHeight });

    // Find the next screenshot number
    let screenshotNum = 1;
    while (fs.existsSync(
      path.join(screenshotsDir, `screenshot-${screenshotNum}${label ? `-${label}` : ''}.png`)
    )) {
      screenshotNum++;
    }

    const filename = `screenshot-${screenshotNum}${label ? `-${label}` : ''}.png`;
    const filepath = path.join(screenshotsDir, filename);

    await page.screenshot({ path: filepath, fullPage: true });
    console.log(`✅ Screenshot saved: temporary screenshots/${filename}`);
  } catch (error) {
    console.error('❌ Screenshot error:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

takeScreenshot();
