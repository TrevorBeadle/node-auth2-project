const jwt = require("jsonwebtoken");

const roles = ["basic", "admin"];

function restrict(role) {
  return async (req, res, next) => {
    try {
      const token = req.cookies.token;

      if (!token) {
        next({ code: 401, message: "invalid credentials" });
      }

      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return next({ code: 401, message: "invalid credentials" });
        }

        if (role && roles.indexOf(decoded.userRole) < roles.indexOf(role)) {
          return next({ code: 401, message: "invalid credentials" });
        }

        req.token = decoded;
        next();
      });
    } catch ({ message }) {
      next({ code: 500, message });
    }
  };
}

module.exports = { restrict };
