const express = require("express");
const user = require("../controllers/user.controller");
const verifyToken = require("../middleware/verifyToken");

const userRouter = express.Router();

userRouter.post("/auth/login", user.login);
userRouter.post("/auth/register", user.register);

userRouter.get("/profile", verifyToken, user.profile);
userRouter.get("/leaderboard", verifyToken, user.leaderboard);
userRouter.post("/invite", user.inviteUser);
userRouter.post("/accept-invite", user.acceptInvite);


module.exports = userRouter;