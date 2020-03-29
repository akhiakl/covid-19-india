const cheerio = require('cheerio');
var fs = require('fs');
const path = require('path');
const debug = require('debug')('cvid-api:log')
const axios = require('axios');

const scrape = async (req, res) => {
    try {
        await scrapeUrl()
        res.send('done');

    } catch (error) {
        debug({ error })
        res.send(error.message)
    }
}
module.exports = {
    scrape
}
const scrapeUrl = async () => {
    // const htmlPath = path.join(__dirname) + '/../../../gofI.html';
    // const file = await fs.readFileSync(htmlPath, { encoding: 'utf-8' })
    const request = await axios.get('https://www.mohfw.gov.in/');
    const file = request.data;
    const $ = cheerio.load(file);

    const arr = []
    $('.content table tbody', '#cases')
        .children('tr')
        .each(function (i, el) {
            const dataArr = $(this).children().map(function () {
                return $(this).text().trim();
            })
            arr.push({
                id: dataArr[0],
                name: dataArr[1],
                confirmed_indian: dataArr[2],
                confirmed_foreigner: dataArr[3],
                cured_discharged_migrated: dataArr[4],
                death: dataArr[5],
            })
        });
    arr.splice(arr.length - 2, 2)
    const total = arr.reduce((a, c) => {
        return {
            confirmed_indian: (a.confirmed_indian | 0) + +c.confirmed_indian,
            confirmed_foreigner: (a.confirmed_foreigner | 0) + +c.confirmed_foreigner,
            cured_discharged_migrated: (a.cured_discharged_migrated | 0) + +c.cured_discharged_migrated,
            death: (a.death | 0) + +c.death,
        }
    }, {})
    const today = new Date();
    const todayString = `${today.getDate()}-${today.getMonth()}-${today.getFullYear()}`
    const outputPath = path.join(__dirname) + '/../../../output/' + todayString + '.json'
    await fs.writeFileSync(outputPath, JSON.stringify({ data: arr, total }, null, 4));
}