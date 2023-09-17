const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../../middleware/auth');


const questions = require('../../models/questions');
const chapters = require('../../models/chapters');
// const db = require('../config/db');


module.exports = (app, db) => {
  const { blog } = db;
  app.post('/publishblog', protect, authorize('admin'), (req, res) => {
    // console.log(questiond)
    console.log(req.body);
    if (!req.body) {
      return res.send(400);
    }
    blog.create({
      title: req.body.title,
      shortDesc: req.body.shortDesc,
      slug: req.body.slug,
      body: { q: req.body.body },
      thumbnail: req.body.thumbnail,
      publisher: req.body.publisher
    })
      .then((blog) => {
        if (!blog) {
          res.json({ fdff: 'fff' });
        }
        res.status(200).send(blog);
      });
  });

  app.get('/allblogs', (req, res) => {
    console.log(req.params.chapterName);
    blog.findAll()
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

  app.get('/blog/:blogId', protect, (req, res) => {
    console.log(req.params.topicId);
    blog
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


  app.get('/question/:id', (req, res) => {
    blog
      .findAll({ where: { questionId: req.params.id } }).then(function (exist) {
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
};
