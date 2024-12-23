const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{ username: "Karrar", password: "pass123" }];

// Check if username is valid
const isValid = (username) => {
  return username && typeof username === "string";
};

// Authenticate user by username and password
const authenticatedUser = (username, password) => {
  return users.some(
    (user) => user.username === username && user.password === password
  );
};

// Task 7: Login as a registered user
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign({ username }, "access", { expiresIn: "1h" });
    req.session.authorization = { accessToken, username };
    return res.status(200).json({ message: "Login successful" });
  } else {
    return res.status(403).json({ message: "Invalid credentials" });
  }
});

// Task 8: Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization?.username;

  if (!username) {
    return res.status(401).json({ message: "User not logged in." });
  }

  if (!review) {
    return res.status(400).json({ message: "Review content is required." });
  }

  if (books[isbn]) {
    if (!books[isbn].reviews) books[isbn].reviews = {};

    // Add or modify the review for the logged-in user
    books[isbn].reviews[username] = review;
    return res
      .status(200)
      .json({ message: "Review added/updated successfully." });
  } else {
    return res.status(404).json({ message: "Book not found." });
  }
});

// Task 9: Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization?.username;

  if (!username) {
    return res.status(401).json({ message: "User not logged in." });
  }

  if (books[isbn] && books[isbn].reviews && books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Review deleted successfully." });
  } else {
    return res.status(404).json({ message: "Review not found for this user." });
  }
});

module.exports = {
  authenticated: regd_users,
  isValid,
  users,
};