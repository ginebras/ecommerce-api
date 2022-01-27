const Router=require('express').Router();
const CategoryController=require('../controllers/category.controller');

Router.get('/category',CategoryController.getCategories);
Router.get('/category/:id',CategoryController.getCategory);
Router.post('/category',CategoryController.postCategory);
Router.delete('/category/:id',CategoryController.deleteCategory);
Router.put('/category/:id',CategoryController.updateCategory);

module.exports=Router;