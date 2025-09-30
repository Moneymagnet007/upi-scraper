import fs from 'fs';
import puppeteer from 'puppeteer';

const targetUrl = process.argv[2];
if (!targetUrl) {
  console.error("❌ No target URL provided");
  process.exit(1);
}

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] });
  const page = await browser.newPage();
  await page.goto(targetUrl, { waitUntil: "networkidle2", timeout: 60000 });

  // Extract UPI text
  let upi = "";
  try {
    upi = await page.$eval('#accountText', el => el.textContent.trim());
  } catch (e) {
    console.error("⚠️ Could not find UPI element");
  }

  const data = {
    upi,
    scrapedAt: new Date().toISOString()
  };

  // Save into sale/data/info.json
  fs.writeFileSync("./sale/data/info.json", JSON.stringify(data, null, 2));
  console.log("✅ Scraped UPI:", upi);

  await browser.close();
})();