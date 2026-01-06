const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const authorizeRole = require("../middleware/role.middleware");
const {
  submitApplication
} = require("../controllers/voterApplication.controller");

router.post(
  "/apply",
  authMiddleware,
  authorizeRole("VOTER"),
  submitApplication
);

module.exports = router;
