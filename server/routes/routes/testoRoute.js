const { parse } = require('dotenv');
const express = require('express');
const router = express.Router();

const { protect, authorize } = require('../../middleware/auth');
const {getPackageUserID, getPackageInfo, getBookmarkQue} = require("../../helper/helper");

module.exports = (app, db) => {
  const { subject, course, topic, chapters, Test,questions, packages, testType, testAttempted,users,
    testSectionResult,
    testQuestionResult } = db;
  app.get('/testo', protect, (req, res) => {
    course
      .findAll({
        include: [
          {
            model: subject,
            as: 'Subjects',
            include: [
              {
                model: topic,
                as: 'Topics',
                include: [
                  {
                    model: chapters,
                    as: 'chapters',
                  },
                ],
              },
            ],
          },
        ],
      })
      .then((course) => {
        console.log(course);
        const resObj = course.map((course) => {
          //tidy up the user data
          return Object.assign(
            {},
            {
              course_Id: course.courseId,
              courseName: course.courseName,
              courseDesc: course.courseDesc,
              subjectName: course.subjectName.map((subject) => {
                //tidy up the post data
                return Object.assign(
                  {},
                  {
                    courseName: subject.courseName,
                    subjectName: subject.subjectName,
                    topicName: subject.topicName.map((topic) => {
                      //tidy up the comment data
                      return Object.assign(
                        {},
                        {
                          subjectName: topic.subjectName,
                          topicName: topic.topicName,
                          //  chapter: topic.chapter.map(chapter => {
                          //    return Object.assign(
                          //      {}, {
                          //      chapterId: chapter.chapterId,
                          //      chapterName: chapter.chapterName,
                          //      topicId: chapter.topicId
                          //    }
                          //    )
                          //  })
                        }
                      );
                    }),
                  }
                );
              }),
            }
          );
        });
        res.json(resObj);
      });
  });
  
  app.post('/createtest', (req, res) => {
    console.log("🚀 ~ file: testoRoute.js ~ line 76 ~ app.post ~ req", req.body, req.body.TestTitle)
    Test.create({
      TestTitle: req.body.TestTitle,
      exam_type: req.body.exam_type,
      examLevel: req.body.examLevel,
      totaltime: req.body.totaltime,
      subjectId: req.body.subjectId,
      topicId: req.body.topicId,
      chapterChapterId: req.body.chapterId,
      courseCourseId: req.body.courseId,
      SectionRule: req.body.rule,
      Section: req.body.Section,
      instructions: req.body.instructions
    }).then((s) => {
      if (s) {
        res.status(200).send(s);
      }
    })
  });

  app.put('/edittest', (req, res) => {

    Test.update(
      { packagePackageId: req.body.packageId },
      { where: { testId: req.params.testId } }
    )
      .then((s) => {
        if (s) {
          res.status(200).send(s);
        }
      })
  });

  app.get('/gettest/:testId', (req, res) => {
    Test.findAll({
      where: {
        Test_Id: req.params.testId,
        //PackagePrice:'0'
      }
    }).then((s, err) => {
      let arr = []
      if (s) {
        res.status(200).send(s)
      }
    })
  });
  
  app.get('/alltest/', async (req, res) => {
    const {sequelize } = db;
    //console.log("req ================= ", req.query);
    let sqlQuery = ' SELECT `Test_Id` as `TestId`, `TestTitle`, `exam_type`, `examLevel`, `created_at`, `updated_at`, `SectionRule`, `totaltime`, `courseCourseId`, `subjectId`, `topicId`, `chapterChapterId`, `packagePackageId`, `sorting_order` ';
    sqlQuery += ', JSON_REPLACE(json_unquote(Section), "$[0].QuestionList", "[]", "$[1].QuestionList", "[]", "$[2].QuestionList", "[]") as `Section` ';
    sqlQuery += ' FROM Test ';
    sqlQuery += ' WHERE 1=1 ';

    var whereClause = {}
    if(typeof req.query.courseId != 'undefined'){
      whereClause['courseCourseId'] = req.query.courseId;
      sqlQuery += " AND courseCourseId = '" + req.query.courseId + "'";
    }
    
    if(typeof req.query.subjectId != 'undefined'){
      whereClause['subjectId'] = req.query.subjectId;
      sqlQuery += " AND subjectId = '" + req.query.subjectId +"'";
    }
    
    if(typeof req.query.chapterId != 'undefined'){
      whereClause['chapterChapterId'] = req.query.chapterId;
      sqlQuery += " AND chapterChapterId = '"+ req.query.chapterId + "'";
    }
    
    if(typeof req.query.topicId != 'undefined'){
      whereClause['topicId'] = req.query.topicId;
      sqlQuery += " AND topicId = '"+ req.query.topicId + "'";
    }
    sqlQuery +=' ORDER BY created_at DESC';

    // var orderBy = [['created_at','DESC']];
    // var attributesArr = [`Test_Id`, `TestTitle`, `exam_type`, `examLevel`, `created_at`, `updated_at`, `SectionRule`, `totaltime`, `courseCourseId`, `subjectId`, `topicId`, `chapterChapterId`, `packagePackageId`, `sorting_order`, `Section` ];
    // Test.findAll({attributes:attributesArr, where:whereClause, order:orderBy}).then((s, err) => {
    //   if (s) {
    //     res.status(200).send(s);
    //   }
    // });
    let result = await sequelize.query(sqlQuery, {type: sequelize.QueryTypes.SELECT});
    console.log("result",result)
    //for (data of result){
     // data.Section = JSON.parse(data.Section);
    //}
    //console.log("query result ===", result);
    res.status(200).send(result);
  });

  app.get('/gettestbypackage/:packageId', (req, res) => {
    packages.findAll({
      where: {
        packageId: req.params.packageId

      }
    }).then((s, err) => {
      if (s) {
        res.status(200).send(s)
      }
    })
  });

  app.get('gettestbycourse/:courseId', protect, (req, res) => {
    Test.findAll({
      where: {
        courseCourseId: req.params.courseId

      }
    }).then((s, err) => {
      if (s) {
        res.status(200).send(s)
      }
    })
  });
  
  app.get('gettestbysubject/:subjectId', protect, (req, res) => {
    Test.findAll({
      where: {
        subjectId: req.params.subjectId

      }
    }).then((s, err) => {
      if (s) {
        res.status(200).send(s)
      }
    })
  });

  app.get('gettestbytopic/:topicId', protect, (req, res) => {
    Test.findAll({
      where: {
        topicId: req.params.topicId

      }
    }).then((s, err) => {
      if (s) {
        res.status(200).send(s)
      }
    })
  });

  app.get('gettestbychapter/:chapterId', protect, (req, res) => {
    Test.findAll({
      where: {
        chapterChapterId: req.params.chapterId

      }
    }).then((s, err) => {
      if (s) {
        res.status(200).send(s)
      }
    })
  });

  app.get('gettest');

  app.get('/test-type/', (req, res) => {
    var whereClause = {}
    whereClause['status'] =1;
    var orderBy = [['sort_order','ASC']];
    testType.findAll({where:whereClause, order:orderBy}).then((s, err) => {
      if(err){
        res.status(402).send(err)
      }else{
          res.status(200).send(s)        
      }
    });
  });

  app.post('/submitTest', (req, res)=>{
    if(typeof req.body != "undefined"){
      let postData = req.body;
      console.log("postData --- ====", postData);

      if(typeof postData.userId !="undefined"){
        let finalResult = {};
        let fullAttempt = (postData.full_attempt) ? postData.full_attempt : 1;
        fullAttempt = parseInt(fullAttempt);
        finalResult = { "userId":postData.userId, "testId": postData.testId, "packageId": postData.packageId, "full_attempt ": fullAttempt, "testResult":postData}
        if(typeof postData.attempt_id != "undefined" ){
          if(postData.attempt_id !=''){
            testAttempted.update(finalResult,{ where: { attempt_id: postData.attempt_id } }).then((s) => { 
              if(s){
                let wahereClouse = {where: {"attempt_id":postData.attempt_id}}
                testAttempted.findOne(wahereClouse).then((sd) => {
                  let result = {};
                  if(typeof sd.testResult !="undefined"){
                    sd.testResult.attempt_id = sd.attempt_id; 
                    result = sd.testResult
                  }
                  res.status(200).send(result);

                }).catch((err)=>{
                  res.status(402).send(err);      
                });
              }else{
                res.status(202).send({message:"something went wrong"});
              }
            }).catch((err)=>{ res.status(402).send(err);});
          }
        }else{
          console.log("finalResult --- ====", finalResult);
          testAttempted.create(finalResult).then((s) => { res.status(200).send(s); }).catch((err)=>{ res.status(202).send(err);});
        }
        
      }
    }
  });

  app.post('/reviewTest', (req, res)=>{
    if(typeof req.body != "undefined"){
      let params = req.body;
      if(typeof params.userId !="undefined"){
        let wahereClouse = {};
        //let selectColumns = ["userId", "testId", "packageId","JSON_EXTRACT(testResult, '$.netScore') as score"];
        let selectColumns = ["userId", "testId", "packageId","JSON_EXTRACT(testResult, '$.netScore') as score"];
        //console.log("zzzzz",params)
        wahereClouse = {where: {"userId":params.userId, "testId":params.testId, "packageId":params.packageId}}
        //wahereClouse = {where: {"userId":params.userId, "testId":params.testId}}
        testAttempted.findOne(wahereClouse).then(async(s) => {
            let result = {};
            if(s && typeof s.testResult !="undefined"){
              s.testResult.attempt_id = s.attempt_id; 
              var scoreData = await getUserTestPercentile(params);
              s.testResult.test_score = scoreData.test_score;
              s.testResult.rank = scoreData.rank;
              s.testResult.percentile = scoreData.percentile;

              let sectionArr = s.testResult.section
              var secNum = 1;
              var secIndex = 0;
              for(var secData of sectionArr){
                secNum = parseInt(secIndex)+1
                var secScore = await getTestSectionPercentile(params, secNum);
                secData.rank = secScore.rank;
                secData.percentile = secScore.percentile;
                secData.sectionNum = secScore.sectionNum;
                s.testResult.section[secIndex] = secData;

                var avgSpentTime = 0
                var avgCorrentSpentTime = 0
                for(var que of secData.question){
                  avgSpentTime = avgSpentTime +parseInt(que.timeTaken)
                  if(que.answerStatus == "C"){
                    avgCorrentSpentTime = avgCorrentSpentTime + parseInt(que.timeTaken)
                  }
                }
                console.log(avgSpentTime)
                avgSpentTime = avgSpentTime/secData.question.length
                avgCorrentSpentTime = avgCorrentSpentTime/secData.correctAnswers
                s.testResult.section[secIndex]["avgSpentTime"] = avgSpentTime;
                s.testResult.section[secIndex]["avgCorrentSpentTime"] = avgCorrentSpentTime;
                secIndex++
              }
              console.log("sec Score == ", secScore);
              result = s.testResult
              req.db = db
              req.body.userEmailId = req.body.userId
              var QueBookmark = await getBookmarkQue(req);

              console.log(QueBookmark)

              var sectionIndex = 0;
              for(var section of result.section) {
                var index = 0;
                for (var que of section.question) {
                  result.section[sectionIndex].question[index]["bookmark"] = false;
                  await QueBookmark.forEach(obj => {
                    console.log(obj.questionsId.toString() , que.questionId.toString(), (obj.questionsId.toString() === que.questionId.toString()),index,sectionIndex)
                    if (obj.questionsId.toString() === que.questionId.toString()) {
                      result.section[sectionIndex].question[index]["bookmark"] = true;
                    }
                  });

                  index++
                }
                sectionIndex ++
              }
            }
            console.log("sadcas")
            res.status(200).send(result);
        }).catch((err)=>{
          console.log("vvvvv",err)
            res.status(402).send(err);      
        });
      }
    }
  });

  async function oldgetUserTestRank(params){
    const {sequelize } = db;
    let aqlQuery = 'SELECT userId, JSON_EXTRACT(testResult, "$.netScore") as score, FIND_IN_SET( JSON_EXTRACT(testResult, "$.netScore"), ( SELECT GROUP_CONCAT( JSON_EXTRACT(testResult, "$.netScore") ORDER BY JSON_EXTRACT(testResult, "$.netScore") DESC ) FROM test_attempted )) AS rank FROM `test_attempted` ';

    //let aqlQuery = 'SELECT userId, JSON_EXTRACT(testResult, "$.netScore") as score, FIND_IN_SET( JSON_EXTRACT(testResult, "$.netScore"), ( SELECT GROUP_CONCAT( JSON_EXTRACT(testResult, "$.netScore") ORDER BY JSON_EXTRACT(testResult, "$.netScore") DESC ) FROM test_attempted WHERE testId = "' + params.testId + '" AND packageId = "' + params.packageId + '")) AS rank FROM `test_attempted` ';
    aqlQuery +=" WHERE userId = '"+params.userId + "' AND testId = '" + params.testId + "' AND packageId = '" + params.packageId +"'";
    aqlQuery +=' ORDER BY JSON_EXTRACT(testResult,"$.netScore") ASC';
    
    console.log("aqlQuery  ------- ", aqlQuery);

    let result = await sequelize.query(aqlQuery, {type: sequelize.QueryTypes.SELECT});
    console.log("getUserRank JSON_EXTRACT ------- ", result);
    console.log("JSON_EXTRACT END ------------------------------- ");
    let resultSet  = [];
    if(typeof result != "undefined"){
        resultSet = result[0];
    }
    return resultSet;
  };

  async function getUserTestRank(params){
    const {sequelize } = db;
    let rankQuery = "SELECT GROUP_CONCAT(score ORDER BY score DESC) FROM student_result ";
    rankQuery +=" WHERE testId = '" + params.testId + "'";
    //rankQuery +=" AND packageId = '"+ params.packageId +"'";

    let aqlQuery = "SELECT userId, score as score, FIND_IN_SET( score, ("+rankQuery+")) AS rank FROM student_result ";
    aqlQuery +=" WHERE testId = '" + params.testId + "' AND userId = '"+params.userId + "'";
    aqlQuery +=" AND packageId = '" + params.packageId +"'";
   //aqlQuery +=' ORDER BY netScore ASC';
    
    console.log("aqlQuery  ------- ", aqlQuery);

    let result = await sequelize.query(aqlQuery, {type: sequelize.QueryTypes.SELECT});
    console.log("getUserRank JSON_EXTRACT ------- ", result);
    console.log("JSON_EXTRACT END ------------------------------- ");
    let resultSet  = [];
    if(typeof result != "undefined"){
        resultSet = result[0];
    }
    return resultSet;
  };

  async function getUserTestPercentile(params){
    const usercount = await users.count({
      where: { user_type: "student" },
    });
    let userId = params.userId;
    let testId = params.testId;
    let packageId = params.packageId;
    let scoreData = await getUserTestRank(params);
    let test_score = scoreData.test_score;
    let rank = parseInt(scoreData.rank);
    let totalEnrolledStudent = parseInt(usercount)
    let percentile = (totalEnrolledStudent - rank + 1)/totalEnrolledStudent*100;
    let result = {userId,testId,packageId, test_score, rank, percentile,totalEnrolledStudent }
    return result;
  };

  async function getTestSectionRank(params,sec=1){
      const {sequelize } = db;
      let section_name = 'section'+sec+'_score';

      let rankQuery = "SELECT GROUP_CONCAT("+section_name+" ORDER BY "+section_name+" DESC) FROM student_result ";
      rankQuery +=" WHERE testId = '" + params.testId + "'";
      //rankQuery +=" AND packageId = '"+ params.packageId +"'";
  
      let aqlQuery = "SELECT userId, "+section_name+" as score, FIND_IN_SET( "+section_name+", ("+rankQuery+")) AS rank FROM student_result ";
      aqlQuery +=" WHERE testId = '" + params.testId + "'"; 
      aqlQuery +=" AND userId = '"+params.userId + "'";
      //aqlQuery +=" AND packageId = '" + params.packageId +"'" ;
      
     //aqlQuery +=' ORDER BY netScore ASC';
      
      console.log("aqlQuery  ------- ", aqlQuery);
  
      let result = await sequelize.query(aqlQuery, {type: sequelize.QueryTypes.SELECT});
      console.log("getUserRank JSON_EXTRACT ------- ", result);
      console.log("JSON_EXTRACT END ------------------------------- ");
      let resultSet  = [];
      if(typeof result != "undefined"){
          resultSet = result[0];
      }
      return resultSet;
  };

  async function getTestSectionPercentile(params, sec=1){

    const usercount = await users.count({
      where: { user_type: "student" },
    });

    let userId = params.userId;
    let testId = params.testId;
    let packageId = params.packageId;
    let scoreData = await getTestSectionRank(params,sec);
    let score = scoreData.score;
    let rank = parseInt(scoreData.rank);
    let totalEnrolledStudent = parseInt(usercount)
    let percentile = (totalEnrolledStudent - rank + 1)/totalEnrolledStudent*100;
    let sectionNum = sec;
    let result = {userId, testId, packageId, sectionNum, score, rank, percentile, totalEnrolledStudent }
    return result;
  };

  app.post('/getTestForTree', async (req, res) => {
    const {sequelize } = db;
    if(req.body) {
      let body = req.body
      let sqlQuery = "SELECT tst.subjectId, tst.topicId, tst.chapterChapterId, tst.packagePackageId, tst.sorting_order, tst.Test_Id, tst.created_at, tst.SectionRule, tst.totaltime, tst.courseCourseId, tst.TestTitle, tst.exam_type, tst.examLevel, tst.instructions, cou.courseName,sub.subjectName, chp.chapterName, tpc.topicName, testAtm.attempt_id FROM Test as tst ";
      sqlQuery +=" INNER JOIN  courses as cou ON cou.courseId = tst.courseCourseId ";
      sqlQuery +=" LEFT JOIN  subjects as sub ON sub.subjectId = tst.subjectId ";
      sqlQuery +=" LEFT JOIN  chapters as chp ON chp.chapterId = tst.chapterChapterId ";
      sqlQuery +=" LEFT JOIN  topics as tpc ON tpc.topicId = tst.topicId ";
      sqlQuery +=" LEFT JOIN  test_attempted as testAtm ON testAtm.testId = tst.Test_Id AND testAtm.userId = '"+ body.userId +"' AND testAtm.packageId = '"+body.packageId+"'";
      sqlQuery +=" WHERE tst.Test_Id IN ("+body.testId.join(',')+")";
      sqlQuery +=" GROUP BY tst.Test_Id";
      sqlQuery +=" ORDER BY tst.sorting_order ASC";
      
      let testResult = await sequelize.query(sqlQuery, {type: sequelize.QueryTypes.SELECT});
      res.status(200).json({testResult});
    }
  });

  app.post('/test-analysis', (req, res)=>{
    if(req.body){
      let params = req.body;
      if(params.userId){
        let wahereClouse = {};
        //let selectColumns = ["userId", "testId", "packageId","JSON_EXTRACT(testResult, '$.netScore') as score"];
        let selectColumns = ["userId", "testId", "packageId","JSON_EXTRACT(testResult, '$.netScore') as score"];
        console.log("my analysis", params)
        wahereClouse = {where: {"userId":params.userId, "testId":params.testId, "packageId":params.packageId}}
        testAttempted.findOne(wahereClouse).then(async(s) => {
            let result = {};
            if(s && typeof s.testResult !="undefined"){
              s.testResult.attempt_id = s.attempt_id; 
              var scoreData = await getUserTestPercentile(params);
              s.testResult.test_score = scoreData.test_score;
              s.testResult.rank = scoreData.rank;
              s.testResult.percentile = scoreData.percentile.toFixed(2);
              let sectionArr = s.testResult.section
              var secNum = 1;
              var secIndex = 0;
              for(var secData of sectionArr){
                secNum = parseInt(secIndex)+1
                var secScore = await getTestSectionPercentile(params, secNum);
                secData.rank = secScore.rank;
                secData.percentile = secScore.percentile.toFixed(2);
                secData.sectionNum = secScore.sectionNum;
                var questiondata = await testSectionQuestions(secData);
                var chapterdata = await testChapterReport(secData);
                secData.chapterReport = chapterdata;
                s.testResult.section[secIndex] = secData;
                secIndex++
              }
              
              //console.log("sec Score == ", secScore);
              result = s.testResult
            }
            res.status(200).send(result);
        }).catch((err)=>{
            console.log(" analysis erre : ",err)
            res.status(402).send(err);      
        });
      }
    }
  });

  async function testSectionQuestions(params){
    var result = [];
    var qusArr = params.question;
    var counter = 1;
    let allTopicsData = await getTopicDataAll();
    var questionDataAll = await getQuestionDataAAll();
    for(var qusData of qusArr){
        qusData.questionNumber = counter;
        var ansStatus = 'Un-attempted';
        if(qusData.answerStatus == 'C'){
          ansStatus = 'Correct';
        }else if(qusData.answerStatus == 'W'){
          ansStatus = 'Incorrect';
        }
        qusData.answer_status = ansStatus;
        qusData.topicName = "";

        
         if(qusData.topicId){
          
          var topicData = allTopicsData.find(topic => topic.Id==qusData.topicId);
           qusData.topicName = topicData.topicName;
         }
        qusData.user_answer = "NA";
        var user_answer = parseInt(qusData.usersAnswer)+1;
        if(parseInt(user_answer)>0){
          qusData.user_answer = user_answer;
        }
        qusData.correctoption = qusData.question = qusData.questionoption = "";
        if(qusData.questionId){
          var questionData = questionDataAll.find(qus => qus.questionId == qusData.questionId)
          console.log(" -------------- questionData == ", questionData);
          if(questionData){
             //qusData.question = questionData.question;
             //qusData.questionoption = questionData.questionoption;
             qusData.correctoption = questionData.correctoption;
          }
        }
      counter++;
      result.push(qusData);
    }
    return result;

  }

  async function getTopicData(topicId){
    return await topic.findOne({ where: { topicId: topicId } });
  }

  async function getTopicDataAll(){
    return await topic.findAll({attributes:["Id", "topicName"]});
  }

  async function getQuestionData(questionId){
    return await questions.findOne({ where: { questionId: questionId } });
  }

  async function getQuestionDataAAll(){
    return await questions.findAll({attributes:["questionId", "correctoption"]}); //, "question","questionoption"
  }

  async function testChapterReport(params){
    var chapResult = {};
    var chpresult =[];
    var chpIdArr = [];
    var chpQusArr = params.question;
    var chpQuestions = [];
    var chapterDataAll = await getChapterDataAll();
    for(var qusChp of chpQusArr){
      if(qusChp.chapterChapterId){
        var chapterData = chapterDataAll.find(chp => chp.chapterId == qusChp.chapterChapterId);
        qusChp.chapterName = chapterData.chapterName;
      }
      chpIdArr.push(qusChp.chapterChapterId);
      chpQuestions.push(qusChp)
    }

    const chpIds = [ ...new Set(chpIdArr)];
    var chapResult =[];
    var chpIndex = 0;
    for(chapterId of chpIds){
      var chpObj ={};
      console.log("testChapterReport result in for == ", chapterId);
      var totalQus = 0;
      var rigthQues = 0;
      var chapterName ="";
      //chapResult[chapterId] = [];

      for(var qusChpData of chpQuestions){
        if(chapterId==qusChpData.chapterChapterId){
          totalQus++;
          if(qusChpData.answerStatus == 'C'){
            rigthQues++;
          }
          chapterName = qusChpData.chapterName; 
        }
      }

      var scale = (rigthQues*100)/totalQus;
      scale = scale.toFixed(2);
      scale = scale/10;
      var remarks = await getRemarksForScale(scale);
      chpObj = {chapterName: chapterName,totalQuestions: totalQus, rightQuestions: rigthQues, scale: scale, remarks:remarks};
      //chapResult[chapterId].push(chpObj);
      chapResult.push(chpObj);
    }
    return chapResult;
  }

  async function getRemarksForScale(scale){
    let x = Math.round(scale);
    var remarksMsg = ["Require Conceptual Clarity","Require more practice","Good to go"];
    var index=0;
    if(x<=4){
      index = 0 ;
    }else if(x>4 && x<=6){
      index = 1 ;
    }else if(x>6){
      index = 2 ;
    } 
    return remarksMsg[index];
  }

  async function getChapterData(chapterId){
    return await chapters.findOne({ where: { chapterId: chapterId } });
  }

  async function getChapterDataAll(){
    return await chapters.findAll({attributes:["chapterName","chapterId"]});
  }

  app.post('/report-user-stand', (req, res)=>{
    if(req.body){
      let params = req.body;
      if(params.userId){
        let wahereClouse = {};
        //let selectColumns = ["userId", "testId", "packageId","JSON_EXTRACT(testResult, '$.netScore') as score"];
        let selectColumns = ["userId", "testId", "packageId","testResult"];
        //let findObj ={attributes: selectColumns, where: {"testId":params.testId, "packageId":params.packageId}};
        let findObj ={ attributes: selectColumns, where: { "testId":params.testId}};
        testAttempted.findAll(findObj).then(async(attemptResult) => {
          let studens_marks = [];
          let marksArr = [];
          let userMarks = 0;
          let userMarksRange = ''; 
          let maximumMarks = 0;
          let totalUsers = attemptResult.length;
          for(test of attemptResult){
            var testRes = test.testResult
            console.log("---- attemptResult ----", testRes);
            var netScore = parseInt(testRes.netScore);
            var totalMarks = Math.round(netScore);
            if(totalMarks<0){
              totalMarks = 0;
            }
            console.log("netScore ===" , netScore);
            var userId = test.userId;
            marksArr.push({userId, totalMarks});
            if(test.userId == params.userId){
              userMarks = totalMarks;
            }
            if(parseInt(test.totalMarks) > maximumMarks){
              maximumMarks = test.totalMarks;
            }
            
          }

          console.log("marksArr ===" , marksArr);
          maximumMarks = (maximumMarks>0)?maximumMarks:70;
          for(var marks = 0; marks<maximumMarks; marks = marks+5 ){
            console.log("marks ===" , marks);
            var firstrange = marks;
            var lastrange  = firstrange+5;
            if(marks>0){
              firstrange  = marks+1 
              lastrange  = firstrange+4
            }
            marks_range = firstrange+'-'+lastrange;
            userCountArr = [];
            for(var i=0; i<marksArr.length; i++){
              if(marksArr[i].totalMarks >= firstrange && marksArr[i].totalMarks <= lastrange){
                userCountArr.push(marksArr[i].userId);
              }
            }
            if(userMarks >= firstrange && userMarks <= lastrange){
              userMarksRange = firstrange+'-'+lastrange;
            }
            userCount = userCountArr.length;
            userPersentage = (userCount*100)/totalUsers;
            studens_marks.push({marks_range, userCount, userPersentage});
            
          }
          
          res.status(200).json({userMarks, studens_marks, userMarksRange });
        });
      }
    }
  });


  app.get('/gettest/:testId/:userId/:PackageId', (req, res) => {
    Test.findAll({
      where: {
        Test_Id: req.params.testId,
        //PackagePrice:'0'
      }
    }).then(async (s, err) => {
      let arr = []
      if (s) {
        var userTast = false
        req.db = db
        var packageList = await getPackageUserID(req);
        if(packageList.length > 0){
          for(var package of packageList){
            req.params.packageId  = package.packagePackageId
            var packageInfo = await getPackageInfo(req);
            if(packageInfo != null){
              console.log(package.packagePackageId)
              let filter = packageInfo.TestList.filter(d => d.TestId == req.params.testId)
              console.log(filter)
              if(filter.length >0){
                console.log(userTast)
                userTast = true
              }
            }

          }
        }
        console.log(userTast)
        if(userTast){
          res.status(200).send(s)
        }else {

          res.status(404).send("no access test ")
        }
      }
    })
  });


};
