const express = require("express");

const { protect, authorize } = require("../../middleware/auth");
const { getQueInfo, getPackageInfo } = require("../../helper/helper");
const cors = require("cors");
const { Op } = require("sequelize");

module.exports = (app, db) => {
	const {
		subject,
		course,
		sequelize,
		topic,
		chapters,
		Test,
		questions,
		packages,
		testType,
		testAttempted,
		users,
		testSectionResult,
		testQuestionResult,
	} = db;

	async function getUserTestPercentile(params) {
		const usercount = await users.count({
			where: { user_type: "student" },
		});
		let userId = params.userId;
		let testId = params.testId;
		let packageId = params.packageId;
		let scoreData = await getUserTestRank(params);
		let test_score = scoreData.test_score;
		let rank = parseInt(scoreData.rank);
		let totalEnrolledStudent = parseInt(params.totalcount);
		let percentile =
			((totalEnrolledStudent - rank + 1) / totalEnrolledStudent) * 100;
		let result = {
			userId,
			testId,
			packageId,
			test_score,
			rank,
			percentile,
			totalEnrolledStudent,
		};
		return result;
	}

	async function getTestSectionPercentile(params, sec = 1) {
		const usercount = await users.count({
			where: { user_type: "student" },
		});

		let userId = params.userId;
		let testId = params.testId;
		let packageId = params.packageId;
		let scoreData = await getTestSectionRank(params, sec);
		let score = scoreData.score;
		let rank = parseInt(scoreData.rank);
		let totalEnrolledStudent = parseInt(usercount);
		let percentile =
			((totalEnrolledStudent - rank + 1) / totalEnrolledStudent) * 100;
		let sectionNum = sec;
		let result = {
			userId,
			testId,
			packageId,
			sectionNum,
			score,
			rank,
			percentile,
			totalEnrolledStudent,
		};
		return result;
	}

	async function testSectionQuestions(params) {
		var result = [];
		var qusArr = params.question;
		var counter = 1;
		let allTopicsData = await getTopicDataAll();
		var questionDataAll = await getQuestionDataAAll();
		for (var qusData of qusArr) {
			qusData.questionNumber = counter;
			var ansStatus = "Un-attempted";
			if (qusData.answerStatus == "C") {
				ansStatus = "Correct";
			} else if (qusData.answerStatus == "W") {
				ansStatus = "Incorrect";
			}
			qusData.answer_status = ansStatus;
			qusData.topicName = "";

			if (qusData.topicId) {
				var topicData = allTopicsData.find(
					(topic) => topic.Id == qusData.topicId
				);
				qusData.topicName = topicData.topicName;
			}
			qusData.user_answer = "NA";
			var user_answer = parseInt(qusData.usersAnswer) + 1;
			if (parseInt(user_answer) > 0) {
				qusData.user_answer = user_answer;
			}
			qusData.correctoption = qusData.question = qusData.questionoption = "";
			if (qusData.questionId) {
				var questionData = questionDataAll.find(
					(qus) => qus.questionId == qusData.questionId
				);
				console.log(" -------------- questionData == ", questionData);
				if (questionData) {
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

	async function testChapterReport(params, chapterData) {
		var chapResult = {};
		var chpresult = [];
		var chpIdArr = [];
		var chpQusArr = params.question;
		var chpQuestions = [];
		var chapterDataAll = chapterData;
		for (var qusChp of chpQusArr) {
			if (qusChp.chapterChapterId) {
				var chapterData = chapterDataAll.find(
					(chp) => chp.chapterId == qusChp.chapterChapterId
				);
				qusChp.chapterName = chapterData.chapterName;
			}
			chpIdArr.push(qusChp.chapterChapterId);
			chpQuestions.push(qusChp);
		}

		const chpIds = [...new Set(chpIdArr)];
		var chapResult = [];
		var chpIndex = 0;
		for (chapterId of chpIds) {
			var chpObj = {};
			var totalQus = 0;
			var rigthQues = 0;
			var chapterName = "";
			//chapResult[chapterId] = [];

			for (var qusChpData of chpQuestions) {
				if (chapterId == qusChpData.chapterChapterId) {
					totalQus++;
					if (qusChpData.answerStatus == "C") {
						rigthQues++;
					}
					chapterName = qusChpData.chapterName;
				}
			}

			var scale = (rigthQues * 100) / totalQus;
			scale = scale.toFixed(2);
			scale = scale / 10;
			var remarks = await getRemarksForScale(scale);
			chpObj = {
				chapterName: chapterName,
				totalQuestions: totalQus,
				rightQuestions: rigthQues,
				scale: scale,
				remarks: remarks,
			};
			//chapResult[chapterId].push(chpObj);
			chapResult.push(chpObj);
		}
		return chapResult;
	}

	async function getUserTestRank(params) {
		const { sequelize } = db;
		let rankQuery =
			"SELECT GROUP_CONCAT(score ORDER BY score DESC) FROM student_result ";
		rankQuery += " WHERE testId = '" + params.testId + "'";
		rankQuery +=" AND packageId = '"+ params.packageId +"'";

		let aqlQuery =
			"SELECT userId, score as score, FIND_IN_SET( score, (" +
			rankQuery +
			")) AS rank FROM student_result ";
		aqlQuery +=
			" WHERE testId = '" +
			params.testId +
			"' AND userId = '" +
			params.userId +
			"'";
		aqlQuery += " AND packageId = '" + params.packageId + "'";
		//aqlQuery +=' ORDER BY netScore ASC';

		console.log("aqlQuery  ------- ", aqlQuery);

		let result = await sequelize.query(aqlQuery, {
			type: sequelize.QueryTypes.SELECT,
		});
		console.log("getUserRank JSON_EXTRACT ------- ", result);
		console.log("JSON_EXTRACT END ------------------------------- ");
		let resultSet = [];
		if (typeof result != "undefined") {
			resultSet = result[0];
		}
		return resultSet;
	}

	async function getTestSectionRank(params, sec = 1) {
		const { sequelize } = db;
		let section_name = "section" + sec + "_score";

		let rankQuery =
			"SELECT GROUP_CONCAT(" +
			section_name +
			" ORDER BY " +
			section_name +
			" DESC) FROM student_result ";
		rankQuery += " WHERE testId = '" + params.testId + "'";
		rankQuery +=" AND packageId = '"+ params.packageId +"'";

		let aqlQuery =
			"SELECT userId, " +
			section_name +
			" as score, FIND_IN_SET( " +
			section_name +
			", (" +
			rankQuery +
			")) AS rank FROM student_result ";
		aqlQuery += " WHERE testId = '" + params.testId + "'";
		aqlQuery += " AND userId = '" + params.userId + "'";
		aqlQuery +=" AND packageId = '" + params.packageId +"'" ;

		//aqlQuery +=' ORDER BY netScore ASC';

		console.log("aqlQuery  ------- ", aqlQuery);

		let result = await sequelize.query(aqlQuery, {
			type: sequelize.QueryTypes.SELECT,
		});
		console.log("getUserRank JSON_EXTRACT ------- ", result);
		console.log("JSON_EXTRACT END ------------------------------- ");
		let resultSet = [];
		if (typeof result != "undefined") {
			resultSet = result[0];
		}
		return resultSet;
	}

	async function getTopicDataAll() {
		return await topic.findAll({ attributes: ["Id", "topicName"] });
	}

	async function getQuestionDataAAll() {
		return await questions.findAll({
			attributes: ["questionId", "correctoption"],
		}); //, "question","questionoption"
	}

	async function getChapterDataAll() {
		return await chapters.findAll({ attributes: ["chapterName", "chapterId"] });
	}

	async function getRemarksForScale(scale) {
		let x = Math.round(scale);
		var remarksMsg = [
			"Require Conceptual Clarity",
			"Require more practice",
			"Good to go",
		];
		var index = 0;
		if (x <= 4) {
			index = 0;
		} else if (x > 4 && x <= 6) {
			index = 1;
		} else if (x > 6) {
			index = 2;
		}
		return remarksMsg[index];
	}

	async function getQans(testId) {
		console.log(testId);
		let aqlQuery = "SELECT * FROM Test ";
		aqlQuery += " WHERE Test_Id = '" + testId + "'";

		let Qans = await sequelize.query(aqlQuery, {
			type: sequelize.QueryTypes.SELECT,
		});

		return Qans;
	}

	async function topperInfo(req) {
		let params = req.body;

		var chapterDataAll = await getChapterDataAll();

		params.chapterData = chapterDataAll;

		let wahereClouse = {};
		//let selectColumns = ["userId", "testId", "packageId","JSON_EXTRACT(testResult, '$.netScore') as score"];
		let selectColumns = [
			"userId",
			"testId",
			"packageId",
			"JSON_EXTRACT(testResult, '$.netScore') as score",
		];
		wahereClouse = {
			where: {
				userId: params.userId,
				testId: params.testId,
			},
		};

		testAttempted
			.findOne(wahereClouse)
			.then(async (s) => {
				s.testResult.attempt_id = s.attempt_id;
				var scoreData = await getUserTestPercentile(params);
				s.testResult.test_score = scoreData.test_score;
				s.testResult.rank = scoreData.rank;
				s.testResult.percentile = scoreData.percentile.toFixed(2);
				let sectionArr = s.testResult.section;
				var secNum = 1;
				var secIndex = 0;
				for (var secData of sectionArr) {
					secNum = parseInt(secIndex) + 1;
					var secScore = await getTestSectionPercentile(params, secNum);
					secData.rank = secScore.rank;
					secData.percentile = secScore.percentile.toFixed(2);
					secData.sectionNum = secScore.sectionNum;
					// var questiondata = await testSectionQuestions(secData);
					var chapterdata = await testChapterReport(secData, chapterDataAll);
					secData.chapterReport = chapterdata;
					s.testResult.section[secIndex] = secData;
					var accuracy = (secData.correctAnswers * 100) / secData.answered;
					s.testResult.section[secIndex]["overallPerformanceSummary"] = {
						rank: secScore.rank,
						score: secData.score,
						attempted: secData.answered,
						accuracy: accuracy,
						percentile: secScore.percentile.toFixed(2),
					};

					var marks = {
						startnumber: secData.totalQuestions * secData.negativeMarks,
						endnumber: secData.positiveMarks * secData.totalQuestions,
					};
					s.testResult.section[secIndex]["marksDistributtion"] = {
						numberofstudent: totalcount,
						marks: marks,
						youarehere: secData.score,
						average: "",
					};

					s.testResult.section[secIndex]["questionDistributtion"] = {};
					s.testResult.section[secIndex]["questionList"] = {};
					s.testResult.section[secIndex]["comparewithtopper"] = {};

					secIndex++;
				}
				//console.log("sec Score == ", secScore);
				result = s.testResult;

				return result;
			})
			.catch((err) => {
				console.log(" analysis erre : ", err);
				return err;
			});
	}

	app.post("/overallPerformanceSummary/", cors(), async function (req, res) {
		req.db = db;
		if (typeof req.body != "undefined") {
			let params = req.body;
			var chapterDataAll = await getChapterDataAll();

			params.chapterData = chapterDataAll;

			if (typeof params.userId != "undefined") {
				const startedDate = new Date(req.body.startDate + " 00:00:00");
				const endDate = new Date(req.body.endDate + " 00:00:00");

				let wahereClouse = {};
				//let selectColumns = ["userId", "testId", "packageId","JSON_EXTRACT(testResult, '$.netScore') as score"];
				let selectColumns = [
					"userId",
					"testId",
					"packageId",
					"JSON_EXTRACT(testResult, '$.netScore') as score",
				];
				wahereClouse = {
					where: {
						userId: params.userId,
						testId: params.testId,
						packageId: params.packageId,
					},
				};

				let aqlQuery = "SELECT * FROM student_result ";
				aqlQuery +=
					" WHERE testId = '" +
					params.testId +
					"' AND packageId = '" +
					params.packageId +
					"' order by score desc ;";

				let resultTopper = await sequelize.query(aqlQuery, {
					type: sequelize.QueryTypes.SELECT,
				});

				var toppeobject = resultTopper[0];

				var totalcount = await testAttempted.count({
					where: { testId: params.testId, packageId: params.packageId },
				});

				var Qans = await getQans(params.testId);

				let aqlQueryLB =
					" SELECT td.* , user.username FROM `test_attempted`AS td LEFT JOIN users as user on user.email_Id = userId WHERE td.testId =";
				//let aqlQueryLB = 'SELECT userId, JSON_EXTRACT(testResult, "$.netScore") as score, FIND_IN_SET( JSON_EXTRACT(testResult, "$.netScore"), ( SELECT GROUP_CONCAT( JSON_EXTRACT(testResult, "$.netScore") ORDER BY JSON_EXTRACT(testResult, "$.netScore") DESC ) FROM test_attempted WHERE testId = "' + params.testId + '" AND packageId = "' + params.packageId + '")) AS rank FROM `test_attempted` ';
				aqlQueryLB +=
					"'" + params.testId + "' AND packageId = '" + params.packageId + "'";
				console.log("aqlQueryLB  ------- ", aqlQueryLB);

				let leaderboardresult = await sequelize.query(aqlQueryLB, {
					type: sequelize.QueryTypes.SELECT,
				});

				testAttempted
					.findOne(wahereClouse)
					.then(async (s) => {
						s.testResult.attempt_id = s.attempt_id;
						params.totalcount = totalcount
						var scoreData = await getUserTestPercentile(params);
						s.testResult.test_score = scoreData.test_score;
						s.testResult.rank = scoreData.rank;
						s.testResult.percentile = scoreData.percentile.toFixed(2);
						let sectionArr = s.testResult.section;
						var secNum = 1;
						var secIndex = 0;
						for (var secData of sectionArr) {
							secNum = parseInt(secIndex) + 1;
							var secScore = await getTestSectionPercentile(params, secNum);
							secData.rank = secScore.rank;
							secData.percentile = secScore.percentile.toFixed(2);
							secData.sectionNum = secScore.sectionNum;
							// var questiondata = await testSectionQuestions(secData);
							var chapterdata = await testChapterReport(
								secData,
								chapterDataAll
							);
							secData.chapterReport = chapterdata;
							s.testResult.section[secIndex] = secData;
							var accuracy = (secData.correctAnswers * 100) / secData.answered;
							s.testResult.section[secIndex]["overallPerformanceSummary"] = {
								rank: secScore.rank,
								score: secData.score,
								attempted: secData.answered,
								accuracy: accuracy,
								percentile: secScore.percentile.toFixed(2),
							};

							var marks = {
								startnumber: secData.totalQuestions * secData.negativeMarks,
								endnumber: secData.positiveMarks * secData.totalQuestions,
							};
							s.testResult.section[secIndex]["marksDistributtion"] = {
								numberofstudent: totalcount,
								marks: marks,
								youarehere: secData.score,
								average: "",
							};

							s.testResult.section[secIndex]["questionDistributtion"] = {};
							s.testResult.section[secIndex]["questionList"] = {};
							s.testResult.section[secIndex]["comparewithtopper"] = {};

							secIndex++;
						}
						//console.log("sec Score == ", secScore);
						result = s.testResult;

						result["topperObject"] = toppeobject;
						result["AllStudent"] = resultTopper;

						Qans[0].Section = JSON.parse(Qans[0].Section);
						result["Qans"] = Qans[0];

						var leaderBoardList = [];
						for (var lead of leaderboardresult) {
							leaderBoardList.push({
								netScore: JSON.parse(lead.testResult).netScore,
								name: lead.username,
								userId: lead.userId,
							});
						}

						leaderBoardList.sort(function (a, b) {
							return parseFloat(a.netScore) - parseFloat(b.netScore);
						});

						result["leaderBoardList"] = leaderBoardList;

						res.send({ status: 200, data: result });
					})
					.catch((err) => {
						console.log(" analysis erre : ", err);
						res.status(402).send(err);
					});
			} else {
				res.send({ status: 502, message: "User Id Not Found" });
			}
		} else {
			res.send({ status: 502, message: "Request Body Null" });
		}
	});

	app.post("/getwritePercentage/", cors(), async (req, res) => {
		console.log("file: getwritePercentage", req.body);
		let params = req.body;
		req.db = db;

		let aqlQueryLB =
			" SELECT td.* , user.username FROM `test_attempted`AS td LEFT JOIN users as user on user.email_Id = userId WHERE td.testId =";
		//let aqlQueryLB = 'SELECT userId, JSON_EXTRACT(testResult, "$.netScore") as score, FIND_IN_SET( JSON_EXTRACT(testResult, "$.netScore"), ( SELECT GROUP_CONCAT( JSON_EXTRACT(testResult, "$.netScore") ORDER BY JSON_EXTRACT(testResult, "$.netScore") DESC ) FROM test_attempted WHERE testId = "' + params.testId + '" AND packageId = "' + params.packageId + '")) AS rank FROM `test_attempted` ';
		aqlQueryLB += "'" + params.testId + "' AND packageId = '" + params.packageId + "'";

		let leaderboardresult = await sequelize.query(aqlQueryLB, {
			type: sequelize.QueryTypes.SELECT,
		});

		let sectionArr = JSON.parse(leaderboardresult[0].testResult).section;
		var sectionIndex = 0;


		var questionDifficulty = false

		if(leaderboardresult.length >100){
			questionDifficulty = true;
		}

		Test.findAll({
			where: {
				Test_Id: params.testId,
				//PackagePrice:'0'
			}
		}).then((s, err) => {
			let arr = []
			if (s) {

				for (var secData of sectionArr) {
					var questionIndex = 0;
					for (var question of secData.question) {
						var writePercentage = 0;
						for (var leaderBoard of leaderboardresult) {
							for (var allquestion of JSON.parse(leaderBoard.testResult).section[sectionIndex].question) {
								if (allquestion.answerStatus == "C" && question.questionId == allquestion.questionId) {
									writePercentage++;
								}
							}
						}

						var picked = s[0].Section[sectionIndex].QuestionList.find(o => o.questionId === question.questionId);
						sectionArr[sectionIndex]["question"][questionIndex]["questionLevel"] = picked.questionLevel

						if (writePercentage == 0) {
							sectionArr[sectionIndex]["question"][questionIndex]["writePercentage"] = 0;
						} else {
							sectionArr[sectionIndex]["question"][questionIndex]["writePercentage"] = writePercentage / leaderboardresult.length;
							if(sectionArr[sectionIndex]["question"][questionIndex]["writePercentage"]*100 >70){
								sectionArr[sectionIndex]["question"][questionIndex]["questionLevel"] ="Easy"
							}else if(sectionArr[sectionIndex]["question"][questionIndex]["writePercentage"]*100>40 && sectionArr[sectionIndex]["question"][questionIndex]["writePercentage"]*100 <= 70){
								sectionArr[sectionIndex]["question"][questionIndex]["questionLevel"] ="Medium"
							}else{
								sectionArr[sectionIndex]["question"][questionIndex]["questionLevel"] ="Hard"
							}

						}
						questionIndex++;
					}

					sectionIndex++;
				}
				res.send({status: 200, data: sectionArr});
			}
		})
	});

	app.post("/addbookmark", (req, res) => {
		console.log("file: addbookmark", req.body, req.body.userEmailId);
	});
};
