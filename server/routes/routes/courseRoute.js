const express = require('express');
const db = require('../../config/db');
const router = express.Router();
const { check, validationResult } = require('express-validator');
// const {} = require('../controller/authController');
const course = require('../../models/course');
const video = require('../../models/video');
const orderlist = require('../../models/orderlist');
const Test = require('../../models/Test');

const { protect, authorize } = require('../../middleware/auth');

module.exports = async (app, db) => {
  const { course, video, orderlist, Test } = db;
  app.get('/course', async (req, res) => {
    console.log('Is called ?');
    let resp = await course.findAll();
    // console.log("🚀 ~ file: courseRoute.js ~ line 18 ~ app.get ~ res", resp)
    res.status(200).send(resp)
  });

  app.get('/course/:courseId', protect, (req, res) => {
    console.log(req.params.courseName);
    video
      .findAndCountAll({ where: { courseCourseId: req.params.courseId } })
      .then(function (exist) {
        if (!exist) {
          res.json('no such video for this course');
        }
        res.send(exist);
      })
      .catch(function (err) {
        console.log('coming from error');
        res.json(err);
      });
  });

  app.get('/coursevideo/:courseId', protect, function (req, res) {
    console.log(req.params.courseName);
    video
      .findAndCountAll({ where: { courseCourseId: req.params.courseId } })
      .then(function (exist) {
        if (!exist) {
          res.json('no such video for this course');
        }
        res.send(exist);
      })
      .catch(function (err) {
        console.log('coming from error');
        res.json(err);
      });
  });

  app.get('/coursevideolist/:courseId', protect, (req, res) => {
    course
      .findOne({ where: { courseId: req.params.courseId } })
      .then((exist) => {
        console.log(exist);
        if (!exist) {
          res.json({ message: 'no such topic pls create one ' });
        } else {
          video
            .findAndCountAll({ where: { courseCourseId: req.params.courseId } })
            .then((subject) => {
              if (!subject) {
                res.json({ fdff: 'fff' });
              }
              res.send(subject);
            });
        }
      });
  });

  app.get('/coursepackageorder/:courseId', (req, res) => {
    course.findOne({ where: { courseId: req.params.courseId } }).then((s) => {
      if (!s) {
        res.json('no such course exist');
      }
      if (s) {
        orderlist
          .findAll({ where: { courseId: req.params.courseId } })
          .then((sh) => {
            if (!sh) {
              res.json('no such order list for this course');
            }

            res.send(sh);
          });
      }
    });
  });
  app.get('/coursetestlist/:courseId', protect, (req, res) => {
    Test.findAndCountAll({
      where: { courseCourseId: req.params.courseId },
    }).then(function (s) {
      if (!s) {
        res.json({ message: 'no such course exist' });
      } else {
        res.json(s);
      }
    });
  });

  app.post('/courseUpload', protect, authorize('admin'), (req, res) => {
    // const course     = req.body.courseId;
    const courseName = req.body.courseName;
    const courseDesc = req.body.courseDesc;
    const thumbnail = req.body.thumbnail;
    console.log(req.body);
    course
      .create({
        // courseId: course,
        courseName: courseName,
        courseDesc: courseDesc,
        thumbnail: thumbnail,
      })
      .then((course) => {
        if (!course) {
          res.json({ fdff: 'fffd' });
        }
        res.json({ course });
      })
      .catch((err) => {
        res.json(err);
      });
  });

  app.get('/courseslist/:courseId', protect, (req, res) => {
    course
      .findAndCountAll({
        where: { courseId: req.params.courseId },
        include: [
          {
            model: subject,
            as: 'Subjects',
            include: [
              {
                model: topic,
                as: 'Topics',
                include: [
                  {
                    model: chapters,
                    as: 'chapters',
                  },
                ],
              },
            ],
          },
        ],
      })
      .then((course) => {
        res.send(course);
      });
  });

  app.post('/coursetestupload', protect, authorize('admin'), (req, res) => {
    course
      .findOne({ where: { courseId: req.body.courseId } })
      .then(function (s) {
        if (!s) {
          res.json({ message: 'No such course exist' });
        } else {
          let courseName = req.body.courseName;
          Test.create({
            courseCourseId: req.body.courseId,
            TestTitle: req.body.TestTittle,
            Testlink: req.body.url,
            exam_type: req.body.type,
          }).then(function (s) {
            if (!s) {
              res.json({ message: 'field problem' });
            } else {
              let sh = s.TestId;
              orderlist
                .create({
                  courseCourseId: req.body.courseId,
                  TestTestId: sh,
                })
                .then((s) => {
                  if (!s) {
                    res.json({ message: 'field problem' });
                  }
                  res.json({ mesage: 'Test created on Course' + courseName });
                });
            }
          });
        }
      });
  });

  app.post('/coursevideoupload', protect, authorize('admin'), function (
    req,
    res
  ) {
    // console.log(questiond)
    console.log(req.body);
    if (!req.body) {
      return res.send(400);
    }
    course.findOne({ where: { courseId: req.body.courseId } }).then((exist) => {
      console.log(exist);
      if (!exist) {
        res.json({ message: 'no such chapter pls create one ' });
      } else {
        video
          .create({
            courseCourseId: req.body.courseId,
            videoname: req.body.videoname,
            videoPath: req.body.videoPath,
            videodescription: req.body.videodescription
          })
          .then((subject) => {
            if (!subject) {
              res.json({ fdff: 'fff' });
            }
            let s = subject.videoId;
            console.log('s', s);
            orderlist
              .create({
                courseCourseId: req.body.courseId,
                videoVideoId: s,
              })
              .then((s) => {
                if (!s) {
                  res.json({ message: 'error in orderlist' });
                }
              });
            res.status(200).json({
              message: 'video updated for course' + req.body.courseId,
            });
          });
      }
    });
  });


  app.get('/getvideobycourse/:courseId', protect, function (req, res) {
    console.log('req.params', req.params);
    if (!req.body) {
      return res.send(400);
    }
    video.findAll({ where: { courseCourseId: req.params.courseId } }).then((exist) => {
      console.log(exist);
      if (exist) {
        res.status(200).json(exist);
      }
    });
  });

  app.put('/updatecourse/', protect, authorize('admin'), function (req, res) {
    course.findOne({ where: { courseId: req.body.Id } }).then((s) => {
      if (!s) {
        res.json('no such topic exist');
      }
      if (s) {
        course
          .update(
            { courseDesc: req.body.desc, courseName: req.body.name },
            { where: { courseId: req.body.Id } }
          )
          .then((s) => {
            res.status(200).json({
              message: 'Course has been updated',
            });
          });
      }
    });
  });

  app.delete('/deletecourse/:courseId', protect, authorize('admin'), function (
    req,
    res
  ) {
    course.findOne({ where: { courseId: req.params.courseId } }).then((s) => {
      if (!s) {
        res.json('no such course exist');
      }
      if (s) {
        course
          .destroy({ where: { courseId: req.params.courseId } })
          .then((s) => {
            res.status(200).json({
              message: 'Successfully deleted',
            });
          });
      }
    });
  });
};

// exports.courseById = (req, res) => {
//   console.log('-----------' + req.params.courseId);
//   course
//     .findAll({
//       where: { courseId: req.params.courseId },
//     })
//     .then(function (exist) {
//       console.log('-----------' + req.params.courseName);
//       if (!exist) {
//         res.json('no such course');
//       }
//       res.send(exist);
//     })
//     .catch(function (err) {
//       console.log('coming from error');
//       res.json(err);
//     });
// };
