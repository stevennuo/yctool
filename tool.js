/**
 * Created by 3er on 12/8/14.
 */


//Set the node environment variable if not set before
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Module dependencies.
 */
var express = require('express');
var bodyParser = require('body-parser');
var config = require('./config/config');
var op = require('./op');

// config
var app = express()
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.
    urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
var port = process.env.NODE_PORT || config.port;
var PRIVATE = require('./config/private')
var qiniu = require('qiniu')
qiniu.conf.ACCESS_KEY = PRIVATE.qiniu.ACCESS_KEY
qiniu.conf.SECRET_KEY = PRIVATE.qiniu.SECRET_KEY
var mongoose = require('mongoose');
var db = mongoose.connect(config.db, function (err) {
    if (err) throw err;

    // Operation
    op(qiniu, mongoose, app);


    // Demo
    //qiniuOp(qiniu, 'ghxz');
    //dbOp(mongoose);
    //web(app, port);
});

// express demo
var web = function (app, port) {
    app.get('/', function (req, res) {
        res.send('Hello World!')
    })
    var server = app.listen(port, function () {
        var host = server.address().address
        var port = server.address().port
        console.log('Example app listening at http://%s:%s', host, port)
    })
}

// qiniu demo
var qiniuOp = function (qiniu, bucket) {
    var client = new qiniu.rs.Client();
    var marker = null;
    qiniu.rsf.listPrefix(bucket, '', marker, 100, function (err, ret) {
        if (err) throw err;
        // process ret.marker & ret.items
        console.log(ret.marker);
        console.log(ret.items);
    });
}

// mongoose demo
var dbOp = function (mongoose) {
    var Chapter = mongoose.model('Chapter',{})
    Chapter.find({}, function (err, docs) {
        if (err) throw err
        console.log(docs.toString())
    })
}