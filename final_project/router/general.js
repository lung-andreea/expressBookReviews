const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user. Username and password not provided"});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(JSON.stringify({books}, null, 4))
    }, 1000)
  }).then((retrievedBooks) => {
    res.send(retrievedBooks)
  }).catch(e => {
    res.status(505).json({message: 'Server error when retrieving list of books!'})
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (isbn in books) {
        resolve(JSON.stringify({book: books[isbn]}, null, 4))
      } else {
        reject('No book found for the provided isbn!')
      }
    }, 1000)
  }).then((retrievedBook) => {
    res.send(retrievedBook)
  }).catch(e => {
    res.status(505).json({message: e})
  })
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author
  new Promise((resolve, reject) => {
    setTimeout(() => {
      const matchedBooks = Object.values(books).filter(book => book.author === author)
      resolve(JSON.stringify({books: matchedBooks}, null, 4))
    }, 1000)
  }).then((retrievedBooks) => {
    res.send(retrievedBooks)
  }).catch(e => {
    res.status(505).json({message: `Server error trying to retrieve list of books written by ${author}`})
  })
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title
  new Promise((resolve, reject) => {
    setTimeout(() => {
      const book = Object.values(books).find(book => book.title === title)
      if (book) {
        resolve(JSON.stringify({book}, null, 4))
      } else {
        reject('No book found with the provided title!')
      }
    }, 1000)
  }).then((retrievedBook) => {
    res.send(retrievedBook)
  }).catch(e => {
    res.status(505).json({message: e})
  })
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (isbn in books) {
        resolve(JSON.stringify({reviews: books[isbn].reviews}, null, 4))
      } else {
        reject('No book found for the provided isbn!')
      }
    }, 1000)
  }).then((reviews) => {
    res.send(reviews)
  }).catch(e => {
    res.status(505).json({message: e})
  })
});

module.exports.general = public_users;
