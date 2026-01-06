const STATUS_FLOW = {
    PENDING_BLO:{
        role: "BLO",
        next:["BLO_VERIFIED","REJECTED"],
    },

    BLO_VERIFIED:{
        role:"ERO",
        next:[
            "ERO_APPROVED","REJECTED"
        ],
    },
    ERO_APPROVED:{
        role:"SYSTEM",
        next:["ARCHIVED"],
    },
    REJECTED:{
        role:"SYSTEM",
        next:["ARCHIVED"],
    },
};

const canTransistion = ({currentstatus, nextStatus, userRole })=>{
    const rule = STATUS_FLOW[currentstatus];

    if(!rule) return false;

    if(rule.role != userRole && rule.role != "SYSTEM"){
        return false;
    }
    return rule.next.includes(nextStatus);
};

module.exports = {canTransistion};