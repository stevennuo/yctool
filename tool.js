/**
 * Created by 3er on 12/8/14.
 */


//Set the node environment variable if not set before
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Module dependencies.
 */
var express = require('express');
var config = require('./config/config');
var mongoose = require('mongoose');
var db = mongoose.connect(config.db, function (err) {
    if (err) throw err;
    var port = process.env.NODE_PORT || config.port;
    var qiniu = config.qiniu;

    //qiniuOp(qiniu, 'ghxz');

    //web(port);

});

// express demo
var web = function(port){
    var app = express()
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
var qiniuOp = function(qiniu, bucket){
    var client = new qiniu.rs.Client();
    var marker = null;
    qiniu.rsf.listPrefix(bucket, '', marker, 100, function(err, ret) {
        if (!err) {
            // process ret.marker & ret.items
            console.log(ret.marker);
            console.log(ret.items);
        } else {
            console.log(err)
            // http://docs.qiniu.com/api/file-handle.html#list
        }
    });
}