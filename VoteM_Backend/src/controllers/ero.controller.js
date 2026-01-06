const VoterApplication = require("../models/voterApplication");
const { canTransition } = require("../utils/statusFlow");
const { addAuditEntry } = require("../utils/auditLogger");
const {detectDuplicate} = require("../utils/duplicateDetector");

exports.getVerifiedApplications = async (req, res) => {
  try {
    const applications = await VoterApplication.find({
      status: "BLO_VERIFIED"
    })
      .populate("applicant", "name email")
      .sort({ verifiedAt: -1 });

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
    const [verified, approved, rejected] = await Promise.all([
      VoterApplication.countDocuments({ status: "BLO_VERIFIED" }),
      VoterApplication.countDocuments({ status: "ERO_APPROVED" }),
      VoterApplication.countDocuments({ status: "REJECTED" })
    ]);

    return res.json({
      verified,
      approved,
      rejected
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.processApplication = async (req, res) => {
  try {
    const { applicationId, action, remarks } = req.body;

    const application = await VoterApplication.findById(applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (!["APPROVE", "REJECT"].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    const nextStatus =
      action === "APPROVE" ? "ERO_APPROVED" : "REJECTED";

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

    //ero duplicate scenes
    const duplicates = await detectDuplicate({
      level:"ERO",
      application
    });

    if(duplicates.length>0){
      application.isDuplicate = true;
    }


    application.status = nextStatus;
    application.approvedByERO = req.user.id;
    application.approvedAt = new Date();
    application.remarks = remarks;
    await application.save();

    await addAuditEntry({
     applicationId:application._id,
     userId:req.user.id,
      role: "ERO",
      action: nextStatus,
      remarks
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
