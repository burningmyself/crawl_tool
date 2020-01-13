// const http = require("http");
const https = require("https");
const cheerio = require("cheerio");
// const querystring = require("querystring");
// const eventproxy=require("eventproxy");
const schedule = require("node-schedule");

const url = "https://blog.csdn.net/yd901020";


var count = 0;


//秒、分、时、日、月、周几
schedule.scheduleJob('0 * * * * *', loop);

function loop() {

    for (let i = 0; i <60; i++) {
        let num = parseInt(Math.random() * 40000);
        //start();
        try {
            setTimeout(start, num);
        } catch (error) {
            start();
        }
    }
}
function start() {
    https.get(url, (res) => {
        let html = "";
        res.setEncoding("utf-8");
        res.on('data', (chunk) => {
            html += chunk;
        });
        res.on("end", () => {
            let $ = cheerio.load(html);
            var link_title = $(".article-list .article-item-box a").each((index, item) => {
                let num = parseInt(Math.random() * 10000);
                setTimeout(() => {
                    article_details(item.attribs.href);
                }, num)
            });
        });
        res.on("error", (err) => {
            console.log(err);
        });
    });
}


function article_details(url_detail) {
    https.get(url_detail, (res) => {
        let html = "";
        res.on("data", (chunk) => {
            html += chunk;
        });
        res.on("end", () => {
            count++;
            console.log(count);
        });
        res.on("error", (err) => {
            console.log(err);
        });
    });
}

process.on('uncaughtException', function (err) {
    console.error(err.stack);
    schedule.clearTimeout;
    let time = setTimeout(() => {
        if (time != null) {
            clearTimeout(time);
            return;
        }
        schedule.scheduleJob('0 * * * * *', loop);
    }, 10000);
});
