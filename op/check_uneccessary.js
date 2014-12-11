/**
 * Created by 3er on 12/8/14.
 */

var _ = require('underscore');

module.exports = function(qiniu, mongoose){
    check('yc-course-video', [{COLL:'Video', FIELD:'url'}], qiniu, mongoose);
    check('yc-course', [
        {COLL:'Chapter', FIELD:'icon'},
        {COLL:'Activity', FIELD:'icon'}]
        ,qiniu, mongoose);
}

var check = function (bucket, fields, qiniu, mongoose) {
    var marker
    qiniu.rsf.listPrefix(bucket, '', marker, 1000, function (err, ret) {
        if (!err) {
            // process ret.marker & ret.items
            //console.log(ret.items)
            var results = _.pluck(ret.items, 'key');
            console.log('before delete:' + ret.items.length)
            var iter = function (callback, results) {
                var item = fields.pop();
                if (item) {
                    var query = {};
                    query[item['FIELD']] = String;
                    var model = mongoose.model(item['COLL'], query);
                    model.find({}, function (err, docs) {
                        var marked = _.map(docs, function (doc) {
                            var keys = (/^http:\/\/[^.]*\.qiniudn\.com\/(.*)/g).exec(doc[item['FIELD']]);
                            var key = keys ? keys[1] : null;
                            return key;
                        });
                        console.log('find:'+marked.length);
                        results = _.difference(results, marked);
                        console.log('rest:'+results.length);
                        iter(callback, results);
                    });
                } else {
                    callback(results);
                }
            }

            iter(function(results){
                console.log('after:'+results.length)
                if(results.length <= 0) return;
                var a = results.map(function(result){
                    return new qiniu.rs.EntryPath(bucket, result)
                })

                var client = new qiniu.rs.Client();

                client.batchDelete(a, function(err, ret) {
                    if (!err) {
                        for (i in ret) {
                            if (ret[i].code !== 200) {
                                // parse error code
                                console.log(ret[i].code, ret[i].data);
                                // http://docs.qiniu.com/api/file-handle.html#error-code
                            }
                        }
                    } else {
                        console.log(err);
                        // http://docs.qiniu.com/api/file-handle.html#error-code
                    }
                });
            }, results);

        }
    });
}
