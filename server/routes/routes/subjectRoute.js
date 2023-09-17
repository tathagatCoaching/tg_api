const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../../middleware/auth');

module.exports = (app, db) => {
  const { subject, video, course, Test } = db;
  app.get('/subject', (req, res) => {
    subject.findAll({ include: [ { model: course, as: 'course' } ] }).then(function (b) {
      res.json(b);
    });
  });

  app.get('/subjectvideo/:subjectId', protect, (req, res) => {
    console.log(req.params.subjectName);
    video
      .findAndCountAll({ where: { subjectId: req.params.subjectId } })
      .then(function (exist) {
        if (!exist) {
          res.json('no such video for this', req.params.subjectName);
        }
        res.send(exist);
      })
      .catch(function (err) {
        console.log('coming from error');
        res.json(err);
      });
  });

  app.get('/subjectpackageorder/:subjectId', (req, res) => {
    subject
      .findOne({ where: { subjectId: req.params.subjectId } })
      .then((s) => {
        if (!s) {
          res.json('no such subject exist');
        }
        if (s) {
          orderlist
            .findAll({ where: { subjectId: req.params.subjectId } })
            .then((sh) => {
              if (!sh) {
                res.json('no such order list for this subject');
              }
              res.send(sh);
            });
        }
      });
  });
  app.get('/subjectvideolist/:subjectId', protect, (req, res) => {
    subject
      .findOne({ where: { subjectId: req.params.subjectId } })
      .then((exist) => {
        console.log(exist);
        if (!exist) {
          res.json({ message: 'no such topic pls create one ' });
        } else {
          video
            .findAndCountAll({ where: { subjectId: req.params.subjectId } })
            .then((subject) => {
              if (!subject) {
                res.json({ fdff: 'fff' });
              }
              res.send(subject);
            });
        }
      });
  });

  app.post('/subjectvideoupload', protect, authorize('admin'), (req, res) => {
    // console.log(questiond)
    console.log('req.body', req.body);
    if (!req.body) {
      return res.send(400);
    }
    subject
      .findOne({ where: { subjectId: req.body.subjectId } })
      .then((exist) => {
        console.log(exist);
        if (!exist) {
          res.json({ message: 'no such subject pls create one ' });
        } else {
          video
            .create({
              subjectId: req.body.subjectId,
              videoPath: req.body.videoPath,
            })
            .then((subject) => {
              if (!subject) {
                res.json({ fdff: 'fff' });
              }
              let s = subject.videoId;
              console.log('s', s);
              orderlist
                .create({
                  subjectId: req.body.subjectId,
                  videoVideoId: s,
                })
                .then((s) => {
                  if (!s) {
                    res.json({ message: 'error in orderlist' });
                  }
                  res.status(200).json({ message: 'video updated for subje' });
                });

              res.status(200).json({ message: 'video updated for subje' });
            });
        }
      });
  });

  app.get('/subject/:courseId', protect, (req, res) => {
    console.log(req.params.courseId);
    subject
      .findAll({ where: { courseCourseId: req.params.courseId } })
      .then(function (exist) {
        if (!exist) {
          res.json('no such subject');
        }
        res.send(exist);
      })
      .catch(function (err) {
        console.log('coming from error');
        res.json(err);
      });
  });
  app.post('/subjectUpload', protect, authorize('admin'), (req, res) => {
    console.log("🚀 ~ file: subjectRoute.js ~ line 126 ~ app.post ~ req", req.body)
    course
      .findOne(
        { where: { courseId: req.body.courseId } },
        { attributes: ['courseId'] }
      )
      .then((exist) => {
        console.log(exist.courseId);
        if (!exist) {
          res.json({ message: 'no such course ' });
        } else {
          subject
            .findOne({
              where: {
                courseCourseId: exist.courseId,
                subjectName: req.body.subjectName,
              },
            })
            .then((name) => {
              if (!name) {
                subject
                  .create({
                    courseCourseId: exist.courseId,
                    subjectName: req.body.subjectName,
                    subjectDesc: req.body.subjectDesc,
                  })
                  .then((subject) => {
                    if (!subject) {
                      res.json({ fdff: 'fff' });
                    }
                    res.json(subject);
                  });
              } else {
                res.json(
                  'This subject is alredy present in ' + req.body.courseId
                );
              }
            });
        }
      })
      .catch((err) => {
        res.json(err);
      });
  });

  app.post('/subjecttestupload', protect, authorize('admin'), (req, res) => {
    subject
      .findOne({ where: { subjectId: req.body.subjectId } })
      .then(function (s) {
        if (!s) {
          res.json({ message: 'No such subject exist   ' });
        } else {
          let subjectName = req.body.subjectName;
          Test.create({
            subjectId: req.body.subjectId,
            TestTitle: req.body.TestTittle,
            Testlink: req.body.url,
            exam_type: req.body.type,
          }).then(function (s) {
            if (!s) {
              res.json({ message: 'field problem' });
            } else {
              let sh = s.Test_Id;
              orderlist
                .create({
                  subjectId: req.body.subjectId,
                  TestTestId: sh,
                })
                .then((s) => {
                  if (!s) {
                    res.json({ message: 'field problem' });
                  }
                  res.json({ mesage: 'Test created on Course' + courseId });
                });
            }
          });
        }
      });
  });

  app.get('/subjecttestlist/:subjectId', protect, (req, res) => {
    Test.findAndCountAll({ where: { subjectId: req.params.subjectId } }).then(
      function (s) {
        if (!s) {
          res.json({ message: 'no such subject exist' });
        } else {
          res.json(s);
        }
      }
    );
  });

  app.put('/updatesubject/', protect, authorize('admin'), function (req, res) {
    subject.findOne({ where: { Id: req.body.Id } }).then((s) => {
      if (!s) {
        res.json('no such topic exist');
      }
      if (s) {
        subject
          .update(
            { subjectDesc: req.body.desc, subjectName: req.body.name },
            { where: { Id: req.body.Id } }
          )
          .then((s) => {
            res.status(200).json({
              message: 'Subject has been updated',
            });
          });
      }
    });
  });

  app.delete(
    '/deletesubject/:subjectId',
    authorize('admin'),
    protect,
    function (req, res) {
      subject
        .findOne({ where: { subjectId: req.params.subjectId } })
        .then((s) => {
          if (!s) {
            res.json('no such subject exist');
          }
          if (s) {
            subject
              .destroy({ where: { subjectId: req.params.subjectId } })
              .then((s) => {
                res.status(200).json({
                  message: 'Successfully deleted',
                });
              });
          }
        });
    }
  );
};
