const Router=require('express').Router();
const Order=require('../controllers/order.controller');

Router.get('/orders',Order.getOrders);
Router.post('/orders',Order.postOrder);
Router.get('/orders/:id',Order.getOrder);
Router.delete('/orders/:id',Order.deleteOrder);
Router.put('/orders/:id',Order.updateOrder);
Router.get('/orders/get/totalsales',Order.totalSales);
Router.get('/orders/userorders/:id',Order.userOrders);

module.exports=Router;