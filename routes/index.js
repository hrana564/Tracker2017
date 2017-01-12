var express = require('express');
var router = express.Router();
var Activities = require('../models/activities');
var DailyActivities = require('../models/dailyActivities');
var mongoose = require('mongoose');

console.log(router);
router.get('/', function (req, res) {
    //var newActivity = new Activities({
    //    ActivityName: 'Exercise',
    //    ActivitySelectorName : "Exercise"
    //});
    //var newActivity2 = new Activities({
    //    ActivityName: 'Good Food Habbit',
    //    ActivitySelectorName : 'GoodFoodHabbit'
    //});
    //newActivity.save(function (err, c1Inserted) {
    //    if (err) {
    //        console.log("error occoured while saving activity : " + newActivity.ActivityName);
    //    } else {
    //        console.log("activity : " + newActivity.ActivityName + " saved successfully!!!");
    //    }
    //});
    //newActivity2.save(function (err, c1Inserted) {
    //    if (err) {
    //        console.log("error occoured while saving activity : " + newActivity2.ActivityName);
    //    } else {
    //        console.log("activity : " + newActivity2.ActivityName + " saved successfully!!!");
    //    }
    //});

    var StatusUnknownActivities = [];
    var ActivitiesStatus = [];
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!

    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    today = dd + '-' + mm + '-' + yyyy;
    Activities.find({ActivityActive: true}, function (err, data) {
        if (err) {
            console.log('error occoured while fetching activities');
            res.render('index', {PendingActivities: [], MessageCode: -1});
        } else {
            for (var i = 0, len = data.length; i < len; i++) {
                var jsonObject = data[i].toObject();
                jsonObject["IsDone"] = false;
                StatusUnknownActivities.push(jsonObject);
            }
        }
    }).then(function () {
        DailyActivities.find({DoneOn: today}, function (err, data1) {
            if (err) {
                console.log('error occoured while fetching daily activities');
                res.render('index', {PendingActivities: [], MessageCode: -1});
            } else {
                for (var k = 0; k < data1.length; k++) {
                    for (var j = 0; j < StatusUnknownActivities.length; j++) {
                        if (StatusUnknownActivities[j]._id.toString() == data1[k].ActivityId.toString()) {
                            StatusUnknownActivities[j].IsDone = data1[k].DoneStatus;
                        }
                    }
                }
            }
        }).then(function () {
            res.render('index', {PendingActivities: StatusUnknownActivities, MessageCode: 0})
        });
    });
});

router.post('/', function (req, res) {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!

    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    today = dd + '-' + mm + '-' + yyyy;
    Activities.find({ActivityActive:true}, function (err, data) {
        if (err) {
            res.render('index', { PendingActivities: [] , MessageCode :-1 });
        } else {
            for (var i = 0, len = data.length; i < len; i++) {
                var dailyActivity = new DailyActivities();
                dailyActivity.ActivityId = data[i].id;
                dailyActivity.DoneOn = today;
                dailyActivity.DoneStatus = req.body[data[i].ActivitySelectorName]=='yes';
                dailyActivity.UpdatedOn = Date.now();
                (function (index,data,dailyActivity) {
                    DailyActivities.findOne({ActivityId:data.id,DoneOn:today}, function (err, data1) {
                        if (err) {
                            res.render('index', { PendingActivities: [] , MessageCode :-1 });
                        } else {
                            if(data1){
                                data1.DoneStatus = dailyActivity.DoneStatus;
                                data1.UpdatedOn = Date.now();
                                data1.save();
                            } else dailyActivity.save();
                        }
                    });
                })(i,data[i],dailyActivity);
            }
        }
    }).then(function(){res.render('index', { MessageCode :1 })});
});

module.exports = router;