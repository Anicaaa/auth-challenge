const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const register = async (req, res) => {
  const { username, password } = req.body;
  console.log("LOOK HEREEEE", req.body);
  const hashedPassword = await bcrypt.hash(password, 10);
  const createdUser = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
    },
  });

  res.json({ data: createdUser });
};

const login = async (req, res) => {
  const { username, password } = req.body;

  const foundUser = await prisma.user.findFirst({
    where: {
      username,
    },
  });

  if (!foundUser) {
    return res.status(401).json({ error: "Invalid username or password." });
  }

  const passwordsMatch = await bcrypt.compare(password, foundUser.password);

  if (!passwordsMatch) {
    return res.status(401).json({ error: "Invalid username or password." });
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET);

  res.json({ data: token });
};

module.exports = {
  register,
  login,
};
