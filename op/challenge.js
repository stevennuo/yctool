/**
 * Created by 3er on 1/11/15.
 */

var _ = require('underscore');

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var SUBTASK = ['A', 'B', 'C'];

function randomIntInc(low, high) {
    // [low, high]
    return Math.floor(Math.random() * (high - low + 1) + low);
}

function insideActivity(topic, task, activities, pool, taskm, am, pm, tagm) {
    _.each(activities, function (activity, index) {
        var tagCount = randomIntInc(1, 5);
        for (var i = 0; i < tagCount; i++) {
            var tagNew = {
                _id: ObjectId(),
                name: SUBTASK[index] + i.toString() + '(真实名字课程组还没确定)',
                topics: [topic._id],
                levels: [
                    {_id: ObjectId(), weight: index, alias: 'chlg-act-seq'},
                    {_id: ObjectId(), weight: i, alias: 'chlg-tag-seq'}
                ]
            };
            // insert tag to tags coll
            tagm.create(tagNew, function (err) {
                if (err) console.log('1' + err);
            });

            // insert tagid to problem.tags & task.tags
            var probCount = randomIntInc(3, 6);
            var pSet = _.chain(pool).sample(probCount).pluck('_id').value();
            pm.update({_id: {$in: pSet}}, {$push: {tags: tagNew._id}}, {multi:true}, function (err) {
                if (err) console.log(err);
            });
            task.tags.push(tagNew._id);

            // insert pid to act
            activity.problems = pSet;
        }
    });
}

module.exports = function (qiniu, mongoose) {

    var cm = mongoose.model('chapter', {desc: String, topics: []});
    var topm = mongoose.model('topic', {name: String, desc: String, tasks: []});
    var taskm = mongoose.model('task', {name: String, desc: String, type: String,
        activities: [], tags: [], bloods: Number});
    var am = mongoose.model('activity', {name: String, desc: String, problems: []});
    var pm = mongoose.model('problem', {choices: [], correct_anwser: [], tags: []});
    var tagm = mongoose.model('tag', {name: String, levels: [], topics: []});

    var problems = [];
    pm.find(
        {},
        {},
        {limit: 4000}
        , function (err, docs) {
            problems = docs;
        });


    // 用一元一次方程
    cm.find({_id: "5426b762fb55fb7b13587419"}, function (err, chapters) {
        topm.find({_id: {$in: chapters[0].topics}}, function (err, topics) {
            _.each(topics, function (topic, index, list) {
                var task = {
                    _id: ObjectId(),
                    type: 'challenge',
                    activities: [],
                    tags: [],
                    bloods: 3
                }


                var insertA = function (task, name) {
                    var act = {
                        _id: ObjectId(),
                        name: name,
                        problems: []
                    }
                    task.activities.push(act._id);
                    return act;
                }
                var acts = [];
                acts.push(insertA(task, '金杯题'));
                acts.push(insertA(task, '银杯题'));
                acts.push(insertA(task, '铜杯题'));

                insideActivity(topic, task, acts, problems, taskm, am, pm, tagm);

                am.create(acts, function (err) {
                    if (err) console.log(err);
                });

                taskm.create(task, function (err) {
                    if (err) console.log(err);
                    topm.update({_id: topic._id}, {$push: {tasks: task._id}}, function (err) {
                        if (err) console.log(err);
                    })
                });

            });
        });

    });
};
