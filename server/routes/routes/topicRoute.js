const express = require('express');
const { protect, authorize } = require('../../middleware/auth');
const cors = require("cors");

module.exports = (app, db) => {
  const { topic, video, subject, orderlist, Test, chapters } = db;
  app.get('/topic', (req, res) => {
    console.log('From topic route');
    topic.findAll().then(function (e) {
      res.json(e);
    });
  });

  app.get('/topicvideo/:topicId', protect, (req, res) => {
    console.log(req.params.topicName);
    video
      .findAll({ where: { topicId: req.params.topicId } })
      .then(function (exist) {
        if (!exist) {
          res.json('no such video for this', req.params.topicName);
        }
        res.send(exist);
      })
      .catch(function (err) {
        console.log('coming from error');
        res.json(err);
      });
  });

  app.get('/topicvideolist/:topicId', protect, (req, res) => {
    topic.findOne({ where: { topicId: req.params.topicId } }).then((exist) => {
      console.log(exist);
      if (!exist) {
        res.json({ message: 'no such topic pls create one ' });
      } else {
        video
          .findAndCountAll({ where: { topicId: req.params.topicId } })
          .then((subject) => {
            if (!subject) {
              res.json({ fdff: 'fff' });
            }
            res.send(subject);
          });
      }
    });
  });

  app.post('/topicupload', protect, authorize('admin'), (req, res) => {
    console.log("🚀 ~ file: topicRoute.js ~ line 48 ~ app.post ~ req", req.body)
    chapters
      .findOne({
        where: { chapterId: req.body.chapterId },
        // attributes: ['Id']
      })
      .then((exist) => {
        console.log('exist');
        if (!exist) {
          res.json({ message: 'no such subject ' });
        } else {
          topic
            .findOne({
              where: { topicName: req.body.topicName, chapterChapterId: req.body.chapterId },
            })
            .then((one) => {
              if (!one) {
                topic
                  .create({
                    topicName: req.body.topicName,
                    chapterChapterId: req.body.chapterId,
                    topicDesc: req.body.topicDesc,
                  })
                  .then((subject) => {
                    if (!subject) {
                      res.json({ fdff: 'fff' });
                    }
                    res.json(subject);
                  });
              } else {
                res.json('This topic alredy exsit in  ' + req.body.topicId);
              }
            });
        }
      });
  });

  app.get('/topic/:chapterId', protect, (req, res) => {
    console.log(req.params.subjectName);
    topic
      .findAll({ where: { chapterChapterId: req.params.chapterId } })
      .then(function (exist) {
        if (!exist) {
          res.json('no such topic');
        }
        res.send(exist);
      })
      .catch(function (err) {
        console.log('coming from error');
        res.json(err);
      });
  });

  app.get('/topicpackageorder/:topicId', (req, res) => {
    topic.findOne({ where: { topicId: req.params.topicId } }).then((s) => {
      if (!s) {
        res.json('no such course exist');
      }
      if (s) {
        orderlist
          .findAll({ where: { topicId: req.params.topicId } })
          .then((sh) => {
            if (!sh) {
              res.json('no such order list for this course');
            }

            res.send(sh);
          });
      }
    });
  });
  app.post('/topicvideoupload', protect, authorize('admin'), (req, res) => {
    console.log(req.body);
    if (!req.body) {
      return res.send(400);
    }
    topic.findOne({ where: { topicId: req.body.topicId } }).then((exist) => {
      console.log(exist);
      if (!exist) {
        res.json({ message: 'no such topic pls create one ' });
      } else {
        video
          .create({
            topicId: req.body.topicId,
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
                topicId: req.body.topicId,
                videoVideoId: s,
              })
              .then((s) => {
                if (!s) {
                  res.json({ message: 'error in orderlist' });
                }
                res.json({ su: 'done' });
              });
          });
      }
    });
  });

  app.post('/topictestupload', protect, authorize('admin'), (req, res) => {
    const topicName = req.body.topicName;
    topic.findOne({ where: { topicId: req.body.topicId } }).then(function (s) {
      if (!s) {
        res.json({ message: 'No such topic exist in  ' + topicName });
      } else {
        Test.create({
          topicId: req.body.topicId,
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
                topicId: req.body.topicId,
                TestTestId: sh,
              })
              .then((s) => {
                if (!s) {
                  res.json('error while orderlist update');
                }
                res.json('Test created');
              });
          }
        });
      }
    });
  });

  app.get('/topictestlist/:topicId', protect, (req, res) => {
    Test.findAndCountAll({ where: { topicId: req.params.topicId } }).then(
      function (s) {
        if (!s) {
          res.json({ message: 'no such topic exist' });
        } else {
          res.json(s);
        }
      }
    );
  });

  app.put('/updatetopic/', protect, authorize('admin'), function (req, res) {
    topic.findOne({ where: { Id: req.params.Id } }).then((s) => {
      if (!s) {
        res.json('no such topic exist');
      }
      if (s) {
        topic
          .update(
            { topicDesc: req.body.desc, topicName: req.body.name },
            { where: { Id: req.params.Id } }
          )
          .then((s) => {
            res.status(200).json({
              message: 'Topic has been updated',
            });
          });
      }
    });
  });

  app.delete('/deletetopic/:topicId', protect, authorize('admin'), function (
    req,
    res
  ) {
    topic.findOne({ where: { topicId: req.params.topicId } }).then((s) => {
      if (!s) {
        res.json('no such topic exist');
      }
      if (s) {
        topic.destroy({ where: { topicId: req.params.topicId } }).then((s) => {
          res.status(200).json({
            message: 'Successfully deleted',
          });
        });
      }
    });
  });
};
