const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const authorizeRole = require("../middleware/role.middleware");
const {
  getPendingApplications,
  getStats,
  verifyApplication
} = require("../controllers/blo.controller");

router.get(
  "/applications",
  authMiddleware,
  authorizeRole("BLO"),
  getPendingApplications
);

router.get(
  "/stats",
  authMiddleware,
  authorizeRole("BLO"),
  getStats
);

router.post(
  "/verify",
  authMiddleware,
  authorizeRole("BLO"),
  verifyApplication
);

module.exports = router;
