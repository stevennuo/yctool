/**
 * Created by 3er on 12/11/14.
 */

var SRC_BUCKET = 'mothership';
var DEST_BUCKET = 'yc-public';
var key = '5477dd19202eece73212254d';
var target = '6';
var watermark = 'http://yc-public.qiniudn.com/watermark1.png';

module.exports = function(qiniu, mongoose){
    compress(SRC_BUCKET, DEST_BUCKET, key, target, watermark, qiniu, mongoose);
}

var compress = function (SRC_BUCKET, DEST_BUCKET, key, target, watermark, qiniu, mongoose) {
    var ops = 'avthumb/mp4/ab/256k/ar/48000/r/25/vb/2m/vcodec/libx264/acodec/libfaac/s/854x480/autoscale/1/stripmeta/1/wmImage/'
        + qiniu.util.urlsafeBase64Encode(watermark)
        + '/wmGravity/NorthEast'
        + '|saveas/' + qiniu.util.urlsafeBase64Encode(DEST_BUCKET+':'+target);

    qiniu.fop.pfop(SRC_BUCKET, key, ops, {}, function (err, ret) {
//        ret.should.have.keys('persistentId');
        if(err) throw err;
        console.log('ok:' + ret.persistentId);
    });
}