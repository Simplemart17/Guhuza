require("dotenv").config();
const express = require("express");
const cors = require("cors");

const userRouter = require("./routes/user.route");
const quizRouter = require("./routes/quiz.route");

const app = express();
const port = process.env.PORT || 3000;

//TODO: improve app validations and security

app.use(cors());
app.use(express.json());
app.set("appVersion", "/api/v1");

app.use(app.get("appVersion"), userRouter);
app.use(app.get("appVersion"), quizRouter);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello, World!" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
