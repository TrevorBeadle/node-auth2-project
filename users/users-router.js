const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("./users-model");
const { restrict } = require("./users-middleware");

router.get("/users", restrict("admin"), async (req, res, next) => {
  try {
    const users = await Users.find();
    if (users.length) {
      res.status(200).json(users);
    } else {
      next({ code: 400, message: "no users found" });
    }
  } catch ({ message }) {
    next({ code: 500, message });
  }
});

router.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  const hash = bcrypt.hash(password, 14);

  try {
    const user = await Users.findByUsername(username);
    if (user) {
      next({ code: 409, message: "username is already taken" });
    }

    const newUser = await Users.add({
      username,
      password: await bcrypt.hash(password, 12),
    });

    res.status(201).json(newUser);
  } catch ({ message }) {
    next({ code: 500, message });
  }
});

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await Users.findByUsername(username);
    if (!user) {
      return res.status(401).json({ message: "invalid credentials" });
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return res.status(401).json({ message: "invalid credentials" });
    }

    const token = jwt.sign(
      {
        userID: user.id,
        userRole: user.role,
      },
      process.env.JWT_SECRET
    );
    res.cookie("token", token);

    res.status(200).json({ message: `welcome, ${user.username}` });
  } catch ({ message }) {
    next({ code: 500, message });
  }
});

router.get("/logout", async (req, res, next) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "logout successful" });
  } catch (err) {
    next(err);
  }
});

router.use(({ code, message }, req, res, next) => {
  res.status(code).json({ message });
});

module.exports = router;
