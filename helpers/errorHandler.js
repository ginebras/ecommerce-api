function errorHandler(err,req,res,next){
	if(err.name==='UnauthorizedError'){
		return res.status(500).send('User not authorized');
	}

	if(err.name==='ValidationError'){
		return res.status(500).send({message:err});
	}

	return res.status(500).send({error});
}

module.exports=errorHandler;