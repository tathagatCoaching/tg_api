const { resolve } = require("sequelize-cli/lib/helpers/path-helper");

module.exports = {
	getCourses: function (req) {
		return new Promise(async (resolve) => {
			const { courses } = req.db;
			await courses
				.findOne({ where: { courseId: req.params.courseCourseId } })
				.then(async (s) => {
					console.log(s);
					if (s) {
						resolve(s);
					} else {
						resolve({});
					}
				});
		});
	},

	getPackageTest: function (req) {
		return new Promise(async (resolve) => {
			const { sequelize } = req.db;
			let aqlQuery =
				"SELECT packageId, JSON_EXTRACT(TestList, '$[*].TestId') AS testIds FROM packages ";
			aqlQuery += " WHERE packageId = '" + packageId + "'";
			let result = await sequelize.query(aqlQuery, {
				type: sequelize.QueryTypes.SELECT,
			});
			//console.log("JSON_EXTRACT myyyyy ------- ", result);
			//console.log("JSON_EXTRACT END ------------------------------- ");
			let resultSet = [];
			if (typeof result != "undefined") {
				if (typeof result[0].testIds != "undefined") {
					resultSet = result[0].testIds;
				}
			}
			resolve(resultSet);
		});
	},

	getPackageUserID: function (req) {
		return new Promise(async (resolve) => {
			const { userPackages } = req.db;
			userPackages
				.findAll({
					where: {
						userEmailId: req.params.userId,
						status: 1,
						packagePackageId: req.params.PackageId,
					},
					order: [["updated_at", "DESC"]],
				})
				.then(async (userpackages) => {
					//console.log("userpackages --", userpackages[0]);
					if (!userpackages) {
						resolve(null);
					} else {
						resolve(userpackages);
					}
				});
		});
	},

	getPackageInfo: function (req) {
		return new Promise(async (resolve) => {
			const { packages } = req.db;
			packages
				.findOne({ where: { packageId: req.params.packageId } })
				.then((s) => {
					if (!s) {
						resolve(null);
					} else {
						resolve(s);
					}
				});
		});
	},

	getQueInfo: function (req) {
		return new Promise(async (resolve) => {
			const { questions } = req.db;
			questions
				.findOne({ where: { questionId: req.params.questionId } })
				.then((s) => {
					if (!s) {
						resolve(null);
					} else {
						resolve(s);
					}
				});
		});
	},

	getBookmarkQue: function (req) {
		return new Promise(async (resolve) => {
			const { userQuestionsBookmark } = req.db;
			console.log({
				testId: req.body.testId,
				userEmailId: req.body.userEmailId,
			});
			userQuestionsBookmark
				.findAll({
					where: {
						testId: req.body.testId,
						userEmailId: req.body.userEmailId,
						status: 1,
					},
				})
				.then(async (s) => {
					console.log(s);
					if (s) {
						resolve(s);
					} else {
						resolve({});
					}
				});
		});
	},

	profileUpdate: function (req) {
		return new Promise(async (resolve) => {
			const { users } = req.db;
			console.log(typeof req.body, req.params.userEmailId);
			users
				.update(req.body, { where: { email_Id: req.params.userEmailId } })
				.then((s) => {
					console.log(s);
					if (s) {
						resolve({
							user: {
								email_Id: req.params.userEmailId,
								...req.body,
							},
						});
					} else {
						resolve(null);
					}
				});
		});
	},

	getProfile: function (req) {
		return new Promise(async (resolve) => {
			const { users } = req.db;
			users
				.findOne({ where: { email_Id: req.params.userEmailId } })
				.then((s) => {
					if (!s) {
						resolve(null);
					} else {
						resolve(s);
					}
				})
				.catch((err) => {
					console.log(err);
				});
		});
	},
};
