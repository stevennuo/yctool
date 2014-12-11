/**
 * Created by 3er on 12/8/14.
 */


module.exports = function(qiniu, mongoose){
    copy('mothership',  'yc-course-video',  'Video',    'url',  qiniu,  mongoose)
    copy('mothership',  'yc-course',        'Chapter',  'icon', qiniu,  mongoose)
    copy('mothership',  'yc-course',        'Activity', 'icon', qiniu,  mongoose)
}

var copy = function (qiniu, mongoose, SRC, DEST, COLL, FIELD) {
    var query = {};
    query[FIELD] = String;
    var model = mongoose.model(COLL, query);
    model.find({}, function (err, docs) {
        if (err) throw err
//        console.log(docs.toString())
        var copyPairs = []
        var deletePairs = []
        docs.forEach(function (doc) {
            // TODO:
            var keys = (/^http:\/\/mothership\.qiniudn\.com\/(.*)/g).exec(doc[FIELD]);
            var key = keys ? keys[1] : null;
            if (key) {
                console.log(key)
                copyPairs.push(new qiniu.rs.EntryPathPair(
                    new qiniu.rs.EntryPath(SRC, key),
                    new qiniu.rs.EntryPath(DEST, key)
                ));
                deletePairs.push(new qiniu.rs.EntryPath(DEST, key))
                doc[FIELD] = 'http://'+DEST+'.qiniudn.com/' + key
                doc.save();
            }
        });
        var client = new qiniu.rs.Client();

        client.batchDelete(deletePairs, function (err, ret) {
            if (!err) {
                for (i in ret) {
                    if (ret[i].code !== 200) {
                        // parse error code
                        console.log(ret[i].code, ret[i].data);
                        // http://docs.qiniu.com/api/file-handle.html#error-code
                    }
                }
                client.batchCopy(copyPairs, function (err, ret) {
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
    })
};