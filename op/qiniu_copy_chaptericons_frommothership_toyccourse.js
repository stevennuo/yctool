/**
 * Created by 3er on 12/8/14.
 */

module.exports = function (qiniu, mongoose) {
    var Chapter = mongoose.model('Chapter', {icon: String})
    Chapter.find({}, function (err, docs) {
        if (err) throw err
//        console.log(docs.toString())
        var copyPairs = []
        var deletePairs = []
        docs.forEach(function (doc) {
            var keys = (/^http:\/\/mothership\.qiniudn\.com\/(.*)/g).exec(doc.icon);
            var key = keys ? keys[1] : null;
            if (key) {
                console.log(key)
                copyPairs.push(new qiniu.rs.EntryPathPair(
                    new qiniu.rs.EntryPath('mothership', key),
                    new qiniu.rs.EntryPath('yc-course', key)
                ));
                deletePairs.push(new qiniu.rs.EntryPath('yc-course', key))
                doc.icon = "http://yc-course.qiniudn.com/" + key
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