/**
 * Created by 3er on 12/8/14.
 */



module.exports = function (qiniu, mongoose) {
//    require('./op/check_uneccessary')(qiniu,mongoose)
//    require('./op/qiniu_copy')(qiniu,mongoose)
//    require('./op/watermark').transform(qiniu,mongoose)
    require('./op/watermark').compress(qiniu,mongoose)
//    require('./op/watermark').copy(qiniu,mongoose)
//    require('./op/format_video')(qiniu,mongoose)
}

