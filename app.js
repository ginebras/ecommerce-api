const express=require("express");
const app=express();
const morgan=require("morgan");
const cors=require('cors');
require('dotenv/config');

const authJwt=require('./helpers/jwt');
const errorHandler=require('./helpers/errorHandler');

//MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(morgan('tiny'));
app.use(cors());
app.use(authJwt());
app.use(errorHandler);
app.use('/public/uploads',express.static(__dirname+'/public/uploads'));

//ROUTES
app.use(process.env.API_URL,require('./routes/category.route'));
app.use(process.env.API_URL,require('./routes/product.route'));
app.use(process.env.API_URL,require('./routes/user.route'));
app.use(process.env.API_URL,require('./routes/order.route'));

//EXPORT
module.exports=app;