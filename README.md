# About this repo

I recently came across a perfect opportunity for automated browser testing at work and thought it would be fun to finally try headless Chrome. Thankfully there exists a module called Puppeteer: https://github.com/GoogleChrome/puppeteer which is exactly what I wanted - a super simple node library for Chrome testing. I set up a quick project with Puppeteer and TypeScript to test it, and thought I'd publish it to help anyone else who might hit the same troubles I did making a basic template.

The quickstart guide in Puppeteer's readme is actually fantastic so give it a read if you're just starting out, and then you can use this repo to dive a little further into the module, as well as having a starting point TypeScript template. I've made two files (one super minimal and one with a couple more features in place) to demonstrate Puppeteer and to give you some example code and ideas to start with.

If you're here and you're not interested in TypeScript, but you would like to see the code in JavaScript, take a look in the javascriptVersions folder. I build the TypeScript out there to run it, and while it is formatted a little strangely it's very readable and will be easy to take code from.

# Getting started

```
npm install

npm start

npm run advanced
```

This was tested with node 10.15.0 on Windows 10, but any of the later node 10s on any platform should work. You will see a warning about fsPromise being experimental in the advanced script (one of the dependencies), but you can safely ignore this.

To try out this setup just clone this repo and run "npm install", nothing else is required for the setup. The install will likely take a while as by default Puppeteer comes with its own copy of Chrome - this isn't required, as there is another package called puppeteer-core that you can use with your own browser instead, but I haven't tried this so won't go through it here. Here's the project link if you're interested: https://www.npmjs.com/package/puppeteer-core.

Once the install is complete run "npm start" to see the project in action. It will only show in the console as it is headless, but you will see example.png appear in your outputs folder and some info from the page appear in your console.

If you want to see the advanced file in action, run "npm run advanced" instead. Advanced isn't headless by default, so you will see the browser window run through all of the tests! There are 3 pages it will go through, and all of the page data and screenshots will be saved in the outputs folder

# Some useful learnings

- Your tsconfig libs must include dom, for example: "lib": ["esnext", "dom"]. Without it you'll hit heaps of type errors for almost anything inside "page.evaluate" or even just trying to build the ts files.
- Remember that everything inside "page.evaluate" is run within the context of the browser window. It seems obvious, but it's easy to forget, and trying to do things like save scraped output to a file will fail with errors like "fs is undefined" ... not very helpful.
- It can be quite useful to see the browser window during the first rounds of testing, so remember to pass { headless: false } into the browser launcher to see the window live if you need it.
- While the basic demo set up the viewport using the browser launch function, it's often better to just alter a page (unless you need something like devtools on your browser instance). You can easily switch emulate common devices with "page.emulate" and a device from "puppeteer/DeviceDescriptors". There's a ticket that covers this (including a link to all of the devices and their specs) here: https://github.com/GoogleChrome/puppeteer/issues/339.
- While it should in theory be faster to spawn multiple browsers/pages at once to test in parallel, remember that a page won't be continue through its await until all assets are loaded and ready, and it's very easy to reach the timeout (default 30 seconds) on slow pages even with just a single instance hitting the site. You can set your timeout higher in the browser launch options, but you'll likely be best off with a single browser instance and a single page (moving between urls) for testing most nonprod sites.

# Next steps

- I haven't gone any further than this example yet, but it would probably be best to include an actual testing framework in here rather than the simple setup I used in the advanced file. I'll likely be using mocha + chai + sinon, but feel free to use whatever you're most comfortable with.
- It would be a good idea to decide on a structure for your test files early, rather than having all the tests in one place. I imagine most test suites will actually just want to test all the same list of pages in a set list of devices, and if so I imagine it would be better to have a suite of tests per page for each device, and just run through all of the pages in each device.
- I wonder if it would be feasible to make test cases easier to write for non developers - maybe someone has already looked down this path? Definitely worth a look, its nice to be abel to write simple test cases without a dev's help.
- I've never published or maintained an open source project before, so it would be nice to try taking care of this over time. If you have any suggestions, issues, or questions though post them up here, and I will do my best to answer or fix them :)

**That's everything! Good luck and have fun with puppeteer - it's the most fun I've ever had with browser testing, and I hope it will be the same for you!**
