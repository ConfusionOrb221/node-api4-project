const express = require('express');
const db = require('./userDb');
const postDb = require('../posts/postDb');

const router = express.Router();

router.post('/', validateUser, (req, res) => {
  db.insert(req.body)
    .then(obj =>{
      res.status(200).json({body: {...obj}});
    })
    .catch(err =>{
      res.status(400).json({errorMessage: 'There was a problem adding the user to the database'});
    })
});

router.post('/:id/posts', [validateUserId, validatePost], (req, res) => {
  postDb.insert({
    user_id: req.user.id,
    text: req.body.text
  })
    .then(obj =>{
      res.status(200).json({body: {...obj}});
    })
    .catch(err =>{
      res.status(400).json({errorMessage: 'There was a problem adding the Post to the database'});
    })
});

router.get('/', (req, res) => {
  db.get()
    .then(obj =>{
      res.status(200).json({body: {...obj}});
    })
    .catch(err =>{
      res.status(400).json({errorMessage: 'There was a problem getting all users from the database'});
    })
});

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json({body: {...req.user}})
});

router.get('/:id/posts', validateUserId, (req, res) => {
  db.getUserPosts(req.user.id)
    .then(obj =>{
      res.status(200).json({body: {...obj}})
    })
    .catch(err =>{
      res.status(400).json({errorMessage: 'Error getting comments from user'})
    })
});

router.delete('/:id', validateUserId, (req, res) => {
  db.remove(req.user.id)
    .then(obj =>{
      res.status(200).json({body: {...req.user}})
    })
    .catch(err =>{
      res.status(400).json({errorMessage: 'Error deleting user'})
    })
});

router.put('/:id', [validateUserId, validateUser], (req, res) => {
  // do your magic
  db.update(req.user.id, req.body)
    .then(obj =>{
      res.status(200).json({body: {...req.body}})
    })
    .catch(err =>{
      res.status(400).json({errorMessage: 'Error editing user'})
    })
});

//custom middleware

function validateUserId(req, res, next) {
  if(!isNaN(req.params.id)){
    db.getById(req.params.id)
      .then(obj =>{
        if(obj){
          req.user = obj;
          next();
        } else {
          res.status(400).json({success: false, errorMessage: "Invalid user ID"});
          res.end();
        }
      })
      .catch(err =>{
        res.status(500).json({success: false, errorMessage: "There was an error getting the user from the server"});
        res.end();
      })
  } else {
    res.status(400).json({success: false, errorMessage: "User Id not provided"});
    res.end();
  }
}

function validateUser(req, res, next) {
  if(req.body && req.body !== {}){
    if(req.body.name && req.body.name !== {}){
      next();
    } else {
      res.status(400).json({success: false, errorMessage: "Missing Required Name Field"})
      res.end();
    }
  } else {
    res.status(400).json({success: false, errorMessage: "Missing User Data"})
    res.end();
  }
}

function validatePost(req, res, next) {
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
