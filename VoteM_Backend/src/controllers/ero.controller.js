const VoterApplication = require("../models/voterApplication");
const { canTransition } = require("../utils/statusFlow");
const { addAuditEntry } = require("../utils/auditLogger");
const { detectDuplicate } = require("../utils/duplicateDetector");

exports.getVerifiedApplications = async (req, res) => {
  try {
    const applications = await VoterApplication.find({
      status: "BLO_VERIFIED"
    })
      .populate("applicant", "name email")
      .sort({ createdAt: -1 });

    return res.json({
      count: applications.length,
      applications
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const [pending, approved, rejected] = await Promise.all([
      VoterApplication.countDocuments({ status: "BLO_VERIFIED" }),
      VoterApplication.countDocuments({ status: "ERO_APPROVED" }),
      VoterApplication.countDocuments({ status: "REJECTED" })
    ]);

    return res.json({ pending, approved, rejected });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.processApplication = async (req, res) => {
  try {
    const { applicationId, action, remarks } = req.body;

    if (!["APPROVE", "REJECT"].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    const application = await VoterApplication.findById(applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    
    if (action === "APPROVE") {
      const duplicates = await detectDuplicate({
        level: "ERO",
        application
      });

      if (duplicates.length > 0) {
        application.status = "REJECTED";
        application.isDuplicate = true;
        application.rejectionReason =
          "Duplicate voter detected at Assembly level";

        await application.save();

        await addAuditEntry({
          applicationId: application._id,
          userId: req.user.id,
          role: "ERO",
          action: "DUPLICATE_FOUND",
          remarks: "Auto-rejected due to assembly-level duplicate"
        });

        return res.status(409).json({
          message: "Duplicate voter found. Application rejected.",
          duplicatesCount: duplicates.length
        });
      }
    }

    
    const nextStatus =
      action === "APPROVE" ? "ERO_APPROVED" : "REJECTED";

    const allowed = canTransition({
      currentstatus: application.status,
      nextStatus,
      userRole: req.user.role
    });

    if (!allowed) {
      return res.status(403).json({
        message: "You are not allowed to perform this action"
      });
    }

    application.status = nextStatus;
    application.approvedByERO = req.user.id;
    application.approvedAt = new Date();
    application.remarks = remarks;

    await application.save();

    await addAuditEntry({
      applicationId: application._id,
      userId: req.user.id,
      role: "ERO",
      action: nextStatus,
      remarks
    });

    return res.json({
      message: `Application ${nextStatus}`,
      applicationId: application._id,
      status: application.status
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
