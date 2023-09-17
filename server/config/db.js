//'use strict';
require('dotenv').config();
//  this file is for instance of
const Sequelize = require('sequelize');

// Option 1: Passing parameters separately
//const prodDb = 'cjhfzely_questionbank';
//const debugDb = 'cjhfzely_tathagatdev';
console.log('ENV detail',process.env.DB);
const Db = process.env.DB;
const sequelize = new Sequelize(
  Db,
  process.env.DB_USER,
  process.env.DB_PWD,
  {
    host: 'prepcha.com',
    dialect: 'mariadb',
    pool: {
      max: 5000,
      min: 0,
      acquire: 300000,
      idle: 10000,
    },
    define: {
      timestamps: false,
    },
  }
);
// new model are listed here so that they can be frmed in database
const subject = require('../models/subject.js')(sequelize, Sequelize);
const questions = require('../models/questions.js')(sequelize, Sequelize);
const video = require('../models/video.js')(sequelize, Sequelize);
const topic = require('../models/topic.js')(sequelize, Sequelize);
const image = require('../models/image.js')(sequelize, Sequelize);
const blog = require('../models/blog.js')(sequelize, Sequelize);

const chapters = require('../models/chapters.js')(sequelize, Sequelize);
// const questions = require('../models/questions.js')(sequelize, Sequelize);
const course = require('../models/course.js')(sequelize, Sequelize);
const courses = require('../models/courses.js')(sequelize, Sequelize);

const users = require('../models/users.js')(sequelize, Sequelize);
const admin = require('../models/admin.js')(sequelize, Sequelize);
const Test = require('../models/Test.js')(sequelize, Sequelize);
const notes = require('../models/notes.js')(sequelize, Sequelize);
const uploader = require('../models/uploader.js')(sequelize, Sequelize);
const accountant = require('../models/accountant.js')(sequelize, Sequelize);
const packages = require('../models/coursepackage.js')(sequelize, Sequelize);
const orderlist = require('../models/orderlist.js')(sequelize, Sequelize);
const user_course = require('../models/user_course.js')(sequelize, Sequelize);
const student = require('../models/student.js')(sequelize, Sequelize);
const testType = require('../models/test_type.js')(sequelize, Sequelize);
const userPackages = require('../models/user_packages.js')(sequelize, Sequelize);
const testAttempted = require('../models/test_attempted.js')(sequelize, Sequelize);
const userQuestionsBookmark = require('../models/user_questions_bookmark.js')(sequelize, Sequelize);


subject.belongsTo(course);
subject.hasMany(orderlist, { as: 'list' });
course.hasMany(subject, { as: 'Subjects' });
course.hasMany(orderlist, { as: 'list' });
//course.hasMany(packages, { as: 'Packages' });
course.hasMany(notes);
subject.hasMany(notes);
topic.hasMany(notes);
chapters.hasMany(notes);
subject.hasMany(chapters);
chapters.hasMany(topic);
topic.belongsTo(subject);
topic.hasMany(orderlist, { as: 'list' });
chapters.hasMany(orderlist, { as: 'list' });
subject.hasMany(topic, { as: 'Topics' });
questions.belongsTo(topic);
student.belongsTo(users, { as: 'User' });
topic.hasMany(video, { as: 'v' });
course.hasMany(video, { as: 'v' });
subject.hasMany(video, { as: 'v' });
chapters.hasMany(video, { as: 'v' });
course.hasMany(Test, { as: 'T' });
subject.hasMany(Test, { as: 'T' });
topic.hasMany(Test, { as: 'T' });
chapters.hasMany(Test, { as: 'T' });
video.hasMany(orderlist);
Test.hasMany(orderlist);
packages.hasMany(video);
packages.hasMany(orderlist, { as: 'list' });
course.hasMany(Test);
subject.hasMany(Test);
topic.hasMany(Test);
chapters.hasMany(Test);
packages.hasMany(Test);
//subject.hasMany(packages);
//chapters.hasMany(packages);
//topic.hasMany(packages);
topic.hasMany(questions);
chapters.hasMany(questions);
subject.hasMany(questions);
packages.hasMany(Test);
//packages.hasMany(user_course);
users.hasMany(user_course);
//userPackages.hasMany(packages);
//userPackages.hasMany(users);
//users.hasMany(userPackages);
//packages.hasMany(userPackages);



sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
//  if change anything in model then please uncomment the below line

// sequelize.sync({ alter: true });

// const db={};
// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// db.user = require('../models/user')(sequelize, Sequelize);

// // db.comments = require('./models/comments.js')
// // db.posts = require('./models/posts.js');
// db.student=require('./models/student');
// RelationMapping

// db.student.belongsTo(db.user,{as:"User"});
// db.user.hasMany(db.student);

// module.exports = db.sequelize;
module.exports = {
  notes,
  user_course,
  subject,
  course,
  topic,
  chapters,
  users,
  admin,
  uploader,
  video,
  questions,
  image,
  accountant,
  packages,
  orderlist,
  blog,
  Test,
  testType,
  sequelize,
  userPackages,
  testAttempted,
  courses,
  userQuestionsBookmark
};
