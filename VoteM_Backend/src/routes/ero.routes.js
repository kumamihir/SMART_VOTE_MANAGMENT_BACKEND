const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/authorizeRoles");
const {
  getVerifiedApplications,
  getStats,
  processApplication
} = require("../controllers/ero.controller");

router.get(
  "/applications",
  authMiddleware,
  authorizeRoles("ERO"),
  getVerifiedApplications
);

router.get(
  "/stats",
  authMiddleware,
  authorizeRoles("ERO"),
  getStats
);

router.post(
  "/process",
  authMiddleware,
  authorizeRoles("ERO"),
  processApplication
);

module.exports = router;
