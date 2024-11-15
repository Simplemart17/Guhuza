const express = require("express");
const quizController = require("../controllers/quiz.controller");
const verifyToken = require("../middleware/verifyToken");

const quizRouter = express.Router();

quizRouter.get("/quiz", quizController.quiz);
quizRouter.patch("/updateQuestion", verifyToken, quizController.updateQuestion);
quizRouter.patch("/updateLevel", verifyToken, quizController.updateLevel);

module.exports = quizRouter;