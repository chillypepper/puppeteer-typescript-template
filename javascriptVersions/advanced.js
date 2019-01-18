"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const puppeteer = require("puppeteer");
const devices = require("puppeteer/DeviceDescriptors");
function test1() {
    const divCount = document.querySelectorAll('div').length;
    const error = divCount === 1 ? null : new Error('Expected div count to be 1!');
    return {
        data: {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight,
            divCount,
        },
        ...(error && { error }),
    };
}
function test2() {
    const anchorCount = document.querySelectorAll('a').length;
    const error = anchorCount === 1 ? null : new Error('Expected anchor count to be 1!');
    return {
        data: {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight,
            anchorCount,
        },
        ...(error && { error }),
    };
}
const outputFolder = 'outputs';
const pageList = [
    { name: 'example1', url: 'https://example.com/', testFunction: test1 },
    {
        name: 'example2',
        url: 'https://example.com/',
        testFunction: test1,
        device: devices['Galaxy S5'],
    },
    {
        name: 'example3',
        url: 'https://example.com/',
        testFunction: test2,
        device: {
            name: 'Fake tablet',
            userAgent: 'fake',
            viewport: {
                width: 1280,
                height: 720,
                isMobile: false,
                deviceScaleFactor: 1,
                hasTouch: true,
                isLandscape: true,
            },
        },
    },
];
(async () => {
    // Make the browser visible by default, extend the timeout, and set a default viewport size
    const browser = await puppeteer.launch({
        defaultViewport: { width: 1920, height: 1080 },
        headless: false,
        timeout: 60000,
    });
    // The browser automatically opens a page, so use that
    const page = (await browser.pages())[0];
    let errorCount = 0;
    for (const pageData of pageList) {
        // If this test needs a different device, emulate it
        if (pageData.device) {
            page.emulate(pageData.device);
        }
        await page.goto(pageData.url);
        // Take a screenshot of the page and save it into the outputs folder
        await page.screenshot({
            path: `${outputFolder}/${pageData.name}.png`,
        });
        // Anything that you could normally run in a browser should be accessible here
        const results = await page.evaluate(pageData.testFunction);
        // Grab all of the page data and save the results into the outputs folder
        await fs_1.promises.writeFile(`${outputFolder}/${pageData.name}.json`, JSON.stringify({ pageData, ...results }, null, 2));
        if (results.error) {
            ++errorCount;
        }
        console.log(`${pageData.name}: ${results.error ? `ERROR: ${results.error}` : 'SUCCESS'}`);
    }
    console.log(`${pageList.length} tests finished with ${errorCount} errors`);
    // Just close the browser, there is only 1 page so no need for await page.close()
    await browser.close();
})()
    .then(() => {
    console.log('Browser scans complete!');
})
    .catch((error) => {
    console.log('Browser scans failed with the following error:', error);
});
