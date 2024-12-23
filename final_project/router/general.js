// Updated general.js to include Promises or Async/Await for Tasks 10-13
const express = require("express");
const axios = require("axios"); // Axios for HTTP requests
let books = require("./booksdb.js");
const public_users = express.Router();

// Task 10: Get the book list using Async-Await
public_users.get("/", async function (req, res) {
  try {
    const response = await new Promise((resolve) => resolve(books));
    res.status(200).send(JSON.stringify(response, null, 2));
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch books." });
  }
});

// Task 11: Get book details based on ISBN using Async-Await
public_users.get("/isbn/:isbn", async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const book = await new Promise((resolve, reject) => {
      if (books[isbn]) resolve(books[isbn]);
      else reject("Book not found.");
    });
    res.status(200).json(book);
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

// Task 12: Get book details based on Author using Promises
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  new Promise((resolve, reject) => {
    const results = Object.values(books).filter(
      (book) => book.author === author
    );
    if (results.length > 0) resolve(results);
    else reject("No books found for this author.");
  })
    .then((results) => res.status(200).json(results))
    .catch((error) => res.status(404).json({ message: error }));
});

// Task 13: Get book details based on Title using Promises
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  new Promise((resolve, reject) => {
    const results = Object.values(books).filter((book) => book.title === title);
    if (results.length > 0) resolve(results);
    else reject("No books found with this title.");
  })
    .then((results) => res.status(200).json(results))
    .catch((error) => res.status(404).json({ message: error }));
});

module.exports = {
  general: public_users,
};
