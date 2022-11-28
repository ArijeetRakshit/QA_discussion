const express = require('express');
const { signup, signin, createPost, updatePost, deletePost, addAnswer, getAnswers, getPosts } = require('./controller');
const { verifyToken } = require('../Middleware/auth');
const { validateSignIn, validateCreatePost, validateUpdatePost, validateDeletePost, validateAddAnswer, validateGetAnswers, validateGetPosts, validateSignUp } = require('../Middleware/validation');

const formRouter = express.Router();

formRouter.post('/signup',validateSignUp,signup)
formRouter.post('/signin', validateSignIn, signin);
formRouter.post('/createpost', verifyToken, validateCreatePost, createPost);
formRouter.put('/updatepost', verifyToken, validateUpdatePost, updatePost);
formRouter.delete('/deletepost', verifyToken, validateDeletePost, deletePost);
formRouter.post('/addanswer', verifyToken, validateAddAnswer, addAnswer);
formRouter.get('/getanswers',validateGetAnswers,getAnswers);
formRouter.get('/getposts',validateGetPosts, getPosts);

module.exports = formRouter;