const express = require('express');
const puppeteer = require('puppeteer');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8080;
const SHARED_SECRET = process.env.SHARED_SECRET || "your_secret";
const UPDATE_UPI_ENDPOINT = process.env.UPDATE_UPI_ENDPOINT || "https://yourdomain.com/bigsle/update_upi.php";
const UPDATE_UPI_SECRET = process.env.UPDATE_UPI_SECRET || "your_upi_secret";

app.post('/scrape', async (req, res) => {
    try {
        if (req.body.secret !== SHARED_SECRET) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        const iframeUrl = req.body.iframe_url;
        if (!iframeUrl) {
            return res.status(400).json({ error: 'iframe_url required' });
        }

        const browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.goto(iframeUrl, { waitUntil: 'networkidle2', timeout: 60000 });

        const upiId = await page.$eval('#accountText', el => el.textContent.trim());
        await browser.close();

        // Post result back to your PHP server
        const resp = await fetch(UPDATE_UPI_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ secret: UPDATE_UPI_SECRET, upi_id: upiId })
        });

        const respText = await resp.text();
        return res.json({ status: 'success', upi: upiId, serverResp: respText });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Scraper API listening on port ${PORT}`);
});
