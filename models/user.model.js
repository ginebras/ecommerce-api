const mongoose=require('mongoose');

const UserSchema=mongoose.Schema({
	name:{
		type:String,
		required:true
	},
	email:{
		type:String,
		required:true,
		unique:true
	},
	passwordHash:{
		type:String,
		required:true
	},
	phone:{
		type:Number,
		default:null
	},
	isAdmin:{
		type:Boolean,
		default:false
	},
	country:{
		type:String,
		default:''
	}
})

module.exports=mongoose.model('users',UserSchema);