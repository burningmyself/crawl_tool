const querystring=require('querystring');
const http = require("http");
// const https = require("https");
const cheerio = require("cheerio");
const schedule = require("node-schedule");

const url='ecidcwc.mps.gov.cn';
const arrPhone=[
    '18227424528',
    '18602309535',
    '18580231013',
    '13280866381',
    '15825972267',
    '15883205388',
    '15823149180',
    '15213271783',
    '13167874777',
    '18523346129'
]
var phoneNo='13280866381';
var count=0;
// loop();
//秒、分、时、日、月、周几
// schedule.scheduleJob('90 * * * * *', loop);
loop();
setInterval(loop,90000);
function loop(){
    for(let i=0;i<10;i++){
        phoneNo=arrPhone[i];
        start();
    }
}
function start(){
let nocache=Math.random();
let postData = querystring.stringify({
  'phoneNo' : phoneNo,
  'nocache':nocache
});

let option={
    hostname: url,
    port: 80,
    path: '/register/sendMsg',
    method: 'POST',
    headers: {
        'Accept':'application/json, text/javascript, */*; q=0.01',
        'Accept-Encoding':'gzip, deflate',
        'Accept-Language':'zh-CN,zh;q=0.8',
        'Connection':'keep-alive',
        'Content-Length':Buffer.byteLength(postData),
        'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
        'Host':url,
        'Origin':'null',
        'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
    }

}
//console.log(postData);
let req= http.request(option,(res)=>{
        console.log(`状态码: ${res.statusCode}`);
        console.log(`响应头: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
        let msg='';
        res.on('data',(chunk)=>{
            msg+=chunk;
        });
        res.on('end',()=>{
             count++;
             console.log(msg);
             console.log('发送次数:'+count);
        });
    });
    req.on('error',(e)=>{
        console.log(e.message);
    });
    req.write(postData);
    req.end();
}
