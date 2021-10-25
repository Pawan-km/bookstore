const express = require("express");
const mongoose = require('mongoose')
const router = express.Router();
const Author = require("../models/author");
const Book = require("../models/book");

// All Authors Route
router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name !== "") {
    searchOptions.name = new RegExp(req.query.name, "i");
  }
  try {
    const authors = await Author.find(searchOptions);

    res.render("authors/index", {
      authors: authors,
      searchOptions: req.query,
    });
  } catch {
    res.redirect("/");
  }
});

// New Author Route
router.get("/new", (req, res) => {
  res.render("authors/new", { author: new Author() });
});

// Create Author Route
router.post("/", async (req, res) => {
  const author = new Author({
    name: req.body.name,
  });
  try {
    const newAuthor = await author.save();
    res.redirect(`authors/${newAuthor.id}`);
  } catch (e) {
    console.log(e);
    res.render("authors/new", {
      author: author,
      errorMessage: e,
    });
  }
});

router.get("/:id", async (req, res) => {
  try{
    let id = req.params.id
    author = await Author.findById(id.trim());
    const books = await Book.find({author: author.id})
    res.render('authors/show', {
      author: author,
      booksByAuthor: books
    })
  }catch(e){
    console.log(e)
    res.redirect('/')
  }
  
});

router.get("/:id/edit", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    res.render("authors/edit", { author: author });
  } catch {
    res.redirect("/authors");
  }
});

router.put("/:id", async (req, res) => {
  let author;

  try {
    console.log("param ID ", req.params.id,"/");
    author = await Author.findById(req.params.id);
    
    console.log(author);
    author.name = req.body.name;
    await author.save();
    res.redirect(`/authors/${author.id}`);
  } catch (e) {
    if (author == null) {
      res.redirect("/");
    } else {
      res.render("authors/edit", {
        author: author,
        errorMessage: e,
      });
    }
  }
});

router.delete("/:id", async (req, res) => {
  let author;
  try {
    console.log("param ID ", req.params.id,"/");
    let id = req.params.id
    author = await Author.findById(id.trim());
    // author = await Author.findById(req.params.id);

    await author.remove();

    res.redirect("/authors");
  } catch (e) {
    console.log(e);
    console.log("not delete", author);
    if (author == null) {
      res.redirect ("/");
    } else {
      res.redirect(`/authors/${author.id}`);
    }
  }
});

module.exports = router;

