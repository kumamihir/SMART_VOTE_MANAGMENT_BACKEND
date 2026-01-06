const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/authorizeRoles");

const{
    getApplicationAuditTrail
}=require("../controllers/audit.controller");

router.get(
    "/:applicationId",
    authMiddleware,
    authorizeRoles("BLO","ERO","DEO","CEO"),
    getApplicationAuditTrail
)

module.exports = router;