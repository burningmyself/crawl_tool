var MongoClient = require("mongodb").MongoClient;
var assert = require("assert");
var _url = "mongodb://localhost:";
var _port = 27017;
var _dataName = "test";


exports.connect = (dataName, collectionName,callback) => {
    _dataName = dataName || _dataName;
    var localhost = _url + _port + '/' + _dataName;
    MongoClient.connect(localhost, (err, db) => {
        if (err) throw err;
        db.collection(collectionName,callback);
    });
};

exports.insert = (collection, obj, callback) => {
    assert.notEqual(collection, null, "_connection对象为null");
    collection.insert(obj, callback);
};
exports.find = (collection, where, callback) => {
    assert.notEqual(collection, null, "_connection对象为null");
    collection.find(where).toArray(callback);
};
exports.findOne = (collection, where, callback) => {
    assert.notEqual(collection, null, "_connection对象为null");
    return collection.findOne(where, callback);
};
exports.pageFind = function (collection, limit, skip, w1, w2, callback) {
    assert.notEqual(collection, null, "_connection对象为null");
    if (arguments.length == 5) {

    }
    switch (arguments.length) {
        case 5: {
            var callback = w2;
            var w2 = {}; break;
        }
        case 6: break;
        default: throw new Error("参数必须为5个或者6个");
    }
    collection.find(w1).skip(skip).limit(limit).toArray(callback);
};
exports.removeMany = function (collection, obj, callback) {
    assert.notEqual(collection, null, "_connection对象为null");
    if (callback) {
        collection.removeOne(obj, callback);
    } else {
        collection.removeMany();
    }
}

