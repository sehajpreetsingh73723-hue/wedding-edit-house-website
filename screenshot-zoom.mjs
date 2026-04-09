import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, 'temporary screenshots');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

// Crop sections from the reference image by reading it at different zoom levels
// Instead, let's just copy the reference for closer inspection
const src = path.join(__dirname, 'destroytoday.com__ref=godly.png');
const img = fs.readFileSync(src);
console.log(`Reference image size: ${img.length} bytes`);
console.log('Use the Read tool to view the image directly.');
