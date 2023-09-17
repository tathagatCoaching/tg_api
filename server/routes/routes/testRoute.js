const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../../middleware/auth');

const Test = require('../../models/Test');

module.exports = (app, db) => {
  const { Test } = db;
  app.get('/test', protect, (req, res) => {
    Test.findAll().then(function (e) {
      res.json(e);
    });
  });
};
