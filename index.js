const puppet = require('puppeteer');

async function main(search) {
    console.time('benchmark');
    console.timeLog('benchmark', 'start')

    const browser = await puppet.launch({
        args: ["--window-size=705,620"]
    });
    const page = await browser.newPage();

    await page.goto(`https://www.khanacademy.org/search?page_search_query=${encodeURIComponent(search)}`);
    console.timeLog('benchmark', 'Page loaded')
    
    //Get rid of donation ad
    await page.evaluate(() => 
        document.addEventListener('DOMContentLoaded', () => {
            document.querySelector('._7myq7qs').dispatchEvent(new Event('click', {bubbles: true}))
        })
    );

    //Find links and extract name + link url
    let res = await page.evaluate(() => {
        document.addEventListener('DOMContentLoaded', () => {
            let res = [];
            for(let link of document.querySelectorAll('a.gs-title')) {
                if(link.href.length) res.push({ name: link.textContent, link: link.href })
            }
            return res;    
        })
    });
    console.timeLog('benchmark', 'Scraping done');

    browser.close();

    console.timeLog('benchmark', 'All Finished');
    return res;
}

module.exports = main;