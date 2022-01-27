const mongoose=require('mongoose');

const OrderItemsSchema=mongoose.Schema({
	product:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'products',
		required:true
	},
	quantity:{
		type:Number,
		required:true
	}
})

module.exports=mongoose.model('OrderItems',OrderItemsSchema);