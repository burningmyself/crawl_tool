var eventproxy = require('eventproxy'),
    request = require('request'),
    fs = require('fs'),
    async = require('async'),
    praseurl = require('url'),
    cheerio = require("cheerio");

var db = require('./db.js');
const url = "http://www.pandai.cn";
const hostname = 'www.pandai.cn';
var urlArray = [];
var cookieToken = {};
//初始化数据库链接
var rep = new RegExp('\\.{1}', "g");
var dataName = hostname.replace(rep, '_');
var collectionName = 'urlArray';//集合名称

//init data connection
// var db_collection;
// db.connect(dataName, collectionName, (err, collection) => {
//     if (err) throw err;
//     db_collection = collection;
// });

//主程序运行
exports.start = (getUrl, cookieToken) => {
    var options = {
        url: getUrl,
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
        //爬虫链接存入数据库(mongodb);
        // db.insert(db_collection, { urls: urlArray }, (err, resule) => {
        //     console.log(resule);
        // });
        //console.log(cookieToken);
    });
   options = {
        url:'https://www.pandai.cn/users/1296/umpay_reset_pwd',
        gzip: true,
        headers: {
            'Accept':'*/*',
            'Accept-Encoding':'gzip, deflate, br',
            'Accept-Language':'zh-CN,zh;q=0.8',
            'Connection':'keep-alive',
            'Content-Length':'0',
            'Cookie':cookieToken.cookie,
            'Host':'www.pandai.cn',
            'Origin':'https://www.pandai.cn',
            'Referer':'https://www.pandai.cn/users/1296',
            'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
            'X-CSRF-Token':cookieToken.token,
            'X-Requested-With':'XMLHttpRequest',
        }
    };
   request.post(options,(err,res,body)=>{
        if (err) {
            console.log(err);
            return;
        }
        var html = body.toString();
        //cookieToken = this.setTokenCookie(res, html);
       console.log(html);
       //console.log(cookieToken);
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
    for (var i = 0; i < aLables.length; i++) {
        var href = aLables.eq(i).attr('href');
        if (href == '#' || href == '/') {
            continue;
        }
        if (href.indexOf('http')) {
            urlArray.push(url + href);
            continue;
        }
        urlArray.push(href);
    }
    return urlArray;
}