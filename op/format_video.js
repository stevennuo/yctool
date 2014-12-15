/**
 * Created by 3er on 12/8/14.
 */

var _ = require('underscore');

module.exports = function (qiniu, mongoose) {
    var video = mongoose.model('Video', {_id: mongoose.Schema.Types.ObjectId, url: String, problems: [], problem_new: []});
    video.find({}, function (err, videos) {
        videos.forEach(function (v) {
            if (!v.problems)return;
            v.problems.forEach(function (p) {
                if (p.wrong_video) {
                    if (p.wrong_video.url) {
                        console.log(v._id + ' ' + p._id);
                        var s = {
                            _id: mongoose.Types.ObjectId(p.wrong_video._id),
                            url: p.wrong_video.url
                        };
                        video.create(s, function (err, num) {
//                            console.log(err + num)
                        });
                    }
                    p.choices.forEach(function (choice) {
                        if (choice.is_correct == false) {
                            if (p.wrong_video.url) {
                                choice.video = s;
                            }
                            if (p.wrong_video.jump) {
                                console.log(v._id + ' ' + p._id);
                                choice.jump = p.wrong_video.jump
                            }
                        }
                    })
                }

                if (p.correct_video) {
                    if (p.correct_video.url) {
                        console.log(v._id + ' ' + p._id);
                        var s = {
                            _id: mongoose.Types.ObjectId(p.correct_video._id),
                            url: p.correct_video.url
                        };
                        video.create(s, function (err, num) {
//                            console.log(err + num)
                        });
                    }
                    p.choices.forEach(function (choice) {
                        if (choice.is_correct == true) {
                            if (p.correct_video.url) {
                                choice.video = s;
                            }
                            if (p.correct_video.jump) {
                                console.log(v._id + ' ' + p._id);
                                choice.jump = p.correct_video.jump
                            }
                        }
                    })
                }
            });
            video.update({_id: v._id}, {$set: {problem_new: v.problems}}, {multi: true}, function (err, num) {
//                console.log(err + num);
            });
        })
    })
}
