// WARNING!!!
db.mobiles.drop();
db.createCollection("mobiles");

var ccour = db.chapters.find({},{name:1,icon:1,seq:1,topics:1});
while ( ccour.hasNext() ) {
    var chapter = ccour.next();

    var videoCount = 0;

    // topics
    for(var i=0, ltop=chapter.topics.length; i<ltop; i++){
        var topic = db.topics.find({_id:chapter.topics[i]},{name:1, seq:1, tasks:1}).next();
        topic.tasks.sort(function(a,b) { return b.seq - a.seq } );

        // tasks
        var count = 0;
        var activities = [];
        for(var j=0, ltas=topic.tasks.length; j<ltas; j++){
            var task = db.tasks.find({_id:topic.tasks[j]},{activities:1}).next();

            // activities
            for(var k=0, lact=task.activities.length; k<lact; k++){
                var activity = db.activities.find({_id:task.activities[k]},{name:1,videos:1}).next();

                // video
                var video = db.videos.find({_id:activity.videos[0]},{video:1}).next();
                activity.url = video.video.url;
                activity.videoId = video._id;

                activity.seq = NumberInt(++count);
                delete activity.videos;
                activity.activityId = activity._id;
                activity._id = task._id;
                activities.push(activity);
            }

        }
        videoCount += count;
        topic.tasks = activities;
        chapter.topics[i] = topic;
    }

    chapter.count = NumberInt(videoCount);
    chapter.url = chapter.icon;
    delete chapter.icon;

    db.mobiles.save(chapter);
}