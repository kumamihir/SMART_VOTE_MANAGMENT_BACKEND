const AuditLog = require("../models/auditLog");
const VoterApplication = require("../models/voterApplication");

exports.getApplicationAuditTrail = async (req, res) => {
  try {
    const { applicationId } = req.params;

    // 🔹 Check application exists (important for clean API)
    const applicationExists = await VoterApplication.findById(applicationId);
    if (!applicationExists) {
      return res.status(404).json({
        message: "Application not found"
      });
    }

    const logs = await AuditLog.find({
      application: applicationId
    })
      .populate("performedBy", "name role email")
      .sort({ createdAt: 1 });

    return res.json({
      applicationId,
      count: logs.length,
      auditTrail: logs
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};
