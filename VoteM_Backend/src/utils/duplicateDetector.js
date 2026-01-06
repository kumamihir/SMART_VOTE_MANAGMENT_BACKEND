const voterApplication = require("../models/voterApplication");

exports.detectDuplicate = async ({level,application})=>{
    let query = {
        applicant: {$ne : application.applicant},
        status:{$ne: "REJECTED"}
    };
     if (level === "ERO") {
    query.assemblyConstituencyId = application.assemblyConstituencyId;
  }
  if (level === "DEO") {
    query.districtId = application.districtId;
  }
  if (level === "CEO") {
    query.stateId = application.stateId;
  }
  return await voterApplication.find(query);
}