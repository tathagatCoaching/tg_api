const express = require("express");

const { protect, authorize } = require("../../middleware/auth");
const {
	getQueInfo,
	getPackageInfo,
	getBookmarkQue,
	profileUpdate,
	getProfile,
} = require("../../helper/helper");
const cors = require("cors");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

module.exports = (app, db) => {
	const { userQuestionsBookmark,sequelize, question, topic, chapter, users } = db;
	app.get("/userbookmarklist/:userEmailId", cors(), async function (req, res) {
		req.db = db;


		let aqlQueryLB = "SELECT uqb.*,co.courseId,co.courseName as co_courseName,sub.subjectName as sub_subjectName,topi.topicName as top_topicName FROM `user_questions_bookmark` as uqb " ;
			aqlQueryLB += "LEFT JOIN courses as co on co.courseId = uqb.courseName " ;
			aqlQueryLB +="LEFT JOIN subjects as sub on sub.subjectId = uqb.subjectName " ;
			aqlQueryLB += "LEFT JOIN topics as topi on topi.topicId = uqb.topicName "
		aqlQueryLB +=
			"WHERE uqb.status= 1 AND uqb.userEmailId = '" + req.params.userEmailId + "'";

		console.log("aqlQueryLB  ------- ", aqlQueryLB);

		let s = await sequelize.query(aqlQueryLB, {
			type: sequelize.QueryTypes.SELECT,
		});

		console.log(s)

		if (s) {
			var index = 0;
			var bookmarkList = [];
			for (var que of s) {
				req.params.questionId = que.questionsId;
				req.params.testId = que.testId;
				var info = await getQueInfo(req);
				console.log("info", info);
				if (info != null) {
					bookmarkList.push({questions_info: info, other_info: s[index]});
				}
				index++;
			}

			console.log("bookmarkList", bookmarkList);
			res.status(200).send({status: 200, data: bookmarkList});
		} else {
			console.log(err);
			res.status(200).send({status: 400, eroor: err});
		}

	});

	app.post("/addbookmark", (req, res) => {
		console.log("file: addbookmark", req.body, req.body.userEmailId);
		userQuestionsBookmark
			.findOne({
				where: {
					testId: req.body.testId,
					userEmailId: req.body.userEmailId,
					questionsId: req.body.questionsId,
				},
			})
			.then((exist) => {
				console.log("exist", exist);
				if (!exist) {
					userQuestionsBookmark
						.create({
							testId: req.body.testId,
							userEmailId: req.body.userEmailId,
							questionsId: req.body.questionsId,
							status: req.body.status,
							courseName:req.body.courseName,
							subjectName:req.body.subjectName,
							topicName:req.body.topicName
						})
						.then((s) => {
							if (s) {
								res.status(200).send({ status: 200, message: "done" });
							}
						});
				} else {
					userQuestionsBookmark
						.update(
							{
								testId: req.body.testId,
								userEmailId: req.body.userEmailId,
								questionsId: req.body.questionsId,
								status: req.body.status,
								courseName:req.body.courseName,
								subjectName:req.body.subjectName,
								topicName:req.body.topicName
							},
							{
								where: {
									testId: req.body.testId,
									userEmailId: req.body.userEmailId,
									questionsId: req.body.questionsId,
								},
							}
						)
						.then((bookmark) => {
							res.status(200).send({ status: 200, message: "Update Done" });
						});
				}
			});
	});

	app.post("/profile_update/:userEmailId", upload.single("img"), /* name attribute of <file> element in your form */ async (req, res) => {
			req.db = db;
			if (req.file) {
				const tempPath = req.file.path;
				req.body.profile = tempPath;
				console.log(tempPath);
			}
			var userProfile = await profileUpdate(req);
			if (userProfile) {
				res.status(200).send({ status: 200, data: userProfile });
			} else {
				res.status(200).send({ status: 400, eroor: "Error while updating profile" });
			}
		}
	);

	app.get("/profile/:userEmailId", cors(), async (req, res) => {
		req.db = db;
		const user = await getProfile(req);
		if (user) {
			res.status(200).send({ status: 200, data: user });
		} else {
			res.status(200).send({ status: 404, eroor: "User not found!" });
		}
	});
};
