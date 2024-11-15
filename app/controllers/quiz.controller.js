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
  
    res.json({ message: "updated!" });
  },

  async updateLevel(req, res) {
    await prisma.user.update({
      where: { email: req.user.email },
      data: { level: req.body.level },
    });
  
    res.json({ message: "updated!" });
  }
}

module.exports = Quiz;