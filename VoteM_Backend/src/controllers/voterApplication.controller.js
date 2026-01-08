const VoterApplication = require("../models/voterApplication");
const { addAuditEntry } = require("../utils/auditLogger");

exports.submitApplication = async (req, res) => {
  try {
    const userId = req.user.id;
    const { formType, formData } = req.body;

    if (!formType || !formData) {
      return res.status(400).json({
        message: "formType aur formData required hain"
      });
    }

    const application = new VoterApplication({
      applicant: userId,
      formType,

      address: formData.address,
      boothId: formData.boothId,
      assemblyConstituencyId: formData.assemblyConstituencyId,
      districtId: formData.districtId,
      stateId: formData.stateId,

      formData,                
      status: "PENDING_BLO"
    });

    await application.save();

    await addAuditEntry({
      applicationId: application._id,
      userId,
      role: "VOTER",
      action: "SUBMITTED",
      remarks: `${formType} submitted`
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
