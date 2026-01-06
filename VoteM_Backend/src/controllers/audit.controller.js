const AuditLog = require("../models/auditLog");

exports.getApplicationAuditTrail = async (req,res) =>{
    try {
        const {applicationId} = req.params;
        const logs = await AuditLog.find({
            application:applicationId
        })
        .populate("performedBy","name role email")
        .sort({createdAt: 1});

        return res.json({
            applicationId,
            count: logs.length,
            auditTrail:logs
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};