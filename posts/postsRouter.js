const express = require('express');
const router = express.Router();
const { insert, find, findById } = require('../data/db');

router.post('/', async (req, res) => {
  const post = req.body;

  if (!post.title || !post.contents) {
    res.status(400).json({
      errorMessage: 'Please provide title and contents for the post.',
    });
  }

  try {
    const { id } = await insert(post);
    const addedPost = await findById(id);

    res.status(201).json(addedPost);
  } catch (err) {
    res.status(500).json({
      error: 'There was an error while saving the post to the database.',
    });
  }
});

// router.get('/', async (req, res) => {
//   const posts = await find();

//   res.status(200).json(posts);
// });

module.exports = router;
