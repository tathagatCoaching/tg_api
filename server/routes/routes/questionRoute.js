const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../../middleware/auth');

const questions = require('../../models/questions');
const chapters = require('../../models/chapters');
// const db = require('../config/db');


module.exports = (app, db) => {
  const { questions, chapters, topic, subject } = db;
  app.post('/questionupload', protect, authorize('admin'), (req, res) => {
    console.log("🚀 ~ file: questionRoute.js ~ line 34 ~ p ~ req.body.explanation", req.body.explanation)
    // console.log(questiond)
    console.log(req.body);
    if (!req.body) {
      return res.send(400);
    }
    let desc = req.body.Desc
    // console.log("🚀 ~ file: questionRoute.js ~ line 19 ~ app.post ~ desc", desc)
    // return
    if (req.body.questionType == "paragraph") {
      let p = desc.map((e) => {
        console.log("🚀 ~ file: questionRoute.js ~ line 37 ~ p ~ e.question", e.question)
        // return
        questions.create({
          topicId: req.body.topicId,
          chapterChapterId: req.body.chapterId,
          subjectId: req.body.subjectId,
          paragraph: { q: e.paragraph },
          questionLevel: req.body.questionLevel,
          optionType: e.optionType,
          questionoption: e.option,
          explantation: { q: req.body.explanation },
          correctoption: e["correctOption"],
          question: { q: e.question },
          creator: req.body.creator,
          questionType: req.body.questionType,
        })
        console.log("🚀 ~ file: questionRoute.js ~ line 35 ~ p ~ e", e.paragraph)
      })
      Promise.resolve(p).then((sucess, err) => {
        res.status(200).send("question created")
      })
    } else {
      console.log("🚀 ~ file: questionRoute.js ~ line 35 ~ p ~ e", desc)

      questions
        .create({
          SubjectName: req.body.SubjectName,
          topicId: req.body.topicId,
          chapterChapterId: req.body.chapterId,
          subjectId: req.body.subjectId,
          questionDesc: req.body.questionDesc,
          paragraph: "",
          optionType: desc[ 0 ][ 'optionType' ],
          questionLevel: req.body.questionLevel,
          explantation: req.body.explanation,
          correctoption: desc[ 0 ][ "correctOption" ],
          questionType: req.body.questionType,
          questionoption: desc[ 0 ][ "option" ],

          questionmedia: req.body.questionmedia,
          question: { q: desc[ 0 ][ "question" ] },
          creator: req.body.creator
        })
        .then((subject) => {
          if (!subject) {
            res.json({ fdff: 'fff' });
          }
          res.status(200).send(subject);
        });
    }
  });

  app.get('/question/:chapterName', protect, (req, res) => {
    console.log(req.params.chapterName);
    questions
      .findAll({ where: { chapterName: req.params.chapterName } })
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

  app.get('/questions/:topicId', protect, (req, res) => {
    console.log(req.params.topicId);
    questions
      .findAll({ where: { topicId: req.params.topicId } })
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

  app.get('/question', (req, res) => {
    var whereClause = {};
    if(typeof req.query.subjectid != 'undefined'){
      whereClause.subjectid = req.query.subjectid;
    }

    if(typeof req.query.chapterid != 'undefined'){
      whereClause.chapterChapterId = req.query.chapterid;
    }

    if(typeof req.query.topicid != 'undefined'){
      whereClause.topicId = req.query.topicid;
    }

    questions
      .findAll({ include: [ { model: chapters, model: topic} ], where:whereClause, order:[['questionId', 'DESC']] })
      .then(function (exist) {
        console.log(exist.length)
        //console.log("🚀 ~ file: questionRoute.js ~ line 111 ~ exist", exist)
        if (!exist) {
          res.json('no such video for this course');
        }
        res.send(exist);
      })
      .catch(function (err) {
        console.log('coming from error');
        res.json(err);
      });
    //  db.question.findAll().then((result) => res.json(result))
  });

  app.get('/question-details/:id', (req, res) => {
    questions
      .findAll({ where: { questionId: req.params.id } }).then(function (exist) {
        console.log('questions details: ', exist);
        if (!exist) {
          res.json('no such video for this course');
        }
        let result = {};
        if(exist.length>0){
          result = exist[0];
        }
        res.send(result);
      })
      .catch(function (err) {
        console.log('coming from error');
        res.json(err);
      });
    //  db.question.findAll().then((result) => res.json(result))
  });
};
