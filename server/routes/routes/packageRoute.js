const express = require('express');
const asyncHandler = require('../../middleware/async');
const router = express.Router();
('express-validator');
const { protect, authorize } = require('../../middleware/auth');
const user_course = require('../../models/user_course');
const { Op } = require("sequelize");
const {getCourses} = require("../../helper/helper");

module.exports = (app, db) => {

  const { chapters, course, topic, packages, subject, orderlist, video, user_course,
    sequelize,userPackages, Test ,courses } = db;

    app.post('/createpackage', (req, res) => {

      console.log("🚀 ~ file: packageRoute.js ~ line 9 ~ app.post ~ req", req.body)
      var courseId = (typeof req.body.courseId != "unfefined")?req.body.courseId:"";
      var subjectId = (typeof req.body.subjectId != "unfefined")?req.body.subjectId:""; 
      var topicId = (typeof req.body.topicId != "unfefined")?req.body.topicId:""; 
      var chapterId = (typeof req.body.chapterId != "unfefined")?req.body.chapterId:""; 
      //console.log("aaaaaaa",req.body.PackagePrice);  
      let packageData = {
      subjectId: subjectId,
      chapterChapterId: chapterId,
      topicId: topicId,
      courseCourseId: req.body.courseId,
      thumbnail: req.body.thumbnail,
      PackageName: req.body.PackageName,
      PackageDesc: req.body.PackageDesc,
      PackagePrice: parseFloat(req.body.PackagePrice),
      TestList: req.body.TestList,
      officialDesc: req.body.officialDesc
    }
      if (courseId || subjectId || topicId || chapterId) {
        if(req.body.packageId){
          let {TestList, restObj} = packageData;
          packages.update({TestList},{where: {packageId: req.body.packageId}})
          .then((package) => {
            if (!package) { res.json({ message: 'Error in response' }); } else {
              packages.findOne({where:{packageId: req.body.packageId}}).then((rs)=>{
                res.status(200).json(rs);
              });
            }
          });
        } else {
          packages.create(packageData).then((package) => {
            if (!package) {
              res.json({ message: 'Error in response' });
            } else {
              res.status(200).json(package);
            }
          });
        } 
      }else{
        console.log("courseId || subjectId || topicId || chapterId not found in Package Creation ");
      }
    });

  app.post('/createpackage_old', (req, res) => {

    console.log("🚀 ~ file: packageRoute.js ~ line 9 ~ app.post ~ req", req.body)
    var courseId = (typeof req.body.courseId != "unfefined")?req.body.courseId:"";
    var subjectId = (typeof req.body.subjectId != "unfefined")?req.body.subjectId:""; 
    var topicId = (typeof req.body.topicId != "unfefined")?req.body.topicId:""; 
    var chapterId = (typeof req.body.chapterId != "unfefined")?req.body.chapterId:""; 

    console.log("aaaaaaa",req.body.PackagePrice);

    if (courseId || subjectId || topicId || chapterId) {
      course.findAll({ where: { courseId: req.body.courseId } }).then((exist) => {
        if (!exist) {

          } else {
            if(typeof req.body.packageId !="undefined"){
              if(req.body.packageId !='' ){
                packages
                .update({TestList: req.body.TestList, PackagePrice: req.body.PackagePrice},{where: {packageId: req.body.packageId}}
                )
              .then((package) => {
                if (!package) {
                  res.json({ message: 'Error in response' });
                } else {
                  res.json(package);
                }
              });
              } else {
                packages
                .create({
                  subjectId: subjectId,
                  chapterChapterId: chapterId,
                  topicId: topicId,
                  courseCourseId: req.body.courseId,
                  thumbnail: req.body.thumbnail,
                  PackageName: req.body.PackageName,
                  PackageDesc: req.body.PackageDesc,
                  PackagePrice: req.body.PackagePrice,
                  TestList: req.body.TestList,
                  officialDesc: req.body.officialDesc
                })
                .then((package) => {
                if (!package) {
                  res.json({ message: 'Error in response' });
                } else {
                  res.json(package);
                }
              });
            }
            
          }
        }
        }).catch( (err)=>{
         console.log("Package Creation ", err);
        });
          
    }else{
      console.log("courseId || subjectId || topicId || chapterId not found in Package Creation ");
    }
  });

  app.get('/getallpackages', (req, res) => {
    const { packages, user_course } = db;
    packages.findAll({}).then(async (e) => {
      if (!e) {
        res.json('no package found');
      } else {
        //console.log("E", e)
        let arr = []
        let count = 0

        for (var i of e) {

          req.db = db
          req.params.courseCourseId = i.courseCourseId;
          var courseName = await getCourses(req);

          let m = {}
          m.packageId = i.packageId
          m.users = i.users;
          m.name = i.PackageName;
          //m.users = i.user_course;
          m.price = i.PackagePrice;
          m.payment_url = i.payment_url;
          m.packageDetails = i.PackageDesc;
          m.courseName = courseName.courseName?courseName.courseName:""
          m.thumbnail = i.thumbnail;
          m.questionCount = i.TestList && i.TestList.map(j => j.Section && j.Section.map(k => count += k.QuestionList.length))
          m.questionCount = count;
          m.courseId = i.courseCourseId;
          m.subjectId = i.subjectId;
          m.chapterId = i.chapterChapterId;
          m.topicId = i.topicId;
          m.officialDesc = i.officialDesc;
          m.StopFlag = i.StopFlag;
          m.testList = i.TestList;
          arr.push(m);
          count = 0;
          m = {};
        }

        console.log("m here to test..");
        res.status(200).json(arr);
      }
    });
  });

  app.get('/getrndmpkg', (req, res) => {
    const {packages} = db;
    packages.findAll({where: {show_to_all: 1}}).then(async (e) => {
      if (!e) {
        res.json('no package found');
      } else {
        let arr = []
        let count = 0


        for (var i of e) {
          let m = {}
          req.db = db
          req.params.courseCourseId = i.courseCourseId;
          var courseName = await getCourses(req);
          console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", i)
          m.packageId = i.packageId
          m.name = i.PackageName;
          m.price = i.PackagePrice;
          m.thumbnail = i.thumbnail;
          m.courseName = courseName.courseName
          // m.questionCount = i.TestList && i.TestList.map(j => j.Section && j.Section.map(k => count += k.QuestionList.length))
          m.questionCount = count
          //m.TestList = i.TestList
          m.payment_url = i.payment_url
          m.officialDesc = i.officialDesc
          arr.push(m)
          count = 0
          m = {}
        }
        res.status(200).json(arr);
      }
    });
  });

  app.get('/getallpackagebyid_old/:packageId', (req, res) => {
    const { packages } = db;
    packages.findOne({ where: { packageId: req.params.packageId } }, {
      include: [{
        model: user_course
      }]
    }).then((e) => {
      if (!e) {
        res.json('no package found');
      } else {
        let arr = []
        let count = 0
        console.log("🚀 ~ file: packageRoute.js ~ line 157 ~ packages.findOne ~ e", e)
        let m = {}
        m.packageId = e.packageId
        m.users = e.user_course
        m.name = e.PackageName
        m.price = e.Packageprice
        m.PackageDesc = e.PackageDesc
        m.CourseId = e.courseCourseId
        m.thumbnail = e.thumbnail
        m.questionCount = e.TestList && e.TestList.map(j => j.Section && j.Section.map(k => count += k.QuestionList.length))
        m.TestList = e.TestList

        arr.push(m)
        count = 0
        m = {}
        res.status(200).json(arr);
      }
    });
  });

  app.put('/packageorder', protect, (req, res) => {
    var courseId = req.body.courseId;
    var subjectId = req.body.subjectId;
    var topicId = req.body.topicId;
    var chapterId = req.body.chapterId;
    var videoId = req.body.videoId;
    var packageId = req.body.packageId;
    var TestId = req.body.TestId;

    // course
    if (courseId && videoId) {
      orderlist
        .update(
          { orderNumber: req.body.orderNumber },
          { where: { courseCourseId: courseId, videoVideoId: videoId } }
        )
        .then(function (s) {
          if (!s) {
            res.json({ mesage: 'problem while updating orderlist' });
          } else {
            res.json({ message: ' orderlist updated ' });
          }
        });
    }

    if (courseId && TestId) {
      orderlist
        .update(
          { orderNumber: req.body.orderNumber },
          { where: { courseCourseId: courseId, TestTestId: TestId } }
        )
        .then(function (s) {
          if (!s) {
            res.json({ mesage: 'problem while updating orderlist' });
          } else {
            res.json({ message: ' orderlist updated ' });
          }
        });
    }
    // subject
    if (subjectId && videoId) {
      orderlist
        .update(
          { orderNumber: req.body.orderNumber },
          { where: { subjectId: subjectId, videoVideoId: videoId } }
        )
        .then(function (s) {
          if (!s) {
            res.json({ mesage: 'problem while updating orderlist' });
          } else {
            res.json({ message: ' orderlist updated ' });
          }
        });
    }

    if (subjectId && TestId) {
      orderlist
        .update(
          { orderNumber: req.body.orderNumber },
          { where: { subjectId: subjectId, TestTestId: TestId } }
        )
        .then(function (s) {
          if (!s) {
            res.json({ mesage: 'problem while updating orderlist' });
          } else {
            res.json({ message: ' orderlist updated ' });
          }
        });
    }
    // topic
    if (topicId && videoId) {
      orderlist
        .update(
          { orderNumber: req.body.orderNumber },
          { where: { topicId: topicId, videoVideoId: videoId } }
        )
        .then(function (s) {
          if (!s) {
            res.json({ mesage: 'problem while updating orderlist' });
          } else {
            res.json({ message: ' orderlist updated ' });
          }
        });
    }

    if (topicId && TestId) {
      orderlist
        .update(
          { orderNumber: req.body.orderNumber },
          { where: { topicId: topicId, TestTestId: TestId } }
        )
        .then(function (s) {
          if (!s) {
            res.json({ mesage: 'problem while updating orderlist' });
          } else {
            res.json({ message: ' orderlist updated ' });
          }
        });
    }
    // chapter
    if (chapterId && videoId) {
      orderlist
        .update(
          { orderNumber: req.body.orderNumber },
          { where: { chapterChapterId: chapterId, videoVideoId: videoId } }
        )
        .then(function (s) {
          if (!s) {
            res.json({ mesage: 'problem while updating orderlist' });
          } else {
            res.json({ message: ' orderlist updated ' });
          }
        });
    }

    if (chapterId && TestId) {
      orderlist
        .update(
          { orderNumber: req.body.orderNumber },
          { where: { chapterChapterId: chapterId, TestTestId: TestId } }
        )
        .then(function (s) {
          if (!s) {
            res.json({ mesage: 'problem while updating orderlist' });
          } else {
            res.json({ message: ' orderlist updated ' });
          }
        });
    }
    // package
    if (packageId && videoId) {
      orderlist
        .update(
          { orderNumber: req.body.orderNumber },
          { where: { packagePackageId: packageId, videoVideoId: videoId } }
        )
        .then(function (s) {
          if (!s) {
            res.json({ mesage: 'problem while updating orderlist' });
          } else {
            res.json({ message: ' orderlist updated ' });
          }
        });
    }

    if (packageId && TestId) {
      orderlist
        .update(
          { orderNumber: req.body.orderNumber },
          { where: { packagePackageId: packageId, TestTestId: TestId } }
        )
        .then(function (s) {
          if (!s) {
            res.json({ mesage: 'problem while updating orderlist' });
          } else {
            res.json({ message: ' orderlist updated ' });
          }
        });
    }
  });

  app.get('/packageorder/:courseId', protect, (req, res) => {
    orderlist
      .findAll({ where: { courseCourseId: req.params.courseId } })
      .then((s) => {
        res.send(s);
      });
  });

  app.get('/packageorder/:subjectId', protect, (req, res) => {
    orderlist
      .findAll({ where: { subjectId: req.params.subjectId } })
      .then((s) => {
        res.send(s);
      });
  });

  app.get('/packageorder/:topicId', protect, (req, res) => {
    orderlist.findAll({ where: { topicId: req.params.topicId } }).then((s) => {
      res.send(s);
    });
  });

  app.get('/packageorder/:chapterId', protect, (req, res) => {
    orderlist
      .findAll({ where: { chapterChapterId: req.params.chapterId } })
      .then((s) => {
        res.send(s);
      });
  });

  app.get('/pacakge/:packageId', protect, (req, res) => {
    packages
      .findAll({
        where: { packageId: req.params.packageId },
        include: [
          {
            model: orderlist,
            as: 'list',
          },
        ],
      })
      .then((course) => {
        res.send(course);
      });
  });

  app.post('/addcoursetopackage', protect, (req, res) => {
    var s;
    video
      .findAndCountAll({ where: { courseCourseId: req.body.courseId } })
      .then(function (s) {
        s = s.length;
        console.log(s.length);
        console.log('s', s);
      })
      .then((s) => {
        for (let i = 0; i < s; i++) { }
      });
  });

  app.put('/updatepackage/', protect, authorize('admin'), function (req, res) {
    packages.findOne({ where: { packageId: req.params.Id } }).then((s) => {
      if (!s) {
        res.json('no such package exist');
      }
      if (s) {
        packages
          .update(
            { PackageDesc: req.body.desc, PackageName: req.body.name },
            { where: { packageId: req.params.Id } }
          )
          .then((s) => {
            res.status(200).json({
              message: 'Package has been updated',
            });
          });
      }
    });
  });

  app.post("/buy", (req, res) => {
    let packageId = req.body.packageId;
    let userId = req.user.email_Id;
    let paymentId = req.body.paymentId;

    let paymnet_is_true = true;

    if (paymnet_is_true == true) {
      user_course.create({
        usrId: userId,
        packageId: packageId,
        paymentId: paymentId

      }).then((s, err) => {
        if (s) {
          return res.status(200).send("payment successful")
        }
      })
    }

  });

  app.delete('/deletepackage/:packageId', authorize('admin'), protect, function (req, res) {
      packages
        .findOne({ where: { packageId: req.params.packageId } })
        .then((s) => {
          if (!s) {
            res.json('no such package exist');
          }
          if (s) {
            packages
              .destroy({ where: { packageId: req.params.packageId } })
              .then((s) => {
                res.status(200).json({
                  message: 'Successfully deleted',
                });
              });
          }
        });
    }
  );

  app.post("/addusertopackage", asyncHandler((req, res) => {
    let packageId = req.body.packageId;
    let emailId = req.body.email_Id;
    let addedby = req.user.email_Id;
    user_course.create({
      package_id: packageId,
      user_id: emailId,
      created_by: addedby
    }).then((s) => {
      return res.status(200).send(s)
    })
  }));

  app.post("/buynow", asyncHandler((req, res) => {
    let packageId = req.body.packageId
    let paymentId = req.body.paymentId
    let useremailId = req.body.emailId

    user_course.create({
      package_id: packageId,
      user_id: useremailId
    }).then((s) => {
      return res.status(200).send(s);
    })
  }));

  app.post("/assignStudentToPackage", asyncHandler(async (req, res) => {
    let packageId = req.body.packageId;
    let studentList = req.body.studentList;
    let userCourse = [];
    if (packageId != "" && studentList.length > 0) {
      for (const student of studentList) {
        var assignPack = {};
        assignPack['packagePackageId'] = packageId;
        assignPack['userEmailId'] = student.email_Id;
        assignPack['created_by'] = "tathagat@gmail.com" //req.user.email_Id;
        assignPack['updated_by'] = "tathagat@gmail.com" //req.user.email_Id;
        assignPack['status'] = student.status //req.user.email_Id;
        //console.log("assignPack --- ", assignPack);
        await userPackages
            .findOne({where: {packagePackageId: packageId, userEmailId: student.email_Id}})
            .then(async (s) => {
              if (!s) {
                await userPackages.create(assignPack).then((s, err) => {
                  if (err) {
                    console.log("My err --", err);
                    userCourse.push(err);
                  } else {
                    userCourse.push(s);
                  }
                });

              } else {

                await userPackages.update(
                    {status: student.status},
                    {where: {packagePackageId: packageId, userEmailId: student.email_Id}})
                    .then((s) => {
                      if (s) {
                        userCourse.push(s);
                      }
                    })
              }
            });

      }
      //console.log("userCourse -- ", userCourse);
      return res.status(200).send({code: 200, data: userCourse});
    } else {
      return res.status(201).send({code: 201, error: "packageId or Student is missing"});
    }
  }));

  app.post('/mypackages_old/', (req, res) => {
    const {packages} = db;
    userPackages.findAll({where: {userEmailId: req.body.userId}, order: [["updated_at", "DESC"]]})
        .then(async (userpackages) => {
          //console.log("userpackages --", userpackages[0]);
          if (!userpackages) {
            res.status(200).json({code: 201, error: 'no package found'});
          } else {
            var result = [];
            for (var pack of userpackages) {
              console.log("pack --", pack.packagePackageId);
              let tempPack = {
                id: pack.id,
                packagePackageId: pack.packagePackageId,
                userEmailId: pack.userEmailId,
                created_by: pack.created_by,
                created_at: pack.created_at,
                updated_by: pack.updated_by,
                updated_at: pack.updated_at,
                status: pack.status
              }

              if (pack.status == 1) {
                await packages.findOne({
                  attributes: ['packageId', 'PackageName'],
                  where: {packageId: pack.packagePackageId}
                })
                    .then((e) => {

                      let m = {}
                      if (!e) {
                        //res.status(200).json({code:201, error:'no package found'});
                      } else {
                        let arr = []
                        let count = 0
                        //console.log("🚀 ~ file: packageRoute.js ~ line 157 ~ packages.findOne ~ e", e)
                        m.packageId = e.packageId
                        //m.users = e.user_course
                        m.name = e.PackageName
                        m.price = e.Packageprice
                        m.PackageDesc = e.PackageDesc
                        m.CourseId = e.courseCourseId
                        m.thumbnail = e.thumbnail
                        m.questionCount = e.TestList && e.TestList.map(j => j.Section && j.Section.map(k => count += k.QuestionList.length))
                        m.TestList = e.TestList
                        arr.push(m);
                        count = 0;
                      }
                      tempPack.pack_details = m;
                      result.push(tempPack);

                    });
              }

            }
            res.status(200).json({code: 200, data: result});
          }

        });
  });

  // for testing...
  app.post("/assignStudentPackage",protect, asyncHandler( async (req, res) => {
    
    let packageId = req.body.packageId;
    let studentList = req.body.studentList;
    let userCourse = [];
    if(packageId !="" && studentList.length>0){

      let stmt = 'INSERT INTO user_packages (package_id,user_id,created_by,updated_by) VALUES ';
      var smtValues = '';
      var index = 1;
      for (const student of studentList) { 
        var assignPack = [];

        assignPack['package_id'] = packageId;
        assignPack['user_id'] = student.email_Id;
        assignPack['created_by'] = req.user.email_Id;
        assignPack['updated_by'] = req.user.email_Id;
        userCourse.push([packageId,student.email_Id,req.user.email_Id,req.user.email_Id]);
        smtValues += "('"+packageId+"','"+ student.email_Id + "', '" + req.user.email_Id + "', '" + req.user.email_Id+ "')";
        if(index < (studentList.length) && (studentList.length) >1){
          smtValues += ", "
        }
        index++;
        // await user_course.create(assignPack).then((s, err) => {
        //   if(err){
        //     userCourse.push(err);
        //   }else{
        //     userCourse.push(s);
        //   }        
        // });
      }
      stmt = stmt + smtValues;
      //console.log("userCourse -- ", userCourse);
      sequelize.query(stmt, userCourse, (err, results, fields) => {
        if (err) {
          return console.error(err.message);
        }else{
          console.log('results: -- ' + results);
          console.log('fields: -- ' + fields);
          console.log('Row inserted: -- ' + results.affectedRows);
          return res.status(200).send({status:200, data:results});
        }
        // get inserted rows
      });
      //console.log("userCourse -- ", userCourse);
      
    }else{
      return res.status(201).send({status:201, error:"packageId or Student is missing"});
    }
  }));

  app.get('/getallpackagebyid/:packageId', async (req, res) => {


    let aqlQuery = "SELECT pkg.*, cou.courseName,sub.subjectName, chp.chapterName, tpc.topicName  FROM packages as pkg ";
    aqlQuery +="LEFT JOIN  courses as cou ON cou.courseId = pkg.courseCourseId ";
    aqlQuery +="LEFT JOIN  subjects as sub ON sub.subjectId = pkg.subjectId ";
    aqlQuery +="LEFT JOIN  chapters as chp ON chp.chapterId = pkg.chapterChapterId ";
    aqlQuery +="LEFT JOIN  topics as tpc ON tpc.topicId = pkg.topicId ";
    aqlQuery +=" WHERE pkg.packageId = '"+req.params.packageId+"'";

    let result = await sequelize.query(aqlQuery, { 
      type: sequelize.QueryTypes.SELECT 
    });
    let arr = []
    if(result.length > 0){
      let e = result[0];  
      let count = 0
      //console.log("Result ------- ", result);
      //console.log("Result END ------------------------------- ");
      let m = {}
      m.packageId = e.packageId
      //m.users = e.user_course
      m.name = e.PackageName
      m.price = e.Packageprice
      m.PackageDesc = e.PackageDesc
      m.CourseId = e.courseCourseId
      m.courseName = e.courseName
      m.subjectName = e.subjectName
      m.chapterName = e.chapterName
      m.officialDesc = e.officialDesc  
      m.subjectId = e.subjectId  
      m.chapterChapterId = e.chapterChapterId  
      m.topicId = e.topicId  

      m.thumbnail = e.thumbnail
      //m.questionCount = e.TestList && e.TestList.map(j => j.Section && j.Section.map(k => count += k.QuestionList.length))
      var array = JSON.parse("[" + e.TestList + "]");
      m.TestList = array[0];
      arr.push(m)
    }
    
    res.status(200).json(arr);
  });

  app.post('/mypackages/', async (req, res) => {
    const { packages } = db;

    let pkSqlQuery = "SELECT";
    pkSqlQuery += " pkg.packageId, pkg.PackageName, pkg.packagePrice, cou.courseId,cou.courseName,sub.subjectId,sub.subjectName, chp.chapterName,tpc.topicId, tpc.topicName, pkg.thumbnail ";
    pkSqlQuery += " FROM packages as pkg ";
    pkSqlQuery +=" LEFT JOIN  courses as cou ON cou.courseId = pkg.courseCourseId ";
    pkSqlQuery +=" LEFT JOIN  subjects as sub ON sub.subjectId = pkg.subjectId ";
    pkSqlQuery +=" LEFT JOIN  chapters as chp ON chp.chapterId = pkg.chapterChapterId ";
    pkSqlQuery +=" LEFT JOIN  topics as tpc ON tpc.topicId = pkg.topicId ";
    pkSqlQuery += " WHERE pkg.packagePrice=0";

    let pkgResult = await sequelize.query(pkSqlQuery, { 
      type: sequelize.QueryTypes.SELECT 
    });

    let sqlQuery = "SELECT";
    sqlQuery += " pkg.packageId, pkg.PackageName, pkg.packagePrice, cou.courseId,cou.courseName,sub.subjectId,sub.subjectName, chp.chapterName,tpc.topicId, tpc.topicName, pkg.thumbnail ";
    sqlQuery += " FROM user_packages as up ";
    sqlQuery += " INNER JOIN packages as pkg ON pkg.packageId = up.packagePackageId AND pkg.packagePrice>0";
    sqlQuery +=" LEFT JOIN  courses as cou ON cou.courseId = pkg.courseCourseId ";
    sqlQuery +=" LEFT JOIN  subjects as sub ON sub.subjectId = pkg.subjectId ";
    sqlQuery +=" LEFT JOIN  chapters as chp ON chp.chapterId = pkg.chapterChapterId ";
    sqlQuery +=" LEFT JOIN  topics as tpc ON tpc.topicId = pkg.topicId ";
    sqlQuery += " WHERE up.userEmailId = '"+req.body.userId+"'";
    sqlQuery += " AND up.status=1";


    let upkResult = await sequelize.query(sqlQuery, { 
      type: sequelize.QueryTypes.SELECT 
    });

    let combineArr = pkgResult.concat(upkResult);
    console.log("=========================================");
    console.log("pkgResult ==== " ,  pkgResult);
    console.log("=========================================");
    console.log("upkResult ==== " ,  upkResult);
    console.log("=========================================");
    console.log("combineArr ==== " ,  combineArr);
    console.log("=========================================");
    res.status(200).json({code:200, data: combineArr});
  });

  app.get('/getPackageDetails/:packageId', async (req, res) => {
    let result = {};
    let status = 201;
    let data = await getPackageDetails(req.params.packageId, req.query.userId);
    let testCount = await getMyTestCount(req.params.packageId, req.query.userId);
    if(data.pckDetails){
      let packageDetails = data.pckDetails;
      let testDetails = data.testDetails;
      testCount.totalTests= data.totalTests;
      let testList = []; //JSON.parse(packageDetails.TestList);
      let courseList = [{"courseId": packageDetails.courseCourseId, "courseName":packageDetails.courseName}]
      let resultSet = {packageDetails, courseList, testList, testDetails, testCount}
      status = 200; result = resultSet;
    }else{
      status =201; 
    }
    res.status(status).json(result);
  });

  app.get('/getSubjectList/:packageId/:courseId', async (req, res) => {
    subject.findAll({ where: { courseCourseId: req.params.courseId }, order:[["subjectName", "ASC"]]}).then( async (subjectList) => {
      req.params.examLevel = 1;
      if(req.query.userId){
        req.params.userId = req.query.userId;
      }
      let testList = await getTestList(req.params);
      let resultSet = {"subjectList":subjectList, "testList":testList}
      res.status(200).json(resultSet);
    }).catch((err)=>{
      console.log("getSubjectList  err------- ", err);
      res.status(201).json(err);
    });
  });

  app.get('/getChaperList/:packageId/:subjectId', async (req, res) => {
    chapters.findAll({ where: { subjectId: req.params.subjectId }, order:[["chapterName", "ASC"]]}).then( async (chapterList) => {
      req.params.examLevel = 2;
      if(req.query.userId){
        req.params.userId = req.query.userId;
      }
      let testList = await getTestList(req.params);
      let resultSet = {chapterList,testList}
      res.status(200).json(resultSet);
    }).catch((err)=>{
      console.log("getChaperList  err------- ", err);
      res.status(201).json(err);
    });
  });

  app.get('/getTopicList/:packageId/:chapterId', async (req, res) => {
    topic.findAll({ where: {chapterChapterId: req.params.chapterId }, order:[["topicName", "ASC"]]}).then( async (topicList) => {
      req.params.examLevel = 3;
      if(req.query.userId){
        req.params.userId = req.query.userId;
      }
      let testList = await getTestList(req.params);
      let resultSet = {topicList,testList}
      res.status(200).json(resultSet);
    }).catch((err)=>{
      console.log("getTopicList  err------- ", err);
      res.status(201).json(err);
    });
  });

  app.get('/getTopicTestList/:packageId/:topicId', async (req, res) => {
    
      let testList = [];
      req.params.examLevel = 4;
      if(req.query.userId){
        req.params.userId = req.query.userId;
      }
      var tests = await getTestList(req.params)
      if(tests){
        testList = tests;
      }
      let resultSet = {testList}
      res.status(200).json(resultSet);
  });

  async function getPackageDetails(packageId, userId){

    const {sequelize } = db;
    let aqlQuery = "SELECT pkg.*, cou.courseName,sub.subjectName, chp.chapterName, tpc.topicName  FROM packages as pkg ";
    aqlQuery +="INNER JOIN  courses as cou ON cou.courseId = pkg.courseCourseId ";
    aqlQuery +="LEFT JOIN  subjects as sub ON sub.subjectId = pkg.subjectId ";
    aqlQuery +="LEFT JOIN  chapters as chp ON chp.chapterId = pkg.chapterChapterId ";
    aqlQuery +="LEFT JOIN  topics as tpc ON tpc.topicId = pkg.topicId ";
    aqlQuery +=" WHERE pkg.packageId = '"+packageId+"'";
    let result = await sequelize.query(aqlQuery, {type: sequelize.QueryTypes.SELECT});
    if(result){
      let testList = JSON.parse("["+result[0].TestList+"]");
      let testId = [];
      testList[0].map((data, i)=>{
        let s = "'"+data.TestId+"'";
        testId.push(s);
      })

      let sqlQuery = "SELECT tst.TestTitle, tst.Test_Id, tst.subjectId, cou.courseName,sub.subjectName, chp.chapterName, tpc.topicName, testAtm.attempt_id FROM Test as tst ";
      sqlQuery +=" INNER JOIN  courses as cou ON cou.courseId = tst.courseCourseId ";
      sqlQuery +=" LEFT JOIN  subjects as sub ON sub.subjectId = tst.subjectId ";
      sqlQuery +=" LEFT JOIN  chapters as chp ON chp.chapterId = tst.chapterChapterId ";
      sqlQuery +=" LEFT JOIN  topics as tpc ON tpc.topicId = tst.topicId ";
      sqlQuery +=" LEFT JOIN  test_attempted as testAtm ON testAtm.testId = tst.Test_Id AND testAtm.userId = '"+ userId +"' AND testAtm.packageId = '"+packageId+"'";
      sqlQuery +=" WHERE tst.Test_Id IN ("+testId.join(',')+")";
      sqlQuery +=" GROUP BY tst.Test_Id";
      sqlQuery +=" ORDER BY tst.sorting_order ASC";
      
      let testResult = await sequelize.query(sqlQuery, {type: sequelize.QueryTypes.SELECT});
      let subId = [];
      let totalTests = testId.length;
      return {"testDetails":testResult, "pckDetails": result[0], "totalTests":totalTests};

    }
    // testResult = testResult.map((d,i)=>{
    //   return {
    //     Test_Id: d.Test_Id,
    //     subjectId: d.subjectId,
    //     subjectName: d.subjectName
    //   }
    // })
    // let finalTestResult = [];

    // finalTestResult = testResult.reduce((agg,curr, i) => {
    //   let found = agg.find((x) => x.subjectId === curr.subjectId);
    //   if(found){
    //     found.testData.push(curr);
    //     found.testDataCount = i + 1;
    //   }
    //   else{
    //     let newJson =  {
    //       subjectId : curr.subjectId,
    //       subjectName : curr.subjectName,
    //       testData: [],
    //       chapterData: [],
    //       testDataCount: 1
    //      }
    //      newJson['testData'].push(curr)

    //      agg.push(newJson);
    //   }
    //   return agg;
    //   },[]);

      // finalTestResult = finalTestResult.map((d,i)=>{
      //   d.chapterData = d.testData.reduce((agg,curr, i) => {
      //     let found = agg.find((x) => x.chapterChapterId === curr.chapterChapterId);
      //     if(found){
      //       found.testData.push(curr);
      //     } else {
      //       let newJson =  {
      //         chapterName: curr.chapterName,
      //         chapterChapterId: curr.chapterChapterId,
      //         testData: [],
      //         topicData:[]
      //       }
            
      //       newJson['testData'].push(curr)

      //       agg.push(newJson);
      //     }
      //     return agg;
      //   }, []);

        // d.chapterData.map((t,a)=>{
        //   t.topicData = t.testData.reduce((agg,curr, i) => {
        //     let found = agg.find((x) => x.topicId === curr.topicId);
        //     if(found){
        //       if(curr.examLevel == 4){
        //         found.testData.push(curr);
        //       }
        //     } else {
        //       let newJson =  {
        //         topicId: curr.topicId,
        //         topicName: curr.topicName,
        //         testData: []
        //       }
              
        //       if(curr.examLevel == 4){
        //         newJson.testData.push(curr)
                
        //       }
        //       agg.push(newJson);
        //     }
        //     return agg;
        //   }, []);
        // })

        // return d;
      // })
      
  }

  async function getTestList(params){
    let packageId = (params.packageId)?params.packageId:'';
    let examLevel = (params.examLevel)?params.examLevel:'0';
    let courseId =  (params.courseId)?params.courseId:''; 
    let subjectId = (params.subjectId)?params.subjectId:''; 
    let chapterId = (params.chapterId)?params.chapterId:''; 
    let topicId = (params.topicId)?params.topicId:''; 
    let userId = (params.userId)?params.userId:''; 
    const {sequelize } = db;
    var packageTestList = [];
    let resultSet = [];
    if(packageId !=''){
      packageTestList = await getPackageTestList(packageId);
      console.log("packageTestList in getTestList ------- ", packageTestList);
      if(packageTestList.length >0){

        let sqlQuery = "SELECT t.*"; 
        
        if(userId !=''){
          sqlQuery +=", ta.attempt_id";  
        }

        sqlQuery +=" FROM Test as t ";

        if(userId !=''){
          sqlQuery +=" LEFT JOIN test_attempted as ta ON ta.testId = t.Test_Id AND ta.userId = '"+ userId +"'";
        }
        
        sqlQuery +=" WHERE t.examLevel = "+ examLevel ;
        if(courseId)
        sqlQuery +=" AND t.courseCourseId = '"+courseId+"'";
        if(subjectId)
        sqlQuery +=" AND t.subjectId = '"+subjectId+"'";
        if(chapterId)
        sqlQuery +=" AND t.chapterChapterId = '"+chapterId+"'";
        if(topicId)
        sqlQuery +=" AND t.topicId = '"+topicId+"'";

        sqlQuery +=" GROUP BY t.Test_Id ";
        sqlQuery +=" ORDER BY sorting_order ASC";
        console.log("sqlQuery ------- : ", sqlQuery);
        let testArr = await sequelize.query(sqlQuery, {type: sequelize.QueryTypes.SELECT});
        if(testArr.length >0){
          for(test of testArr){
            if(packageTestList.includes(test.Test_Id)){
              resultSet.push(test);
              console.log("test in getTestList for loop ------- ", test);
            }
          }
        }
      }
    }
    console.log("resultSet in getTestList at end  ------- ", resultSet);
    return resultSet;
  }

  async function getPackageTestList(packageId){

    const {sequelize } = db;
    let aqlQuery = "SELECT packageId, JSON_EXTRACT(TestList, '$[*].TestId') AS testIds FROM packages ";
    aqlQuery +=" WHERE packageId = '"+packageId+"'";
    let result = await sequelize.query(aqlQuery, {type: sequelize.QueryTypes.SELECT});
    //console.log("JSON_EXTRACT myyyyy ------- ", result);
    //console.log("JSON_EXTRACT END ------------------------------- ");
    let resultSet  = [];
    if(typeof result != "undefined"){
      if(typeof result[0].testIds != "undefined"){
        resultSet = result[0].testIds;
      }
    }
    return resultSet;
  }

  async function getMyTestCount(packageId, userId){

    const {sequelize } = db;
    let aqlQuery = "SELECT count(DISTINCT testId) AS myTotalTest FROM test_attempted where packageId ='"+packageId+"' AND userId ='"+userId+"'";
    let result = await sequelize.query(aqlQuery, {type: sequelize.QueryTypes.SELECT});
    let myTotalTests  = 0;
    if(typeof result != "undefined"){
      if(typeof result[0].myTotalTest != "undefined"){
        myTotalTests = result[0].myTotalTest;
      }
    }

    // let aqlQuery1 = "SELECT packageId, count(JSON_EXTRACT(TestList, '$[*].TestId')) AS totalTest  FROM packages ";
    // aqlQuery1 +=" WHERE packageId = '"+packageId+"'";
    // let result1 = await sequelize.query(aqlQuery1, {type: sequelize.QueryTypes.SELECT});
    // let totalTest  = [];
    // if(typeof result1){
    //   if(typeof result1[0].totalTest){
    //     totalTest = result1[0].totalTest;
    //   }
    // }

    return {myTotalTests};
  }


  app.get("/getPackagesInfoByUserId/:packageId/:userId",async (req,res) => {

    userPackages.findOne({where: {userEmailId: req.params.userId,packagePackageId:req.params.packageId}, order: [["updated_at", "DESC"]]})
        .then(async (userpackages) => {
          //console.log("userpackages --", userpackages[0]);
          if (!userpackages) {
            res.status(200).json({code: 201, error: 'no package found'});
          } else {

            let tempPack = {
              id: userpackages.id,
              packagePackageId: userpackages.packagePackageId,
              userEmailId: userpackages.userEmailId,
              created_by: userpackages.created_by,
              created_at: userpackages.created_at,
              updated_by: userpackages.updated_by,
              updated_at: userpackages.updated_at,
              status: userpackages.status
            }

            if (userpackages.status == 1) {

              await packages.findOne({
                where: {packageId: req.params.packageId}
              })
                  .then((e) => {

                    let m = {}
                    if (!e) {
                      //res.status(200).json({code:201, error:'no package found'});
                    } else {
                      let arr = []
                      let count = 0
                      //console.log("🚀 ~ file: packageRoute.js ~ line 157 ~ packages.findOne ~ e", e)
                      m.packageId = e.packageId
                      //m.users = e.user_course
                      m.name = e.PackageName
                      m.price = e.Packageprice
                      m.PackageDesc = e.PackageDesc
                      m.CourseId = e.courseCourseId
                      m.thumbnail = e.thumbnail
                      m.TestList = e.TestList
                      arr.push(m);
                      count = 0;
                    }
                    tempPack.pack_details = m;

                  });

              res.status(200).json({code: 200, data: tempPack});

            }else {
              res.status(200).json({code: 201, error: 'package status false'});

            }

          }
        });


  });



};
