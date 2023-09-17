const express = require('express');
// const User = require('../models/userModels');
const ErrorResponse = require('../../utils/errorResponse');
const asyncHandler = require('../../middleware/async');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authorize } = require('../../middleware/auth');
const { sequelize } = require('../../config/db');
const { Op } = require("sequelize");
// routes

module.exports = (app, db) => {
  const { users } = db;
  // register/signup
  app.post(
    '/register',
    asyncHandler(async (req, res, next) => {
      const {
        firstName, lastName, email_Id,
        mobileNumber, password, role,
      } = req.body;
      console.log("req.body", req.body)

      // hashing password
      const hashedPassword = await bcrypt.hash(password, 8);
      console.log('This is the password', hashedPassword);

      //create user
      const user = await users.create({
        username: firstName + lastName,
        lastName: lastName,
        email_Id: email_Id,
        mobileNumber: mobileNumber,
        password: hashedPassword,
        user_type: role,
      });

      //create token
      sendTokenResponse(user, 200, res);

      next();
    })
  );

  // login/signin

  app.post('/login', async (req, res, next) => {
    const { email_Id, password } = req.body;

    //validation email and password
    if (!email_Id || !password) {
      return next(new ErrorResponse('Please enter email id and password', 400));
    }
    //check for user

    users.findOne({ where: { email_Id: email_Id } })
      .then(async (user) => {
        console.log("🚀 ~ file: authRoute.js ~ line 47 ~  email_Id, password }", user)
      if (!user) {
        return next(new ErrorResponse('Invalid credential', 401));
      }
      const isMatch = async () => {
        //check if password matchs
        // let hashedPassword = await bcrypt.hashSync(password, 8);
        const _isMatch = bcrypt.compareSync(password, user.password);
        console.log("🚀 ~ file: authRoute.js ~ line 622 ~ isMatch ~ hashedPassword", _isMatch, user.password,)
        return _isMatch;
      };

      isMatch().then((resp) => {
        // console.log("🚀 ~ file: authRoute.js ~ line 62 ~ isMatch ~ hashedPassword, user.password", resp)
        if (resp) {
          sendTokenResponse(user, 200, res);
        }
        else {
          return res.status(401).json({ 'msg': "wrong crentials" });
        }
      })

      //create token
    });
  });

  // to see the logged user
  app.get(
    '/getLoggedInUser',
    asyncHandler(async (req, res, next) => {
      // user is already available in req due to the protect middleware
      const user = req.user;

      res.status(200).json({
        success: true,
        data: user,
      });
    })
  );

  //get token from model, create a cookie, send res
  const sendTokenResponse = (user, statusCode, res) => {
    const token = jwt.sign({ user }, process.env.JWT_SECRET);
    console.log(token);
    // persist the token as 't' in cookie with expiry date
    res.cookie('t', token, { expire: new Date() + 9999 });

    // if (process.env.NODE_ENV === 'production') {
    //   options.secure = true;
    // }

    res
      .status(statusCode)
      .cookie('token', token, { expire: new Date() + 9999 })
      .json({
        message: 'Succesful',
        token,
        user
      });
  };

  // get a single user
  app.get('/user', function (req, res) {
    users
      .findAll({ where: { email_Id: req.params.email_Id } })
      .then((s) => {
        if (!exist) {
          res.json('no such user exists');
        }
        res.status(200).json({
          username,
          email_Id,
          imageId,
        });
      })
      .catch(function (err) {
        console.log('coming from error');
        res.json(err);
      });
  });

  // get a single user
  app.get('/user_info/:email_Id', function (req, res) {
    users.findOne({ where: { email_Id: req.params.email_Id } })
        .then(async (user) => {
          console.log("User", user)
          if (!user) {
            return res.status(401).json({ 'msg': "wrong crentials" });
          }else {
            return res.status(200).json(user);

          }
          //create token
        });
  });

  app.get('/alluser', function (req, res) {
    var whereClouse = {}
    if(typeof req.query !="undefined"){
      if(typeof req.query.userType !="undefined"){
        if(req.query.userType !='')
          whereClouse.user_type = req.query.userType
      }
    }
    var orderBy = [['username','ASC']];
    users
      .findAll({where:whereClouse, order:orderBy})
      .then((s) => {
        res.status(200).json(s);
      })
      .catch(function (err) {
        console.log('coming from error');
        res.json(err);
      });
  });

  app.get('/find-user/:type/:userName', function (req, res) {
    console.log("params === ", req.params);
    var userNameStr = '';
    if(typeof req.params.userName != "undefined"){
      userNameStr = req.params.userName;
    }
    var usertype = req.params.type;
    var result = [];
    var query = "";
    if(userNameStr !='' && usertype !='')
    {
      var serachStr = '%'+userNameStr+'%';
      users
      .findAll({ where: {user_type:usertype, [Op.or]: [{username: { [Op.like]: `${serachStr}` }}, {email_id: { [Op.like]: `${serachStr}`}}, {mobileNumber: { [Op.like]: `${serachStr}`}}  ]} })
      .then((s) => {
        if (s.length>0) {
          delete s['password'];
          console.log("result ==", s);
          res.status(200).json(s);
        }else{
          console.log("'no such user exists'");
          res.json(s);
        }
      })
      .catch(function (err) {
        console.log('coming from error');
        console.log(err);
        res.json(err);
      });
    }else{
      res.status(200).json(result);
    }
  });

  app.get('/password-update', function (req, res) {
    var whereClouse = {}
    var result = [];
    whereClouse.user_type = 'student';
    whereClouse.signup_type = 0;
    var orderBy = [['email_id','ASC']];
    users.findAll({where:whereClouse, order:orderBy}).then( async(s) => {
      if(s.length>0){
        for (let usr of s){
          const hashedPassword = await bcrypt.hash(usr.password_new, 8);
          //console.log('This is the password', hashedPassword);
          //console.log('User :', usr.email_Id , 'password updated: ', hashedPassword, ' Status: 1');
          users.update({new_password: hashedPassword, signup_type:1}, { where: { email_Id: usr.email_Id } })
          .then((userUp) => { result.push({user: usr.email_Id , password:usr.password, new_password:hashedPassword, status: userUp});
              console.log('User :', usr.email_Id , 'password updated: ', hashedPassword, ' Status: ',userUp);
          });
        }
      }
      res.status(200).json(result);
    }).catch(function (err) {
        console.log('coming from error');
        res.json(err);
    });
  
  });

};
