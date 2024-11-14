require("dotenv").config();
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

const prisma = new PrismaClient();

app.use(express.json());

async function verifyToken(req, res, next) {
  const token = req.headers.token;
  if (!token) {
    return res.status(403).json({ error: "Token is not provided" });
  }
  try {
    const decoded = await jwt.verify(token, "$ecr3token");
    const user = await prisma.user.findUnique({
      where: {
        email: decoded.email,
      },
    });
    if (!user) {
      return res
        .status(403)
        .json({ error: "The token you provided is invalid" });
    }
    req.user = decoded;
  } catch (error) {
    return res.status(403).json({ error: "Authentication fails!" });
  }
  return next();
}

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.post("/auth/login", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });

  if (!user) {
    return res.status(401).json({
      status: 401,
      message: "Invalid email or password",
    });
  }

  // check password
  const password = await bcrypt.compare(req.body.password, user.password);

  if (!password) {
    return res.status(401).json({
      status: 401,
      message: "Invalid password or email",
    });
  }

  const token = jwt.sign({ email: req.body.email }, "$ecr3token");

  res.json({
    status: 200,
    message: "Login successful!",
    token,
  });
});

app.post("/register", async (req, res) => {
  const hashPassword = bcrypt.hashSync(req.body.password, 10);
  const userObj = await prisma.user.create({
    data: {
      email: req.body.email,
      password: hashPassword,
      fullname: req.body.fullname,
      updatedAt: new Date(),
    },
  });

  delete userObj.password;
  res.json({
    status: 201,
    message: "Registration successful!",
    ...userObj,
  });
});

app.get("/quiz", async (req, res) => {
  const level = 1;
  // const level = req.query.level;
  try {
    const response = await fetch(
      `https://api-ghz-v2.azurewebsites.net/api/v2/quiz?level=${level}`
    );
    const data = await response.json();
    res.json(data.test.question);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.get("/profile", async (req, res) => {
  const userProfile = prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });

  console.log(userProfile);
  res.send("Hello, World!");
});

app.get("/invite", async (req, res) => {
  res.send("Hello, World!");
});

app.get("/accept-invite", (req, res) => {
  res.send("Hello, World!");
});

app.get("/leaderboard", async (req, res) => {
  res.send("Hello, World!");
});

app.get("/logout", (req, res) => {
  res.send("Hello, World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
