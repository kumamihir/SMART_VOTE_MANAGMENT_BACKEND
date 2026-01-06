const VoterApplication = require("../models/voterApplication");
const { addAuditEntry } = require("../utils/auditLogger");

exports.submitApplication = async (req, res) => {
  try {
    const userId = req.user.id;
    const { formType, details } = req.body;

    if (!formType || !details) {
      return res.status(400).json({
        message: "formType aur details required hain"
      });
    }

    const application = new VoterApplication({
      applicant: userId,
      formType,
      address: details.address,
      boothId: details.boothId,
      assemblyConstituencyId: details.assemblyConstituencyId,
      districtId: details.districtId,
      stateId: details.stateId,
      status: "PENDING_BLO"
    });

    await application.save();

    // ✅ Correct audit logging (separate collection)
    await addAuditEntry({
      applicationId: application._id,
      userId: userId,
      role: "VOTER",
      action: "SUBMITTED",
      remarks: "Voter application submitted"
    });

    return res.status(201).json({
      message: "Application submitted successfully",
      applicationId: application._id,
      status: application.status
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};
