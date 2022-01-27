const Order=require('../models/order.model');
const OrderItem=require('../models/orderItems.model');
const User=require('../models/user.model');

const controller={
	
	getOrders:async(req,res)=>{
		try{
			let orders=await Order.find().populate('user');
			if(!orders) return res.status(400).send({orders});
			return res.status(200).send({orders});
		}catch(error){
			return res.status(500).send({error});
		}
	},

	postOrder:async(req,res)=>{

		let userExist=User.find(req.user.userId);
		if(!userExist) return res.status(400).send('user not exist');
		
		const ordersItemsId=Promise.all(req.body.orderItems.map(async item=>{
			let newOrderItem=new OrderItem({
				quantity:item.quantity,
				product:item.product
			})

			let savedOrderItems=await newOrderItem.save();

			return savedOrderItems.id;
		}))

		const resolvedItemsId=await ordersItemsId;

		const totalPrices=await Promise.all(resolvedItemsId.map(async ids=>{
			let item=await OrderItem.findById(ids).populate('product','price');
			let total=item.product.price * item.quantity;
			return total;
		}))

		const totalPrice=totalPrices.reduce((a,b)=> a+b,0);

		const order=new Order({
			orderItems:resolvedItemsId,
			country:req.body.country,
			status:req.body.status,
			totalPrice:totalPrice,
			user:req.user.userId,
		})

		await order.save((error,ok)=>{
			if(error) return res.status(500).send({error});
			if(!ok) return res.status(400).send({ok});
			return res.status(200).send({order});
		})
	},

	getOrder:async(req,res)=>{
		let id=req.params.id;
		if(!id) return res.status(400).send('no id');

		let existUser=await User.findById(req.user.userId);
		if(!existUser) return res.status(400).send('user no exist');
	
		try{
			let order=await Order.findById(id)
			.populate('user')
			.populate({path:'orderItems',populate: {path:'product',populate:'category'}});
			
			if(!order) return res.status(400).send({order});
			return res.status(200).send({order});
		}catch(error){
			return res.status(500).send(error);
		}
	},


	updateOrder:async(req,res)=>{
		let id=req.params.id;
		if(!id) return res.status(400).send('no id');

		let orderExist=await Order.findById(req.params.id);
		if(!orderExist) return res.status(400).send('no order exist');

		let update={
			status:req.body.status
		}

		try{
			let order=await Order.findByIdAndUpdate(id,update);
			if(!order) return res.status(400).send({order});
			return res.status(200).send({order});
		}catch(error){
			return res.status(500).send(error);
		}
	},

	deleteOrder:async(req,res)=>{
		let id=req.params.id;
		if(!id) return res.status(400).send('no id');

		try{
			await Order.findByIdAndRemove(id)
			.then(async order=>{
				if(order){
					await order.orderItems.map(async orderItem=>{
						await OrderItem.findByIdAndRemove(orderItem);
					})
					return res.status(200).send({order});

				}else{
					return res.status(400).send('order not exist');
				}
			})
		}catch(error){	
			return res.status(500).send(error);
		}
	},

	totalSales:async(req,res)=>{
		try{
			const totalSales=await Order.aggregate([
				{ $group: { _id: null, totalsales : { $sum : '$totalPrice'}}}
			])
			if(!totalSales) return res.status(400).send('sum cannot be created');

			return res.status(200).send({totalSales});
		}catch(error){
			return res.status(500).send({error});
		}
	},

	userOrders:async(req,res)=>{
		let id=req.params.id;
		if(!id) return res.status(400).send('no id');

		try{
			let orders=await Order.find({user:id}).populate({path:'orderItems',populate:{path:'product',populate:'category'}});
			if(!orders) return res.status(404).send('no hay orders');
			return res.status(200).send({orders});
		}catch(error){
			return res.status(500).send(error);
		}
	}	

}

module.exports=controller;
