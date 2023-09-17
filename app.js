const express = require("express");
const app = express();
var db = require("./server/config/db");
const morgan = require("morgan");
const bodyparser = require("body-parser");
const cookieparser = require("cookie-parser");
var router = express.Router();
router = require("./server/routes/index");
const cors = require("cors");
require("dotenv").config();

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

//midlewares
app.use(morgan("dev"));
app.use(bodyparser.json({ limit: "50mb" }));
app.use(
	bodyparser.urlencoded({
		limit: "50mb",
		extended: true,
		parameterLimit: 50000,
	})
);
app.use(cookieparser());
app.use(cors());

// DB Connection
router.topicrouter(app, db);
router.chapterrouter(app, db);
router.packagerouter(app, db);
router.testorouter(app, db);
router.testrouter(app, db);
router.questionrouter(app, db);
router.notesrouter(app, db);
router.courserouter(app, db);
router.subjectrouter(app, db);
router.authrouter(app, db);
router.blogsroute(app, db);
router.userquestionsbookmark(app, db);
router.paymentrouter(app, db);
router.analysisrouter(app, db);

app.use("/uploads", express.static("uploads"));

// server
const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

app.use((error, req, res, next) => {
	console.log("app use error: ", error);
	res.status(error.status || 500).send({
		error: {
			status: error.status || 500,
			message: error.message || "Internal Server Error",
		},
	});
});
