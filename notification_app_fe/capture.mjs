import puppeteer from 'puppeteer';
import fs from 'fs';

const screenshotDir = './screenshots';
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir);
}

const delay = ms => new Promise(res => setTimeout(res, ms));

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // 1. All Notifications page — desktop view
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await delay(2000);
  await page.screenshot({ path: `${screenshotDir}/1_all_notifications_desktop.png`, fullPage: true });
  
  // 5. Filter active (e.g. Placement selected) — desktop
  const filters = await page.$$('button');
  for (const f of filters) {
    const text = await f.evaluate(el => el.textContent);
    if (text === 'Placement') {
      await f.click();
      break;
    }
  }
  await delay(2000); // wait for api
  await page.screenshot({ path: `${screenshotDir}/5_filter_active_desktop.png` });
  
  // click "All" back
  for (const f of filters) {
    const text = await f.evaluate(el => el.textContent);
    if (text === 'All') {
      await f.click();
      break;
    }
  }
  await delay(2000);

  // 6. Notification clicked -> viewed state shown
  await page.evaluate(() => {
    const cards = document.querySelectorAll('.MuiCard-root');
    if (cards.length > 0) {
      cards[0].click();
    }
  });
  await delay(1000);
  await page.screenshot({ path: `${screenshotDir}/6_notification_viewed.png` });

  // 2. All Notifications page — mobile view (375px width)
  await page.setViewport({ width: 375, height: 812 });
  await delay(500);
  await page.screenshot({ path: `${screenshotDir}/2_all_notifications_mobile.png`, fullPage: true });
  
  // 3. Priority Inbox page — desktop view
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:3000/priority', { waitUntil: 'networkidle0' });
  await delay(2000);
  await page.screenshot({ path: `${screenshotDir}/3_priority_inbox_desktop.png` });
  
  // 4. Priority Inbox page — mobile view
  await page.setViewport({ width: 375, height: 812 });
  await delay(500);
  await page.screenshot({ path: `${screenshotDir}/4_priority_inbox_mobile.png` });
  
  await browser.close();
  console.log("Screenshots captured!");
})();
