const app=require('./app');
const mongoose=require('mongoose');
const port=process.env.PORT || 3700;

mongoose.Promise=global.Promise;


mongoose.connect(process.env.MONGOOSE_URL,{useNewUrlParser:true,useUnifiedTopology:true})
	.then(()=>{

		console.log("Conexion a base de datos realizada");

		app.listen(port,()=>{
			console.log(`Servidor escuchando en el puerto ${port}`);
		})

	}).catch(error=>console.log(error))