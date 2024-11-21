const prisma = require("../model/index");

const Quiz = {
  async quiz(req, res) {
    const level = req.query.level;
    try {
      const response = await fetch(
        `https://api-ghz-v2.azurewebsites.net/api/v2/quiz?level=${level}`
      );
      const data = await response.json();
      res.json(data.test.question);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch data" });
    }
  },

  async updateQuestion(req, res) {
    await prisma.user.update({
      where: { email: req.user.email },
      data: { last_question_answered: req.body.question },
    });

    if (req.body.point) {
      await prisma.point.create({
        data: {
          point: req.body.point,
          userId: req.user.id,
        },
      });
    }

    // Get all points for the user
    const points = await prisma.point.findMany({
      where: {
        userId: req.user.id,
      },
    });

    // Sum up the points
    const totalPoints = points.reduce((sum, point) => sum + point.point, 0); //TODO: Make it work

    // Update or create the leaderboard entry for the user
    await prisma.leaderboard.upsert({
      where: { userId: req.user.id },
      update: { total_point: totalPoints },
      create: {
        userId: req.user.id,
        total_point: totalPoints,
      },
    });

    res.json({ message: "updated!" });
  },

  async updateLevel(req, res) {
    await prisma.user.update({
      where: { email: req.user.email },
      data: { level: req.body.level },
    });

    res.json({ message: "updated!" });
  },
};

module.exports = Quiz;
