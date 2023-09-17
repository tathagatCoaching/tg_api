const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/users');
const { users } = require('../config/db')
//console.log("users", users)
// Protect routes
let SECRET = process.env.JWT_SECRET
/*
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
    // Set token from cookie
  }
  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    return next();
  }
});
*/
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[ 1 ];
    console.log("🚀 ~ file: auth.js ~ line 53 ~ exports.protect=asyncHandler ~ token", token)
    // Set token from cookie
  }
  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    //console.log("decoded", decoded)
    let Id = decoded[ "user" ].email_Id
    console.log("decodeduses", Id)
    let r = await users.findOne({ where: { email_Id: Id } })
    //console.log("r", r);
    req.user = decoded[ "user" ];
    console.log("req.user", req.user)
    next();
  } catch (err) {
    console.log("Err", err);
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

/*
// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (5 == 6) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};

*/


// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // console.log("🚀 ~ file: auth.js ~ line 104 ~ return ~ req", req.user)
    if (!roles.includes(req.user.user_type)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.user_type} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};