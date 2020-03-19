const express = require('express');
const db = require('./postDb');

const router = express.Router();

router.get('/', (req, res) => {
  db.get()
    .then(obj =>{
      res.status(200).json({body: {...obj}})
    })
    .catch(err =>{
      res.status(400).json({errorMessage: 'Error getting all posts'})
    })
});

router.get('/:id', validatePostId, (req, res) => {
  db.getById(req.post.id)
    .then(obj =>{
      res.status(200).json({body: {...obj}})
    })
    .catch(err =>{
      res.status(400).json({errorMessage: 'Error getting post with specified id'})
    })
});

router.delete('/:id', validatePostId, (req, res) => {
  db.remove(req.post.id)
    .then(obj =>{
      res.status(200).json({body: {...req.post}})
    })
    .catch(err =>{
      res.status(400).json({errorMessage: 'Error deleting specified post'})
    })
});

router.put('/:id', [validatePostId, validatePost], (req, res) => {
  console.log({
    id: req.post.id,
    text: req.body.text
  })
  db.update(req.post.id, req.body)
    .then(obj =>{
      res.status(200).json({body: {...req.body}})
    })
    .catch(err =>{
      res.status(400).json({errorMessage: 'Error editing specified post'})
    })
});

// custom middleware

function validatePostId(req, res, next) {
  if(!isNaN(req.params.id)){
    db.getById(req.params.id)
      .then(obj =>{
        if(obj){
          req.post = obj;
          next();
        } else {
          res.status(400).json({success: false, errorMessage: "Invalid post ID"});
          res.end();
        }
      })
      .catch(err =>{
        res.status(500).json({success: false, errorMessage: "There was an error getting the post from the server"});
        res.end();
      })
  } else {
    res.status(400).json({success: false, errorMessage: "Post Id not provided"});
    res.end();
  }
}

function validatePost(req, res, next){
  if(req.body && req.body !== {}){
    if(req.body.text && req.body.text !== {}){
      next();
    } else {
      res.status(400).json({success: false, errorMessage: "Missing Required Text Field"})
      res.end();
    }
  } else {
    res.status(400).json({success: false, errorMessage: "Missing Post Data"})
    res.end();
  }
}

module.exports = router;
