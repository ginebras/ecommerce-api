const expressJwt=require('express-jwt');
const secret=process.env.SECRET;
const api=process.env.API_URL;

function authJwt(){
	return expressJwt({
		secret,
		algorithms:['HS256'],
		isRevoked:revoke,
	}).unless({
		path:[
			{url:/\/public\/uploads(.*)/ ,methods:['GET','OPTIONS']},
			{url:/\/api\/v1\/product(.*)/ ,methods:['GET','OPTIONS']},
			{url:/\/api\/v1\/category(.*)/ ,methods:['GET','OPTIONS']},			
			`${api}/users/login`,
			`${api}/users/register`
		]
	})
}

const revoke=async(req,payload,done)=>{
	if(!payload.isAdmin || payload.isAdmin===false)
		done(null,true);

	done();
}

module.exports=authJwt;