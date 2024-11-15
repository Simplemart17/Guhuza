const prisma = require("../model/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendMail");

const User = {
  async login(req, res) {
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
  
    // track login time
    await prisma.user.update({
      where: { email: req.body.email },
      data: { updatedAt: new Date() },
    });
  
    const token = jwt.sign({ email: req.body.email, id: user.id }, "$ecr3token"); //TODO: store in the env file
  
    res.json({
      status: 200,
      message: "Login successful!",
      token,
    });
  },

  async register(req, res) {
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
  },

  async profile(req, res) {
    const userProfile = await prisma.user.findUnique({
      where: {
        email: req.user.email,
      },
      include: {
        invite: true,
        leaderboard: true,
        point: true,
      },
    });
  
    res.json(userProfile);
  },
  async leaderboard(req, res) {
    try {
      // Get all points for the user
      const points = await prisma.point.findMany({
        where: {
          userId: req.user.id,
        },
      });
  
      // Sum up the points
      const totalPoints = points.reduce((sum, point) => sum + point.point, 0);
  
      // Update or create the leaderboard entry for the user
      await prisma.leaderboard.upsert({
        where: { userId: req.user.id },
        update: { total_point: totalPoints },
        create: {
          userId: req.user.id,
          total_point: totalPoints,
        },
      });
  
      // Fetch all leaderboard entries
      const leaderboard = await prisma.leaderboard.findMany({
        include: {
          user: {
            select: {
              id: true,
              email: true,
              fullname: true,
              level: true,
            },
          },
        },
        orderBy: {
          total_point: "asc",
        },
      });
  
      res.json({
        status: 200,
        message: "Leaderboard updated successfully!",
        leaderboard,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update leaderboard" });
    }
  },

  async inviteUser(req, res) {
    const invitedEmail = req.body.email;
    const userId = req.query.userId;
  
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
  
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
  
    // Check if the email exists
    const inviteEmail = await prisma.invite.findUnique({
      where: { email: invitedEmail },
    });
  
    if (inviteEmail) {
      return res.status(400).json({ message: "User already invited!" });
    }
  
    // create invite token
    const inviteToken = crypto.randomBytes(32).toString("hex");
  
    // Create an invite
    const invite = await prisma.invite.create({
      data: {
        email: invitedEmail,
        userId,
        inviteToken,
        updatedAt: new Date(),
      },
    });
  
    const mailOptions = {
      from: "doctorfunmi@gmail.com",
      to: email,
      subject: "You're Invited!",
      text: `Hello,\n\nYou have been invited by ${user.fullname} to join our platform. Please click the link below to register:\n\nhttp://localhost:3000/accept-invite?token=${inviteToken}\n\nBest regards,\nYour App Team`,
    };
  
    sendEmail(mailOptions);
  
    res.json({
      status: 201,
      message: "Invite sent successfully!",
      invite,
    });
  },

  async acceptInvite(req, res) {
    const { token } = req.query;
    const { email, password, fullname } = req.body;
  
    // Find the invite
    const invite = await prisma.invite.findUnique({
      where: { token },
    });
  
    if (!invite) {
      return res.status(404).json({ message: "Invite not found" });
    }
  
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
  
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists, proceed to login" });
    }
  
    // Create a new user
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashPassword,
        fullname,
        updatedAt: new Date(),
      },
    });
  
    // Delete the invite after accepting it
    await prisma.invite.delete({
      where: { email },
    });
  
    res.json({
      status: 201,
      message: "User registered successfully!",
      user: {
        id: newUser.id,
        email: newUser.email,
        fullname: newUser.fullname,
      },
    });
  },

  //TODO: create api to send message to user that has not logged in for a while.
  // Stating who is leading on the leaderboard in his/her circle and encourage to get back to the top of the leaderboard
}

module.exports = User;