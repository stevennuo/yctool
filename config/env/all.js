'use strict';

var path = require('path'),
    rootPath = path.normalize(__dirname + '/../..')

var PRIVATE = require('./../private')
var qiniu = require('qiniu')
qiniu.conf.ACCESS_KEY = PRIVATE.qiniu.ACCESS_KEY
qiniu.conf.SECRET_KEY = PRIVATE.qiniu.SECRET_KEY

module.exports = {
    root: rootPath,
    port: process.env.PORT || 3000,
    qiniu: qiniu
}