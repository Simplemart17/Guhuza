const jwt = require("jsonwebtoken");
const prisma = require("../model/index");

async function verifyToken(req, res, next) {
  const token = req.headers.token;
  if (!token) {
    return res.status(403).json({ error: "Token is not provided" });
  }
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
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
    console.log(error, "what error");
    return res.status(403).json({ error: "Authentication fails!" });
  }
  return next();
}

module.exports = verifyToken;
