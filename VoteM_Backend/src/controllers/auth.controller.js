const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req,res)=>{
    try{
        const {name,email,password,role} = req.body;
        const existinguser = await User.findOne({email});

        if(existinguser){
            return res.status(400).json({message : "user exist krta h phle se"});
        }

        const hashedpass = await bcrypt.hash(password,10);

        const user = new User({
            name,
            email,
            passwordHash:hashedpass,
            role
        });
        await user.save();
        res.status(201).json({message:"User registered succesfully"});
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
},

exports.login = async (req,res)=>{
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid creds"});
        }
        const isMatch = await bcrypt.compare(password,user.passwordHash);
        if(!isMatch){
            return res.status(400).json({message : "Invalid creds"});

        }
        const token = jwt.sign(
            {id : user._id,role:user.role},
            process.env.JWT_SECRET,
            {expiresIn:"7d"}
        );
        res.json({token});
    } catch (err) {
        res.status(500).json({message:err.message});
    }
}