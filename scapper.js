const request = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");
const { parse } = require('json2csv');

const movieUrls = [
    "https://www.imdb.com/title/tt10545296/",
    "https://www.imdb.com/title/tt13287846/"
];

(async () => {
    try {
        let data = [];

        for (const movieUrl of movieUrls) {
            const response = await request({
                uri: movieUrl,
                headers: {
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Accept-Language": "en-US,en;q=0.7"
                },
                gzip: true
            });

            const $ = cheerio.load(response);
            const title = $('#__next > main > div > section.ipc-page-background.ipc-page-background--base.sc-304f99f6-0.fSJiHR > section > div:nth-child(4) > section > section > div.sc-e226b0e3-3.dwkouE > div.sc-69e49b85-0.jqlHBQ > h1 > span').text();
            
            // Add more fields as needed
            data.push({title});
        }

        // Convert JSON to CSV
        const csv = parse(data);

        // Write CSV to file
        fs.writeFileSync("./data.csv", csv, "utf8");
    } catch (error) {
        console.error('Error:', error);
    }
})();
