const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Helper function to simulate async book retrieval using Promise
const getAllBooksAsync = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(books);
      } catch (error) {
        reject(error);
      }
    }, 1000);
  });
};

// Helper function to get book by ISBN using Promise
const getBookByISBNAsync = (isbn) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        if (books[isbn]) {
          resolve(books[isbn]);
        } else {
          reject(new Error("Book not found"));
        }
      } catch (error) {
        reject(error);
      }
    }, 1000);
  });
};

// Helper function to get books by author using Promise
const getBooksByAuthorAsync = (author) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        let booksByAuthor = [];
        for (let key in books) {
          if (books[key].author === author) {
            booksByAuthor.push(books[key]);
          }
        }
        if (booksByAuthor.length > 0) {
          resolve(booksByAuthor);
        } else {
          reject(new Error("No books found by this author"));
        }
      } catch (error) {
        reject(error);
      }
    }, 1000);
  });
};

// Helper function to get books by title using Promise
const getBooksByTitleAsync = (title) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        let booksByTitle = [];
        for (let key in books) {
          if (books[key].title === title) {
            booksByTitle.push(books[key]);
          }
        }
        if (booksByTitle.length > 0) {
          resolve(booksByTitle);
        } else {
          reject(new Error("No books found with this title"));
        }
      } catch (error) {
        reject(error);
      }
    }, 1000);
  });
};

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!users.find(user => user.username === username)) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user. Username and password required."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(JSON.stringify(books, null, 4));
});

// Task 10: Get the book list available in the shop using async-await
public_users.get('/async', async function (req, res) {
  try {
    const allBooks = await getAllBooksAsync();
    return res.status(200).json(allBooks);
  } catch (error) {
    return res.status(500).json({message: "Error retrieving books", error: error.message});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
 });

// Task 11: Get book details based on ISBN using async-await
public_users.get('/async/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const book = await getBookByISBNAsync(isbn);
    return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({message: error.message});
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let booksByAuthor = [];
  
  for (let key in books) {
    if (books[key].author === author) {
      booksByAuthor.push(books[key]);
    }
  }
  
  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
  } else {
    return res.status(404).json({message: "No books found by this author"});
  }
});

// Task 12: Get book details based on author using async-await
public_users.get('/async/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const booksByAuthor = await getBooksByAuthorAsync(author);
    return res.status(200).json(booksByAuthor);
  } catch (error) {
    return res.status(404).json({message: error.message});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let booksByTitle = [];
  
  for (let key in books) {
    if (books[key].title === title) {
      booksByTitle.push(books[key]);
    }
  }
  
  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle);
  } else {
    return res.status(404).json({message: "No books found with this title"});
  }
});

// Task 13: Get book details based on title using async-await
public_users.get('/async/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const booksByTitle = await getBooksByTitleAsync(title);
    return res.status(200).json(booksByTitle);
  } catch (error) {
    return res.status(404).json({message: error.message});
  }
});

// Alternative implementations using Promise callbacks

// Task 10 Alternative: Get the book list using Promise callbacks
public_users.get('/promise', function (req, res) {
  getAllBooksAsync()
    .then(allBooks => {
      return res.status(200).json(allBooks);
    })
    .catch(error => {
      return res.status(500).json({message: "Error retrieving books", error: error.message});
    });
});

// Task 11 Alternative: Get book by ISBN using Promise callbacks
public_users.get('/promise/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  getBookByISBNAsync(isbn)
    .then(book => {
      return res.status(200).json(book);
    })
    .catch(error => {
      return res.status(404).json({message: error.message});
    });
});

// Task 12 Alternative: Get books by author using Promise callbacks
public_users.get('/promise/author/:author', function (req, res) {
  const author = req.params.author;
  getBooksByAuthorAsync(author)
    .then(booksByAuthor => {
      return res.status(200).json(booksByAuthor);
    })
    .catch(error => {
      return res.status(404).json({message: error.message});
    });
});

// Task 13 Alternative: Get books by title using Promise callbacks
public_users.get('/promise/title/:title', function (req, res) {
  const title = req.params.title;
  getBooksByTitleAsync(title)
    .then(booksByTitle => {
      return res.status(200).json(booksByTitle);
    })
    .catch(error => {
      return res.status(404).json({message: error.message});
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
