const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/authorizeRoles");
const { archiveApplication } = require("../controllers/archive.controller");

router.post(
  "/",
  authMiddleware,
  authorizeRoles("ERO", "DEO", "CEO"),
  archiveApplication
);

module.exports = router;
