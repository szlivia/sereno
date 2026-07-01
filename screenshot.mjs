import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

(async () => {
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--allow-file-access-from-files', '--disable-web-security']
  });
  const page = await browser.newPage();

  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

  const filePath = 'file:///' + path.resolve('index.html').replace(/\\/g, '/');
  await page.goto(filePath, { waitUntil: 'networkidle0' });

  await new Promise(r => setTimeout(r, 3000));

  await page.evaluate(() => {
    // Esconde navbar fixa
    document.querySelectorAll('nav, header, #navbar, .navbar, [class*="nav"]').forEach(el => {
      const style = window.getComputedStyle(el);
      if (style.position === 'fixed' || style.position === 'sticky') {
        el.style.display = 'none';
      }
    });

    // Reduz a altura da hero
    const hero = document.querySelector('#hero, .hero-section');
    if (hero) {
      hero.style.minHeight = 'auto';
      hero.style.height = 'auto';
      hero.style.paddingTop = '60px';
      hero.style.paddingBottom = '60px';
    }

    // Força visibilidade de tudo
    const style = document.createElement('style');
    style.textContent = `
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
        opacity: 1 !important;
        transform: none !important;
        visibility: visible !important;
      }
      section, div, p, h1, h2, h3, img {
        page-break-inside: avoid;
      }
    `;
    document.head.appendChild(style);

    window.scrollTo(0, document.body.scrollHeight);
  });

  await new Promise(r => setTimeout(r, 2000));
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 500));

  await page.pdf({
    path: 'nurie-marketing.pdf',
    width: '1440px',
    height: '1024px',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  await browser.close();
  console.log('PDF gerado!');
})();