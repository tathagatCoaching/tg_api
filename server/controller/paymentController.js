const Razorpay = require("razorpay");
const crypto = require("crypto");

const instance = new Razorpay({
	key_id: "rzp_live_MGkjM1JRNckkm3",
	key_secret: "qd8eQz7QLLsj2tbVYU43OZlk",
});

exports.create = (req, res) => {
	const { amount, currency, receipt } = req.body;
	instance.orders.create(
		{
			amount: parseInt(amount) * 100,
			currency,
			receipt,
		},
		(err, order) => {
			if (err) {
				res.status(500).json({
					message: "Error in creating order",
					error: err,
				});
			} else {
				res.status(200).json({
					message: "Order created successfully",
					order,
				});
			}
		}
	);
};

exports.verify = (req, res) => {
	let body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;

	const expectedSignature = crypto
		.createHmac("sha256", "qd8eQz7QLLsj2tbVYU43OZlk")
		.update(body.toString())
		.digest("hex");
	console.log("Signature received:", req.body.razorpay_signature);
	console.log("Signature generated:", expectedSignature);
	let response = { signatureIsValid: false };
	if (expectedSignature === req.body.razorpay_signature)
		response = { signatureIsValid: true };
	res.send(response);
};
