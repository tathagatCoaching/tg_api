const notes = require('../../models/notes');
const express = require('express');

const { protect, authorize } = require('../../middleware/auth');

module.exports = (app, db) => {
  const { notes } = db;
  app.post('/notesupload', protect, authorize('admin'), (req, res) => {
    var courseId = req.body.courseId;
    var subjectId = req.body.subjectId;
    var topicId = req.body.topicId;
    var chapterId = req.body.chapterId;

    if (!courseId) {
      courseId = 'NA';
    }
    if (!subjectId) {
      subjectId = 'NA';
    }
    if (!topicId) {
      topicId = 'NA';
    }
    if (!chapterId) {
      chapterId = 'NA';
    }

    // console.log(questiond)
    console.log(req.body);
    if (!req.body) {
      return res.send(400);
    }
    notes
      .create({
        courseCourseId: courseId,
        topicid: topicId,
        chapterChapterId: chapterId,
        subjectId: subjectId,
        notesPath: req.body.notesPath,
      })
      .then((subject) => {
        if (!subject) {
          res.json({ fdff: 'fff' });
        }
        res.status(200).json({ message: 'question updated' });
      });
  });

  app.get('/notes/:courseId', protect, (req, res) => {
    notes
      .findAll({ where: { courseCourseId: req.params.courseId } })
      .then((s) => {
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

  app.get('/notes/:subjectId', protect, (req, res) => {
    notes
      .findAll({ where: { subjectId: req.params.subjectId } })
      .then((s) => {
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

  app.get('/notes/:topicId', protect, (req, res) => {
    notes
      .findAll({ where: { topicId: req.params.topicId } })
      .then((s) => {
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

  app.get('/notes/:chapterId', protect, (req, res) => {
    notes
      .findAll({ where: { chapterChapterId: req.params.chapterChapterId } })
      .then((s) => {
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
};
