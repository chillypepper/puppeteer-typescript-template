"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer = require("puppeteer");
// Create an async closure, this way we can use await everywhere
(async () => {
    // Create the browser instance. Pass an object to launch to configure the browser instance
    const browser = await puppeteer.launch();
    // Create a new page, and navigate to the example site when it's ready
    const page = await browser.newPage();
    await page.goto('https://example.com');
    // Take a screenshot of the page and save it into the root folder (saves on creating folders)
    await page.screenshot({ path: 'outputs/example.png' });
    // Run code in the page context, here we return the viewing area and number of divs on the page
    const pageData = await page.evaluate(() => {
        // Anything that you could normally run in a browser should be accessible here
        const divCount = document.querySelectorAll('div').length;
        return {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight,
            divCount,
        };
    });
    // Print out the data from the page results. Make sure to do this OUTSIDE page.evaluate's context
    console.log(pageData);
    // Close the page, we no longer need it
    await page.close();
    // Close the browser, we no longer need it
    await browser.close();
})();
