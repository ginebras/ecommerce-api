const Router=require('express').Router();
const ProductController=require('../controllers/product.controller');
const multer=require('multer');

const FILE_MYME_TYPE={
	'image/png':'png',
	'image/jpeg':'jpeg',
	'image/jpg':'jpg'
}

const storage = multer.diskStorage({
  destination:(req, file, cb)=>{
  	const isValid=FILE_MYME_TYPE[file.mimetype];
  	let uploadError=new Error('invalid image type');

  	if(isValid) uploadError=null;
    cb(null, 'public/uploads');
  },
  filename:(req, file, cb)=>{
    const fieldName = file.originalname;
    cb(null, `${Date.now()}-${fieldName}`);
  }
})

const uploadOptions = multer({ storage: storage });

Router.get('/product',ProductController.getProducts);
Router.get('/product/:id',ProductController.getProduct);
Router.post('/product',uploadOptions.single('image') ,ProductController.postProduct);
Router.put('/product/:id',uploadOptions.single('image'),ProductController.updateProduct);
Router.delete('/product/:id',ProductController.deleteProduct);
Router.get('/count',ProductController.getCount);
Router.get('/featured/:count',ProductController.getFeatured);
Router.put('/product/galery-images/:id',uploadOptions.array('images',10) ,ProductController.galeryImages);

module.exports=Router;