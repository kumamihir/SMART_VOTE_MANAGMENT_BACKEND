const VoterApplication = require("../models/voterApplication");
const { canTransition } = require("../utils/statusFlow");
const { addAuditEntry } = require("../utils/auditLogger");
const {detectDuplicate} = require("../utils/duplicateDetector")

exports.getPendingApplications = async (req, res) => {
  try {
    const applications = await VoterApplication.find({
      status: "PENDING",
    })
      .populate("applicant", "name email")
      .sort({ createdAt: -1 });

    return res.json({
      count: applications.length,
      applications,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const [pending, verified, rejected] = await Promise.all([
      VoterApplication.countDocuments({ status: "PENDING" }),
      VoterApplication.countDocuments({ status: "BLO_VERIFIED" }),
      VoterApplication.countDocuments({ status: "REJECTED" }),
    ]);

    return res.json({
      pending,
      verified,
      rejected,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.verifyApplication = async (req, res) => {
  try {
    const { applicationId, action, remarks } = req.body;

    if (!["VERIFY", "REJECT"].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    const application = await VoterApplication.findById(applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const nextStatus =
      action === "VERIFY" ? "BLO_VERIFIED" : "REJECTED";

    const allowed = canTransition({
      currentStatus: application.status,
      nextStatus,
      userRole: req.user.role,
    });

    if (!allowed) {
      return res.status(403).json({
        message: "You are not allowed to perform this action",
      });
    }

    //dupliucate scene
    const duplicates = await detectDuplicate({
      level: "BLO",
      application
    });

    if(duplicates.length>0){
      application.isDuplicate = true;
    }

    application.status = nextStatus;
    application.verifiedByBLO = req.user.id;
    application.verifiedAt = new Date();
    application.remarks = remarks;

     await application.save();
    addAuditEntry({
      application,
      role: "BLO",
      action: nextStatus,
      remarks,
    });
    return res.json({
      message: `Application ${nextStatus}`,
      applicationId: application._id,
      status: application.status,
      duplicateFound:application.isDuplicate===true
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
