const Product=require('../models/product.model');
const Category=require('../models/category.model');
const User=require('../models/user.model');

const controller={

	getProducts:async(req,res)=>{
		let filter={};
		
		if(req.query.categories) filter={category:req.query.categories}

		try{
			let product=await Product.find(filter).populate('category');
			if(!product) return res.status(404).send({product});
			return res.status(200).send({product:product});
		}catch(error){
			return res.status(500).send({error});
		}	
	},

	getProduct:async(req,res)=>{
		const id=req.params.id;
		if(!id)return res.status(400).send({message:'no id'});

		try{
			let existProduct=await Product.findById(req.params.id);
			if(!existProduct) return res.status(404).send('product no exist');
		}catch(error){
			return res.status(500).send({error});
		}

		await Product.findById(id,(error,product)=>{
			return res.status(200).send({product});
		}).clone().populate('category')
	},

	postProduct:async(req,res)=>{
		
		let user=await User.findById(req.user.userId);
		if(!user) return res.status(400).send('user no existe');

	
		let category=await Category.findById(req.body.category);
		if(!category) return res.status(400).send('no category'); 

		const file=req.file;
		if(!file) return res.status(400).send('no file');

		const basePath=`${req.protocol}://${req.get('host')}/public/uploads/`;
		const fileName=req.file.filename;

		const product=new Product({
			name:req.body.name,
			description:req.body.description,
			richDescription:req.body.richDescription,
			image:`${basePath}${fileName}`,
			brand:req.body.brand,
			autor:req.user.userId,
			price:req.body.price,
			category:req.body.category,
			countInStock:req.body.countInStock,
			rating:req.body.rating,
			numReviews:req.body.numReviews,
			isFeatured:req.body.isFeatured
		});

		await product.save((error,product)=>{
			if(error)return res.status(500).send({error});
			if(!product) return res.status(404).send({product:product});
			return res.status(200).send({product:product});
		})
	
	},

	updateProduct:async(req,res)=>{
		const id=req.params.id;
		if(!id) return res.status(400).send('no id');

		let user=await User.findById(req.user.userId);
		if(!user) return res.status(400).send('user no existe');
	
		let existProduct=await Product.findById(req.params.id);
		if(!existProduct) return res.status(404).send('product no exist');
	
		let existCategory=await Category.findById(req.body.category);
		if(!existCategory) return res.status(404).send('category no exist');

		const file=req.file;
		let imagepath;
		if(file){
			const fileName=file.filename;
			const basePath=`${req.protocol}://${req.get('host')}/public/uploads/`;
			imagepath=`${basePath}${fileName}`;
		}else{
			imagepath=existProduct.image;
		}		

		let product={
			name:req.body.name,
			description:req.body.description,
			richDescription:req.body.richDescription,
			image:imagepath,
			brand:req.body.brand,
			price:req.body.price,
			autor:req.body.autor,
			category:req.body.category,
			countInStock:req.body.countInStock,
			rating:req.body.rating,
			numReviews:req.body.numReviews,
			isFeatured:req.body.isFeatured
		}

		await Product.findByIdAndUpdate(id,product,{new:true},(error,update)=>{
			if(error)return res.status(500).send({error});
			if(!update) return res.status(404).send({update});
			return res.status(200).send({update});
		}).clone();
		
	},

	deleteProduct:async(req,res)=>{
		const id=req.params.id;
		if(!id) return res.status(400).send('no id');

		try{
			let existProduct=await Product.findById(req.params.id);
			if(!existProduct) return res.status(404).send('product no exist');
		}catch(error){
			return res.status(500).send({error});
		}

		await Product.findByIdAndDelete(id,(error,deleted)=>{
			if(error)return res.status(500).send({error});
			if(!deleted) return res.status(404).send({deleted});
			return res.status(200).send({deleted});
		}).clone();
	},

	getCount:async(req,res)=>{
		try{
			let count=await Product.countDocuments();
			if(!count) return res.status(404).send({count});
			return res.status(200).send({count});
		}catch(error){
			return res.status(500).send({error});
		}
	},

	getFeatured:async(req,res)=>{
		let limit=req.params.count? req.params.count :0;
		try{
			const featureds=await Product.find({isFeatured:true}).limit(limit);
			if(!featureds)return res.status(404).send({featureds});
			return res.status(200).send({featureds});
		}catch(error){
			return res.status(500).send({error});
		}
	},

	galeryImages:async(req,res)=>{

		const id=req.params.id;
		if(!id) return res.status(400).send('no id');

		const files=req.files;
		let imagesPaths=[];
		const basePath=`${req.protocol}://${req.get('host')}/public/uploads/`;

		if(files){
			files.map(file=>{
				imagesPaths.push(`${basePath}${file.filename}`);
			})
		}

		let update={
			images:imagesPaths
		}

		try{
			let updated=await Product.findByIdAndUpdate(id,update,{new:true});
			if(!updated) return res.status(404).send('no existe producto');
			return res.status(200).send(updated);
		}catch(error){
			return res.status(500).send({error});
		}

	}
}
	
module.exports=controller;