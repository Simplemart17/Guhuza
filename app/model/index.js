const { PrismaClient } = require("@prisma/client");

// initialize prisma
const prisma = new PrismaClient();

// export prisma
module.exports = prisma