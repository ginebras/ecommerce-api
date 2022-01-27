const Category=require('../models/category.model');

const controller={
	getCategories:async(req,res)=>{
		
		
		await Category.find((error,categories)=>{
			if(error)return res.status(500).send({error});
			if(!categories) return res.status(404).send({categories});
			return res.status(200).send({categories:categories});
		})
		
	},

	getCategory:async(req,res)=>{
		const id=req.params.id;
		if(!id) return res.status(400).send({message:'no id'});

		try{
			let existCategory=await Category.findById(req.params.id);
			if(!existCategory) return res.status(404).send('no category exist');
		}catch(error){
			return res.status(500).send({error});
		}
		
		await Category.findById(id,(error,category)=>{
			if(error)return res.status(500).send({error});
			if(!category) return res.status(404).send({category});
			return res.status(200).send({category});		
		})
		
	},

	postCategory:async(req,res)=>{
		const category=new Category({
			name:req.body.name
		})

		
		await category.save((error,category)=>{
			if(error)return res.status(500).send({error});
			if(!category) return res.status(404).send({category});
			return res.status(200).send({category});		
		})
		
	},

	deleteCategory:async(req,res)=>{
		const id=req.params.id;
		if(!id) return res.status(400).send({message:'no id'});

		try{
			let existCategory=await Category.findById(req.params.id);
			if(!existCategory) return res.status(404).send('no category exist');
		}catch(error){
			return res.status(500).send({error});
		}
		
		await Category.findByIdAndDelete(id,(error,deletedCategory)=>{
			if(error)return res.status(500).send({error});
			if(!deletedCategory) return res.status(404).send({deletedCategory});
			return res.status(200).send({deletedCategory});
		})
		
	},

	updateCategory:async(req,res)=>{
		const id=req.params.id;
		if(!id) return res.status(400).send({message:'no id'});

		try{
			let existCategory=await Category.findById(req.params.id);
			if(!existCategory) return res.status(404).send('no category exist');

		}catch(error){
			return res.status(500).send({error});
		}

		const category={
			name:req.body.name
		}

		await Category.findByIdAndUpdate(id,category,{new:true},(error,updated)=>{
			if(error)return res.status(500).send({error});
			if(!updated) return res.status(404).send({updated});
			return res.status(200).send({updated});
		})
		
	}
}

module.exports=controller;