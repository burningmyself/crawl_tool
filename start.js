var eventproxy = require('eventproxy'),
    request = require('request'),
    fs = require('fs'),
    async = require('async'),
    praseurl = require('url'),
    cheerio = require("cheerio");

const schedule = require("node-schedule");

const url = "http://www.pandai.cn";
const hostname = 'www.pandai.cn';
var urlArray = [];
var cookieToken = {};

var collectionName = 'urlArray';//集合名称

var count=0;//请求次数

//主程序运行
exports.start = (getUrl, ct) => {
    var options = {
        url: getUrl,
        gzip: true,
        headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'zh-CN,zh;q=0.8',
            'Cache-Control': 'max-age=0',
            'Connection': 'keep-alive',
            'Cookie': ct.cookie,
            'Host': 'www.pandai.cn',
            'If-None-Match': 'W/"45af33a6799f9d734cee6006cc14f58a"',
            'Referer': 'https://www.pandai.cn/sessions/new',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36',
        }
    }
    request.get(options, (err, res, body) => {
        if (err) {
            console.log(err);
            return;
        }
        var html = body.toString();
        cookieToken = this.setTokenCookie(res, html);
        //获取主页面所有超链接
        this.parseAsaveUrlArray(html);
        //this.loop();
        console.log(urlArray);
        //秒、分、时、日、月、周几
        schedule.scheduleJob('0 * * * * *', this.loop);
       });
};
//重新设置cookie,token
exports.setTokenCookie = (res, html) => {
    var cookie = res.headers["set-cookie"];
    $ = cheerio.load(html);
    var token = $('meta[name="csrf-token"]').attr('content') || token;
    return { 'cookie': cookie, 'token': token };
};
//解析主页a标签并存入urlArray
exports.parseAsaveUrlArray = (html) => {
    $ = cheerio.load(html);
    var aLables = $('a');
    urls=[];
    for (let i = 0; i < aLables.length; i++) {
        let href = aLables.eq(i).attr('href');
        if (href == '#' || href == '/') {
            continue;
        }
        if (href.indexOf('http')) {
            urls.push(url + href);
            continue;
        }
        urls.push(href);
    }
   
    for(let i=0;i<urls.length;i++){
        if(urls[i].startsWith('http://www.pandai.cn')||urls[i].startsWith('https://www.pandai.cn')){
            if(!urls[i].endsWith('javascript:void(0)'))
            urlArray.push(urls[i]);
        }
    }
    return urlArray;
}
//请求每次url
exports.run=()=>{
    for(let i=0;i<urlArray.length;i++){
        this.eachRequest(url);
    }
}
exports.eachRequest=(url)=>{
    options = {
        url:url,
        gzip: true,
        headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'zh-CN,zh;q=0.8',
            'Cache-Control': 'max-age=0',
            'Connection': 'keep-alive',
            'Cookie': cookieToken.cookie,
            'Host': 'www.pandai.cn',
            'If-None-Match': 'W/"45af33a6799f9d734cee6006cc14f58a"',
            'Referer': 'https://www.pandai.cn/sessions/new',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36',
        }
    };
   request.post(options,(err,res,body)=>{
        if (err) {
            console.log(err);
            return;
        }
        var html = body.toString();
        //cookieToken = this.setTokenCookie(res, html);
        //console.log(html);
   });
}
//循环请求
exports.loop=()=>{
    for(let i=0;i<10;i++){
        let num = parseInt(Math.random() * 1000);
        //start();
        try {
            setTimeout(this.run, num);
        } catch (error) {
            this.loop();
        }            
    }
    count++;
    console.log(count);
}

process.on('uncaughtException', function (err) {
    console.error(err.stack);
    schedule.clearTimeout;
    let time = setTimeout(() => {
        if (time != null) {
            clearTimeout(time);
            return;
        }
        schedule.scheduleJob('0 * * * * *', this.loop);
    }, 10000);
});