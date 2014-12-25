/**
 * Created by 3er on 12/11/14.
 */

var _ = require('underscore')


var TARGET = 'yc-course-video';
var TRANSMIT = 'yc-test';
var WATERMARK = 'http://yc-public.qiniudn.com/wm.png';


// PersistentId query
// http://api.qiniu.com/status/get/prefop?id=<persistentId>

module.exports.transform = function(qiniu, mongoose){
    transform(TARGET, TRANSMIT, qiniu, mongoose);
}

module.exports.copy = function(qiniu, mongoose){
    bucket_copy(TRANSMIT, TARGET, qiniu, mongoose);
}

module.exports.compress = function(qiniu, mongoose){
    compress('yc-test1','yc-public', '5477dd19202eece73212254d', '13',qiniu, mongoose);
}

var bucket_copy = function(src, dest, qiniu, mongoose){
    var marker;
    qiniu.rsf.listPrefix(src, '', marker, 1000, function(err, ret) {
        var copy_paths = [], delete_paths = [];
        if (!err) {
            // process ret.marker & ret.items

            var keys = _.pluck(ret.items, 'key');
            console.log(keys);
            keys.forEach(function(key){
                copy_paths.push(new qiniu.rs.EntryPathPair(new qiniu.rs.EntryPath(src, key), new qiniu.rs.EntryPath(dest, key)));
                delete_paths.push(new qiniu.rs.EntryPath(dest, key));
            });
            var client = new qiniu.rs.Client();
            client.batchDelete(delete_paths, function (err, ret) {
                if (!err) {
                    for (i in ret) {
                        if (ret[i].code !== 200) {
                            // parse error code
                            console.log(ret[i].code, ret[i].data);
                            // http://docs.qiniu.com/api/file-handle.html#error-code
                        }
                    }
                    client.batchCopy(copy_paths, function (err, ret) {
                        if (!err) {
                            for (i in ret) {
                                if (ret[i].code !== 200) {
                                    // parse error code
                                    console.log(ret[i].code, ret[i].data)
                                    // http://docs.qiniu.com/api/file-handle.html#error-code
                                }
                            }
                        } else {
                            console.log(err);
                            // http://docs.qiniu.com/api/file-handle.html#error-code
                        }
                    });
                } else {
                    console.log(err);
                    // http://docs.qiniu.com/api/file-handle.html#error-code
                }
            });
        } else {
            console.log(err)
            // http://docs.qiniu.com/api/file-handle.html#list
        }
    });
}

var transform = function(src, dest, qiniu, mongoose){
    var marker;
    qiniu.rsf.listPrefix(src, '', marker, 1000, function(err, ret) {
        if (!err) {
            // process ret.marker & ret.items
            var keys = _.pluck(ret.items, 'key');
            keys.forEach(function(key){
                compress(src, dest, key, key, qiniu, mongoose);
            })
        } else {
            console.log(err)
            // http://docs.qiniu.com/api/file-handle.html#list
        }
    });
}

var compress = function (src, dest, key, target, qiniu, mongoose) {
//    var ops = 'avthumb/mp4/ab/256k/ar/48000/r/25/vb/2m/vcodec/libx264/acodec/libfaac/s/854x480/autoscale/1/stripmeta/1/wmImage/'
//    var ops = 'avthumb/mp4/ab/256k/ar/44100/r/25/vb/256k/vcodec/libx264/acodec/libfaac/s/854x480/autoscale/1/stripmeta/1/wmImage/'
    var ops = 'avthumb/mp4/wmImage/'
        + qiniu.util.urlsafeBase64Encode(WATERMARK)
        + '/wmGravity/SouthEast/'
        + '|saveas/' + qiniu.util.urlsafeBase64Encode(dest+':'+target);

    qiniu.fop.pfop(src, key, ops, {}, function (err, ret) {
//        ret.should.have.keys('persistentId');
        if(err) throw err;
        console.log('ok:' + ret.persistentId);
    });
}