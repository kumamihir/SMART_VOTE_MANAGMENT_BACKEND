const mongoose = require("mongoose");

const voterApplicationSchema = new mongoose.Schema(
  {
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    },

    formType: {
      type: String,
      enum: ["FORM_6", "FORM_7", "FORM_8"],
      required: true
    },

    address: {
      type: String,
      required: true
    },

    boothId: {
      type: String,
      required: true
    },

    assemblyConstituencyId: {
      type: String,
      required: true
    },

    districtId: {
      type: String,
      required: true
    },

    stateId: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: [
        "DRAFT",
        "PENDING_BLO",
        "BLO_VERIFIED",
        "ERO_APPROVED",
        "REJECTED",
        "ARCHIVED"
      ],
      default: "PENDING_BLO"
    },

    assignedBLO: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    },

    verifiedBLO: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    },

    verifiedAt: Date,

    isDuplicate: {
      type: Boolean,
      default: false
    },

    remarks: String,
    rejectionReason: String,

    auditTrail: [
      {
        role: {
          type: String,
          enum: ["VOTER", "BLO", "ERO"],
          required: true
        },
        action: {
          type: String,
          required: true
        },
        remarks: String,
        performedAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("VoterApplication", voterApplicationSchema);
