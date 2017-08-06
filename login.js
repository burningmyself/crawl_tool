const https = require("https");
const cheerio = require("cheerio");
const querystring = require("querystring");
var start = require('./start');
var url = "www.pandai.cn";
var cookieToken = {};
var $;
var options = {
    hostname: url,
    port: 443,
    path: "/login#",
    method: "GET"
}
//取token
const req = https.request(options, (res) => {
    if (res.statusCode != 200) {
        console.log("statusCode=" + statusCode);
        return;
    }
    var html = "";
    res.on("data", (data) => {
        html += data;
    });
    res.on("end", () => {
        cookieToken = start.setTokenCookie(res, html);
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
        'utf8': '✓',
        'authenticity_token': cookieToken.token,
        'user[login]': '928881525@qq.com',
        'user[password]': 'helloworld',
        'commit': '登录'
    });
    var options = {
        hostname: url,
        port: 443,
        path: '/sessions',
        method: 'POST',
        headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'zh-CN,zh;q=0.8',
            'Cache-Control': 'max-age=0',
            'Connection': 'keep-alive',
            'Content-Length': postData.length,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': cookieToken.cookie,
            'Host': 'www.pandai.cn',
            'Origin': 'https://www.pandai.cn',
            'Referer': 'https://www.pandai.cn/login',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36',
        }
    }

    var req_login = https.request(options, (res) => {
        // console.log('状态码：', res.statusCode);
        // console.log('请求头：', res.headers);
        if (res.statusCode != 302) {
            console.log('statusCode=' + res.statusCode);
            return;
        }
        var html = '';
        res.on('data', (data) => {
            html += data.toString();
        });
        res.on("end", () => {
           cookieToken= start.setTokenCookie(res, html);
            $ = cheerio.load(html);
            var redirected = $('a').attr('href');
            // console.log(redirected);
            //  console.log("login_end=" + html);
            //  console.log(cookieToken);
            start.start(redirected,cookieToken);
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
