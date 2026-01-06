const AuditLog = require("../models/auditLog");

const addAuditEntry = async ({ applicationId, userId, role, action, remarks }) => {
  await AuditLog.create({
    application: applicationId,
    performedBy: userId,
    role,
    action,
    remarks
  });
};

module.exports = { addAuditEntry };
