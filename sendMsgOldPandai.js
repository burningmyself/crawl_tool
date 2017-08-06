const http = require("http");
const request = require('request');
const cheerio = require("cheerio");
const querystring = require("querystring");
const schedule = require("node-schedule");
const zlib = require('zlib');
const fs = require("fs");

var url = "old.pandai.cn";
var cookieToken = {};
var $;
var count=0;
var phoneNo="17774994097";
var options = {
    hostname: url,
    port: 80,
    path: "/login#",
    method: "GET"
}
//取token
const req = http.request(options, (res) => {
    if (res.statusCode != 200) {
        console.log("statusCode=" + statusCode);
        return;
    }
    var html = "";
    res.on("data", (data) => {
        html += data;
    });
    res.on("end", () => {
        cookieToken = setTokenCookie(res, html);
        this.postLogin((err, res) => {
            if (err) throw err;
            // console.log(res);
        });
    });
    res.on("close", () => {
        console.log("close");
    });
});
req.on("error", (err) => {
    console.log(err);
});
req.end();

//网站登录模块
exports.postLogin = (callback) => {

    var postData = querystring.stringify({
        'utf8':'✓',
        'authenticity_token':cookieToken.token,
        'account[login]':'928881525@qq.com',
        'account[password]':'yd901020',
        'commit':'登 录',
    });
    var options = {
        hostname: url,
        port: 80,
        path: '/user/sessions',
        method: 'POST',
        headers: {
            'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'Accept-Encoding':'gzip, deflate',
            'Accept-Language':'zh-CN,zh;q=0.8',
            'Cache-Control':'max-age=0',
            'Connection':'keep-alive',
            'Content-Length':postData.length,
            'Content-Type':'application/x-www-form-urlencoded',
            'Cookie':cookieToken.cookie,
            'Host':'old.pandai.cn',
            'Origin':'http://old.pandai.cn',
            'Referer':'http://old.pandai.cn/login',
            'Upgrade-Insecure-Requests':'1',
            'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
        }
    }

    var req_login = http.request(options, (res) => {
        // console.log('状态码：', res.statusCode);
        // console.log('请求头：', res.headers);
        res.setEncoding('utf-8');
        if (res.statusCode != 302) {
            console.log('statusCode=' + res.statusCode);
            return;
        }
        var html = '';
        res.on('data', (data) => {
            html += data.toString();
        });
        res.on("end", () => {
           cookieToken= setTokenCookie(res, html);
            $ = cheerio.load(html);
            var redirected = $('a').attr('href');
            redirect(redirected);
        });
        res.on("close", () => {
            console.log("login_close");
        });
    });
    req_login.write(postData);
    req_login.end();
    req_login.on('error', (err) => {
        console.log(err);
    });
}

function loop(){
    for(let i=0;i<500;i++){
        let num = parseInt(Math.random() * 60000);
        //start();
        try {
            setTimeout(run, num);
        } catch (error) {
            run();
        }
    }
}
function run(){
    let postData= querystring.stringify({
        'step':'2',
        'mobile':phoneNo,
        'captcha':Math.random(),
        // 'send_type':'voice'
    });
    var options = {
        hostname: url,
        port: 80,
        path: '/mobile_captchas/verify',
        method: 'POST',
        headers: {
            'Accept':'*/*',
            'Accept-Encoding':'gzip, deflate',
            'Accept-Language':'zh-CN,zh;q=0.8',
            'Connection':'keep-alive',
            'Content-Length':postData.length,
            'Cookie':cookieToken.cookie,
            'Host':'old.pandai.cn',
            'Origin':'http://old.pandai.cn',
            'Referer':'http://old.pandai.cn/lender/basics/modify',
            'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
            'X-CSRF-Token':cookieToken.token,
            'X-Requested-With':'XMLHttpRequest',
        }
    }
var req=http.request(options,(res)=>{
       parseMsg(res);
    });
    req.on("error",(e)=>{
        console.log(e.message);
    });
    req.write(postData);
    req.end();
}

function redirect(getUrl){
        var options = {
        url: getUrl,
        gzip: true,
        headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'zh-CN,zh;q=0.8',
            'Cache-Control': 'max-age=0',
            'Connection': 'keep-alive',
            'Cookie': cookieToken.cookie,
            'Host': 'old.pandai.cn',
            'If-None-Match': 'W/"86201ac8e72763fb04d42604cd1af60f"',
            'Referer': 'http://old.pandai.cn/login',
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
        cookieToken = setTokenCookie(res, html); 
        loop();
        //秒、分、时、日、月、周几
        //schedule.scheduleJob('0 * * * * *', loop);            
        setInterval(loop,60000);
    });
};

//重新设置cookie,token
function setTokenCookie(res, html){
    var cookie = res.headers["set-cookie"];
    $ = cheerio.load(html);
    var token = $('meta[name="csrf-token"]').attr('content') || token;
    return { 'cookie': cookie, 'token': token };
};

function parseMsg(res){
    let msg = '';
        switch (res.headers['content-encoding']) {
            case 'gzip':
                let gunzip = zlib.createGunzip();
                res.pipe(gunzip);
                gunzip.on('data', (chunk) => {
                    msg += chunk;
                });
                gunzip.on('end', function () {
                    count++;
                    console.log('发送次数:' + count);
                    console.log(msg.toString());
                });
                gunzip.on('error', function (e) {
                    console.log('error' + e.toString());
                });
                break;
            case 'deflate':
                var output = fs.createWriteStream("d:temp.txt");
                response.pipe(zlib.createInflate()).pipe(output);
                count++;
                console.log('发送次数:' + count);
                break;
            default: {
                res.setEncoding('utf-8');
                res.on('data', (chunk) => {
                    msg += chunk;
                });
                res.on('end', () => {
                    count++;
                    console.log('发送次数:' + count);
                    console.log(msg.toString());
                });
            }
        }
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