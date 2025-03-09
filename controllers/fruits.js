// controllers/fruits.js
const express = require('express');
const router = express.Router();

const Fruit = require('../models/fruit.js');

router.get('/new', (req, res) => {
  res.render('fruits/new.ejs');
});

router.post("/", async (req, res) => {
  try {
    if (!req.body.name.trim()) {
      throw new Error("Invalid input: The name field cannot be empty!");
    }
    await Fruit.create(req.body);
    res.redirect("/fruits");
  } catch (err) {
    res.render("error.ejs", { msg: err.message });
  }
});


router.get('/', async (req, res) => {
  const foundFruits = await Fruit.find();
  res.render('fruits/index.ejs', { fruits: foundFruits });
});

module.exports = router;
