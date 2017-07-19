const http = require("http");
// const https = require("https");
const cheerio = require("cheerio");
// const querystring = require("querystring");
// const eventproxy=require("eventproxy");
const schedule = require("node-schedule");

const url = "http://www.cnblogs.com/burningmyself/p/";
const url_prefix = "http://www.cnblogs.com";
var cookieToken = {};
var count = 0;
//秒、分、时、日、月、周几
schedule.scheduleJob('0 * * * * *', loop);
function loop() {

    for (let i = 0; i < 60; i++) {
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
    http.get(url, (res) => {
        var html = "";
        var titles = [];
        res.setEncoding("utf-8");
        res.on('data', (chunk) => {
            html += chunk;
        });
        res.on("end", () => {
            var $ = cheerio.load(html);
            let $pagelist = $(".Pager").first().find('a');
            $pagelist.each((index, item) => {
                if (index + 1 != $pagelist.length)
                    pagelist(url_prefix + item.attribs.href);
            });
            var link_title = $(".postTitl2 a").each((index, item) => {
                let num = parseInt(Math.random() * 1000000);
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

function pagelist(url_page) {
    http.get(url_page, (res) => {
        var html = "";
        res.on("data", (chunk) => {
            html += chunk;
        });
        res.on("end", () => {
            var $ = cheerio.load(html);
            var link_title = $(".postTitl2 a").each((index, item) => {
                article_details(item.attribs.href);
            });
        });
        res.on("error", (err) => {
            console.log(err);
        });
    });
}
function article_details(url_detail) {
    http.get(url_detail, (res) => {
        var html = "";
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
    //console.error(err.stack);
    schedule.clearTimeout;
    let time = setTimeout(() => {
        if (time != null) {
            clearTimeout(time);
            return;
        }
        schedule.scheduleJob('0 * * * * *', loop);
    }, 10000);
});

