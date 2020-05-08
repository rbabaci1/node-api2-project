const express = require('express');
const router = express.Router();
const {
  insert,
  find,
  findById,
  insertComment,
  findCommentById,
} = require('../data/db');

router.post('/', async (req, res) => {
  const post = req.body;

  if (!post.title || !post.contents) {
    res.status(400).json({
      errorMessage: 'Please provide title and contents for the post.',
    });
  } else {
    try {
      const { id } = await insert(post);
      const addedPost = await findById(id);

      res.status(201).json(addedPost);
    } catch (err) {
      res.status(500).json({
        error: 'There was an error while saving the post to the database.',
      });
    }
  }
});

router.post('/:id/comments', async (req, res) => {
  const { id } = req.params;
  const comment = { ...req.body, post_id: id };

  if (!comment.text) {
    res
      .status(400)
      .json({ errorMessage: 'Please provide text for the comment.' });
  } else {
    try {
      const found = await findById(id);

      if (found.length) {
        const { id } = await insertComment(comment);
        const addedComment = await findCommentById(id);

        res.status(201).json(addedComment);
      } else {
        res
          .status(404)
          .json({ message: 'The post with the specified ID does not exist.' });
      }
    } catch (err) {
      res.status(500).json({
        error: 'There was an error while saving the comment to the database.',
      });
    }
  }
});

router.get('/', async (req, res) => {
  try {
    const posts = await find();

    res.status(200).json(posts);
  } catch (err) {
    res
      .status(500)
      .json({ error: 'The posts information could not be retrieved.' });
  }
});

module.exports = router;
