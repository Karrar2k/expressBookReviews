const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

const app = express();

app.use(express.json());

// Session middleware
app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 }, // 1 hour session length
  })
);

// Authentication middleware
app.use("/customer/auth/*", function auth(req, res, next) {
  if (req.session && req.session.authorization) {
    const token = req.session.authorization.accessToken;
    try {
      jwt.verify(token, "access");
      next();
    } catch {
      res.status(403).send("Invalid Token.");
    }
  } else {
    res.status(401).send("User not logged in.");
  }
});

const PORT = 5000;

// Routes
app.use("/customer", customer_routes);
app.use("/", genl_routes);

// Start server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));