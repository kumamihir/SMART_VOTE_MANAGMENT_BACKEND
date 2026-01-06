const mongoose = require("mongoose");

const connectdb = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO);
        console.log("connect ho gya lala!")
    }catch(err){
        console.error("sorry gng error : ",err.message);
        process.exit(1);
    }
};
module.exports = connectdb;