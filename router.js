const express = require('express');
const router = express.Router();
const userController = require('./controllers/userController');
const postController = require('./controllers/postController');

// User related routs
router.get('/', userController.home);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/login', userController.login);

// Profile related routs
router.get('/profile/:username', userController.ifUserExists, userController.profilePostsScreen)

// Post related routs
router.get('/create-post', userController.mustBeLoggedIn, postController.viewCreateScreen);
router.post('/create-post', userController.mustBeLoggedIn, postController.create);
router.get('/post/:id', postController.viewSingle);
router.get('/post/:id/edit', postController.viewEditScreen);

module.exports = router;