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

    const token = jwt.sign(
      { email: req.body.email, id: user.id },
      process.env.JWT_SECRET
    );

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
      // Fetch all leaderboard entries
      const leaderboard = await prisma.leaderboard.findMany({
        include: {
          user: {
            select: {
              id: true,
              email: true,
              fullname: true,
              level: true,
              // Include invited users
              invite: {
                where: { status: true },
                select: {
                  email: true,
                },
              },
            },
          },
        },
        orderBy: {
          total_point: "desc",
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
    const { email } = req.body;

    // Get user details
    const user = await prisma.user.findUnique({
      where: { email: req.user.email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the email exists
    const inviteEmail = await prisma.invite.findUnique({
      where: { email },
    });

    if (inviteEmail) {
      return res.status(400).json({ message: "User already invited!" });
    }

    // create invite token
    const inviteToken = crypto.randomBytes(32).toString("hex");

    // Create an invite
    const invite = await prisma.invite.create({
      data: {
        email,
        userId: req.user.id,
        inviteToken,
        updatedAT: new Date(),
      },
    });

    const mailOptions = {
      subject: "You're Invited!",
      text: `Hello,\n\nYou have been invited by ${user.fullname} to join our platform. Please click the link below to register:\n\n${process.env.UI_URL}/accept.html?userId=${user.id}&token=${inviteToken}\n\nBest regards,\nYour App Team`,
    };

    sendEmail(mailOptions.subject, mailOptions.text, email);

    res.json({
      status: 201,
      message: "Invite sent successfully!",
      invite,
    });
  },

  async acceptInvite(req, res) {
    const { userId, token } = req.query;

    const { email, password, fullname } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) {
      return res.status(404).json({ message: "Referral link not working" });
    }

    if (!email || !fullname || !password) {
      res
        .status(404)
        .json({ message: "Email, fullname or password field cannot be empty" });
    }

    // Create a new user
    const hashPassword = await bcrypt.hash(password, 10);

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists, proceed to login" });
    }

    // Verify invite with a token
    if (token) {
      const invite = await prisma.invite.findUnique({
        where: { inviteToken: token },
      });

      if (!invite || invite.status) {
        return res.status(404).json({ message: "Referral link is invalid" });
      }

      //TODO: Use transactions to perform this operation
      // Register new user
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashPassword,
          fullname,
          updatedAt: new Date(),
        },
      });

      // add point for successful invitation
      if (newUser) {
        await prisma.point.create({
          data: {
            point: 3,
            userId: user.id,
          },
        });

        await prisma.invite.update({
          where: { inviteToken: token },
          data: { status: true },
        });
      }

      return res.json({
        status: 201,
        message: "User registered successfully!",
        user: {
          id: newUser.id,
          email: newUser.email,
          fullname: newUser.fullname,
        },
      });
    } else {
      // Register new user
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashPassword,
          fullname,
          updatedAt: new Date(),
        },
      });

      // add point for successful invitation
      if (newUser) {
        await prisma.point.create({
          data: {
            point: 3,
            userId: user.id,
          },
        });
      }

      // Store email of the friend
      await prisma.invite.create({
        data: {
          email,
          userId: user.id,
          status: true,
          inviteToken: crypto.randomBytes(32).toString("hex"),
          updatedAT: new Date(),
        },
      });

      return res.json({
        status: 201,
        message: "User registered successfully!",
        user: {
          id: newUser.id,
          email: newUser.email,
          fullname: newUser.fullname,
        },
      });
    }
  },

  //TODO: create api to send message to user that has not logged in for a while.
  // Stating who is leading on the leaderboard in his/her circle and encourage to get back to the top of the leaderboard
};

module.exports = User;
