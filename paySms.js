const querystring = require('querystring');
const https = require("https");
// const https = require("https");
const cheerio = require("cheerio");
const schedule = require("node-schedule");
const zlib = require('zlib');
const fs = require("fs");

const url = 'pay.soopay.net';


var count = 0;

// loop();
//秒、分、时、日、月、周几
// schedule.scheduleJob('90 * * * * *', loop);
start();
setInterval(start, 15000);

function start() {
   let trace=Date.now();
    console.log(trace);
    let querystr='rpid='+trace+'&userId=UB201608240030010000000010548876&cnapsCode=&orderId=&signSource=05ac83533efa77496c95f71784757e98fb496829&trace='+trace+'&instId=00000012&orderDate=20170729&merId=7001231&mobileId=15696434348&signKey=p2pMerUnBindAgreementKey&service=mer_unbind_agreement&bProductIds=B200200G&userUnBindAgreementList=ZTBB0G00&';
    let option = {
        hostname: url,
        port: 443,
        path: '/spay/pay/p2pUserAjaxVerifyCodeSms.do?'+querystr,
        method: 'POST',
        headers: {
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'zh-CN,zh;q=0.8',
            'Connection': 'keep-alive',
            'Content-Length':'0',
            'Cookie': 'JSESSIONID=abdAjcfJ2TSIh4u2Fmo2v',
            'Host': 'pay.soopay.net',
            'Origin': 'https://pay.soopay.net',
            'Referer': 'https://pay.soopay.net/spay/pay/payservice.do?service=mer_unbind_agreement&sign_type=RSA&charset=UTF-8&res_format=HTML&mer_id=7001231&version=1.0&user_id=UB201608240030010000000010548876&user_unbind_agreement_list=ZTBB0G00&sourceV&ret_url=https%3A%2F%2Fwww.pandai.cn%2Fumpay%2Fbind_agreements%2F265U%2Fcallback&notify_url=https%3A%2F%2Fwww.pandai.cn%2Fumpay%2Fbind_agreements%2F265U%2Fnotify&sign_type=RSA&sign=PHwGHXDhkA2U8TM4nC0eaTrmlysUVKM83GRuslSPkwT38ws9SlSz0ndfWBU6Q9WPht9ZS1OYJYnBKmmP1VW%2FvsbOpSAciVEkfW5g98dZnMo1YGXErDUi8Gzb4DV8z2MCH7G8MP18Dg5PqRtuzUzZ6HZEVSWaSsOvODatzq4fkVs%3D',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
            'X-Requested-With': 'XMLHttpRequest',
        }

    }
    //console.log(postData);
    let req = https.request(option, (res) => {
        // console.log(`状态码: ${res.statusCode}`);
        // console.log(`响应头: ${JSON.stringify(res.headers)}`);

        parseMsg(res);

    });
    req.on('error', (e) => {
        console.log(e.message);
    });
    //req.write(querystr);
    req.end();
}

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