/**
 * Created by 3er on 12/15/14.
 */

var _ = require('underscore');

module.exports = function (qiniu, mongoose) {
    var task = mongoose.model('Task', {type: String, activities: []});
    task.find({type: 'advanced'}, function (err, docs) {
//        console.log(docs.length)
        var arr = _.chain(docs).pluck('activities').flatten().unique().compact().value();
        var activity = mongoose.model('Activity', {problems: []});
        activity.update({_id: {$in: arr}}, {$set:{problems:[]}}, {multi:true}, function(err,docs){
            console.log(err);
            console.log(docs);
        });
        activity.find({_id: {$in: arr}}, function (err, docs) {
//            var b = _.chain(docs).pluck('problems').flatten().unique().compact().value();
            console.log(docs);
        });
    });
}