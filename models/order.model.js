const mongoose=require('mongoose');

const OrderSchema=mongoose.Schema({
	orderItems:[{
		type:mongoose.Schema.Types.ObjectId,
		ref:'OrderItems',
		required:true
	}],
	country:{
		type:String,
		required:true
	},
	status:{
		type:String,
		required:true,
		default:'Pending'
	},
	totalPrice:{
		type:Number
	},
	user:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'users',
		required:true
	},
	dateOrdered:{
		type:Date,
		default:Date.now
	}
})

module.exports=mongoose.model('orders',OrderSchema);