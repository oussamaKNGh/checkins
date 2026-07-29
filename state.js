// =======================================
// GLOBAL report
// =======================================

const REPORT_KEY = "pc_report_v2";

const report = {

    customer: {},

    technician: {},

    cpu: {},

    gpu: {},

    ram: {},

    storage: {},

    motherboard: {},

    psu: {},

    cooling: {},

    pcCase: {},

    monitor: {},

    battery: {},

    ports: {},

    network: {},

    checklist: {},

    notes: {},

    photos: [],

    score: {}

};

let currentPage = "dashboard";

function resetReport(){

    Object.keys(report).forEach(key=>{

        if(Array.isArray(report[key])){

            report[key] = [];

        } else {

            report[key] = {};

        }

    });

}