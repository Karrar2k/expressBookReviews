const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 1: Get the book list available in the shop
public_users.get("/", function (req, res) {
  res.status(200).send(JSON.stringify(books, null, 2));
});

// Task 2: Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.status(200).json(book);
  } else {
    res.status(404).json({ message: "Book not found." });
  }
});

// Task 3: Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const results = Object.values(books).filter((book) => book.author === author);
  if (results.length > 0) {
    res.status(200).json(results);
  } else {
    res.status(404).json({ message: "No books found for this author." });
  }
});

// Task 4: Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const results = Object.values(books).filter((book) => book.title === title);
  if (results.length > 0) {
    res.status(200).json(results);
  } else {
    res.status(404).json({ message: "No books found with this title." });
  }
});

// Task 5: Get book reviews
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book && book.reviews) {
    res.status(200).json(book.reviews);
  } else {
    res.status(404).json({ message: "No reviews found for this book." });
  }
});

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }
  if (users[username]) {
    return res.status(400).json({ message: "Username already exists." });
  }
  users[username] = { password };
  res.status(200).json({ message: "User registered successfully." });
});

module.exports = {
  general: public_users,
};