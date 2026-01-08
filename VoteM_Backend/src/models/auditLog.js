const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
    application:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"VoterApplication",
        required:true
    },
    performedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    role:{
        type:String,
        enum:["Voter","BLO","ERO","DEO","CEO"],
        required:true
    },
    action : {
        type:String,
        required:true
    },
    remarks: String

},{timestamps:true})
module.exports = mongoose.model("AuditLog",auditLogSchema);