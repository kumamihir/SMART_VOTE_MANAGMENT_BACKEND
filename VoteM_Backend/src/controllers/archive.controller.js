const VoterApplication = require("../models/voterApplication");
const { canTransition } = require("../utils/statusflow");
const { addAuditEntry } = require("../utils/auditLogger");

exports.archiveApplication = async (req, res) => {
  try {
    const { applicationId, remarks } = req.body;

    const application = await VoterApplication.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const allowed = canTransition({
      currentStatus: application.status,
      nextStatus: "ARCHIVED",
      userRole: req.user.role
    });

    if (!allowed) {
      return res.status(403).json({
        message: "Application cannot be archived in current state"
      });
    }

    application.status = "ARCHIVED";
    application.remarks = remarks || "Application archived";
    application.archivedAt = new Date();

    await application.save();

    await addAuditEntry({
      applicationId: application._id,
      userId: req.user.id,
      role: req.user.role,
      action: "ARCHIVED",
      remarks
    });

    return res.json({
      message: "Application archived successfully",
      applicationId: application._id,
      status: application.status
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
