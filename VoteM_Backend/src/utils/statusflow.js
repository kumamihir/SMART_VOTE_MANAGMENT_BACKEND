const STATUS_FLOW = {
  PENDING_BLO: {
    allowedRoles: ["BLO"],
    next: ["BLO_VERIFIED", "REJECTED"]
  },

  BLO_VERIFIED: {
    allowedRoles: ["ERO"],
    next: ["ERO_APPROVED", "REJECTED"]
  },

  ERO_APPROVED: {
    allowedRoles: ["SYSTEM", "ERO", "DEO", "CEO"],
    next: ["ARCHIVED"]
  },

  REJECTED: {
    allowedRoles: ["SYSTEM", "ERO", "DEO", "CEO"],
    next: ["ARCHIVED"]
  }
};

const canTransition = ({ currentStatus, nextStatus, userRole }) => {
  const rule = STATUS_FLOW[currentStatus];
  if (!rule) return false;

  if (!rule.next.includes(nextStatus)) return false;

  if (!rule.allowedRoles.includes(userRole)) return false;

  return true;
};

module.exports = { canTransition };
