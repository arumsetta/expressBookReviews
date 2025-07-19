const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }
    if (users.some(user => user.username === username)) {
      return res.status(400).json({ message: "Username already exists" });
    }
    users.push({ username, password });
    return res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const bookList = await new Promise((resolve) => {
      resolve(books); // Simulate async operation
    });
    return res.status(200).json(bookList);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  
  try {
    const book = await new Promise((resolve, reject) => {
      if (books[isbn]) {
        resolve(books[isbn]); // Simulate async lookup
      } else {
        reject(new Error("Book not found"));
      }
    });
    return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;

  try {
    const filteredBooks = await new Promise((resolve) => {
      const booksArray = Object.entries(books);
      const filtered = booksArray.filter(([_, book]) => 
        book.author.toLowerCase().includes(author.toLowerCase())
      );
      resolve(Object.fromEntries(filtered));
    });

    if (Object.keys(filteredBooks).length === 0) {
      return res.status(404).json({ message: "No books found by this author" });
    }

    return res.status(200).json(filteredBooks);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Get all books based on title
// Get books by title using async/await
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;

  try {
    const filteredBooks = await new Promise((resolve) => {
      const booksArray = Object.entries(books);
      const filtered = booksArray.filter(([_, book]) => 
        book.title.toLowerCase().includes(title.toLowerCase())
      );
      resolve(Object.fromEntries(filtered));
    });

    if (Object.keys(filteredBooks).length === 0) {
      return res.status(404).json({ message: "No books found with this title" });
    }

    return res.status(200).json(filteredBooks);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
