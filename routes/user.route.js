const Router =require('express').Router();
const User=require('../controllers/user.controller');

Router.get('/users',User.getUsers);
Router.get('/users/:id',User.getUser);
Router.post('/users',User.postUser);
Router.put('/users/:id',User.updateUser);
Router.post('/users/login',User.login);
Router.get('/users/get/count',User.getCount);

module.exports=Router;