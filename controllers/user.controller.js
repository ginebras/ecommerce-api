const User=require('../models/user.model');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

const controller={
	getUsers:async(req,res)=>{
		await User.find((error,users)=>{
			if(error)return res.status(500).send({error});
			if(!users)return res.status(404).send({users});
			return res.status(200).send({users});
		}).select('-passwordHash').clone()
	},

	getUser:async(req,res)=>{
		const id=req.params.id;
		if(!id) return res.status(400).send('no id');

		try{
			let user=await User.findById(id).select('-passwordHash');
			if(!user)return res.status(404).send('no usuario');
			return res.status(200).send({user});
		}catch(error){
			return res.status(500).send({error});
		}
	},

	postUser:async(req,res)=>{
		const user=new User({
			name:req.body.name,
			email:req.body.email,
			passwordHash:bcrypt.hashSync(req.body.password,10),
			phone:req.body.phone,
			isAdmin:req.body.isAdmin,
			country:req.body.country
		})

		
		await user.save((error,saved)=>{
			if(error)return res.status(500).send({error});
			if(!saved) return res.status(404).send({saved});
			return res.status(200).send({saved})
		})
	},
	updateUser:async(req,res)=>{
		const id=req.params.id;
		if(!id) return res.status(400).send('no id');

		try{
			let existUser=await User.findById(req.params.id);
			if(!existUser) return res.status(404).send('no existe usuario');
		}catch(error){
			return res.status(500).send({error});
		}

		let update={
			name:req.body.name,
			email:req.body.email,
			passwordHash:bcrypt.hashSync(req.body.password,10),
			phone:req.body.phone,
			isAdmin:req.body.isAdmin,
			country:req.body.country
		}

		await User.findByIdAndUpdate(id,update,{new:true},(error,updated)=>{
			if(error)return res.status(500).send({error});
			if(!updated) return res.status(404).send({updated});
			return res.status(200).send({updated})
		}).clone()
	},

	login:async(req,res)=>{
		
		const secret=process.env.SECRET;

		const user=await User.findOne({email:req.body.email});
		if(!user) return res.status(404).send('no existe usuario');
		
		if(user && bcrypt.compareSync(req.body.password,user.passwordHash)){
			
			const token=jwt.sign(
				{
				
					userId:user.id,
					isAdmin:user.isAdmin,
					
				},
				secret,
				{expiresIn:'1d'}
			)

			return res.status(200).send({user:user.email,token});

		}else{
			return res.status(400).send('password incorrect');
		}
	},

	getCount:async(req,res)=>{
		try{
			let count=await User.countDocuments();
			if(!count) return res.status(404).send({count});
			return res.status(200).send({count});
		}catch(error){
			return res.status(500).send({error});
		}
	}
}

module.exports=controller;