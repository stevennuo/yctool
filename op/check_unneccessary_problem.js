/**
 * Created by 3er on 12/8/14.
 */

var _ = require('underscore');

module.exports = function(qiniu, mongoose){
    var activity = mongoose.model('Activity', {problems: []});
    var problem = mongoose.model('Problem', {});
    activity.find({},function(err, docs){
//        console.log(docs);
        var arr = _.chain(docs).pluck('problems').flatten().unique().compact().value();
        problem.remove({_id:{$nin:arr}},function(err, docs){
            console.log(err)
            console.log(docs);
        })
    })
}
