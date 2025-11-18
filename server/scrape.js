import puppeteer from "puppeteer-extra";
import Stealth from "puppeteer-extra-plugin-stealth";
puppeteer.use(Stealth());

let browser;
async function getBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-blink-features=AutomationControlled",
        "--disable-features=IsolateOrigins,site-per-process",
      ],
    });
  }
  return browser;
}

export async function scrapeMenu(date, mealName) {
  const browser = await getBrowser();
  const page = await browser.newPage();

  await page.setRequestInterception(true);

  page.on("request", req => {
    const url = req.url();

    // Allow only API calls
    if (url.includes("apiv4.dineoncampus.com")) return req.continue();

    // block everything else
    req.abort();
  });

  // Directly hit the API URL
  const periodsUrl = 
    `https://apiv4.dineoncampus.com/locations/${locationId}/periods/?date=${date}`;

  const periods = await page.evaluate(async url => {
    const r = await fetch(url);
    return await r.json();
  }, periodsUrl);

  const periodObj = periods.periods.find(
    p => p.name.toLowerCase() === mealName.toLowerCase()
  );

  const menuUrl =
    `https://apiv4.dineoncampus.com/locations/${locationId}/menu?date=${date}&period=${periodObj.id}`;

  const menuData = await page.evaluate(async url => {
    const r = await fetch(url);
    return await r.json();
  }, menuUrl);

  await page.close();
  return menuData;
}
