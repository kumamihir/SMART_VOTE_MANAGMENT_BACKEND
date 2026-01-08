const FORM_RULES = {
  FORM_6: {
    required: [
      "fullName",
      "dob",
      "gender",
      "address",
      "stateId",
      "districtId",
      "assemblyConstituencyId",
      "boothId",
      "email",
      "mobile"
    ]
  },

  FORM_7: {
    required: [
      "reason",
      "existingVoterId",
      "address",
      "stateId",
      "districtId",
      "assemblyConstituencyId"
    ]
  },

  FORM_8: {
    required: [
      "existingVoterId",
      "fieldsToUpdate",
      "address",
      "stateId",
      "districtId",
      "assemblyConstituencyId"
    ]
  }
};

const validateFormData = ({ formType, formData }) => {
  const rules = FORM_RULES[formType];

  if (!rules) {
    return {
      valid: false,
      message: "Invalid form type"
    };
  }

  const missingFields = rules.required.filter(
    field => !formData || !formData[field]
  );

  if (missingFields.length > 0) {
    return {
      valid: false,
      message: `Missing required fields: ${missingFields.join(", ")}`
    };
  }

  return { valid: true };
};

module.exports = { validateFormData };
