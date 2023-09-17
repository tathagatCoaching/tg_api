const paymentController = require("../../controller/paymentController");

module.exports = (app, db) => {
	app.post("/create-payment", paymentController.create);
	app.post("/verify-payment", paymentController.verify);
};
