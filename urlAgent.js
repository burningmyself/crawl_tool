var superagent = require('superagent'),
    mongoose = require('mongoose'),
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

var mongourl = 'mongodb://localhost:27017/' + dataName;

var urlArray;
//init data connection
var db_collection;
db.connect(dataName, collectionName, (err, collection) => {
    if (err) throw err;
    db_collection = collection;
    db.find(db_collection, {}, (err, result) => {
        if (err) throw err;
        urlArray = result[0].urls;
        agentUrl(urlArray);
    });
});

function agentUrl(urlArray) {
    mongoose.connect(mongourl);
    var Schema = mongoose.Schema;
    //骨架模版  
    var hrefSchema = new Schema({
        href : String
    })
    //模型  
    var href = mongoose.model('href', hrefSchema);
    //存储数据  
    urlArray.forEach(function (url) {
        superagent.get(url)
            .end(function (err, page) {
                if (err) {
                    console.log(err.message);
                    return;
                }
                var $ = cheerio.load(page.text);
                var quoteUrls = $('a');
                for (var i = 0; i < quoteUrls.length; i++) {
                    var urlhref = '{href:"' + quoteUrls.eq(i).attr("href") + '"},';
                    var h = new href({
                        href : urlhref
                    })
                    //保存数据库  
                    h.save(function (err) {
                        if (err) {
                            console.log('保存失败')
                            return;
                        }
                        console.log('ok');
                    })
                }
            })
    });
}