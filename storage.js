// =========================================
// STORAGE ENGINE
// Persists the single `report` state object
// =========================================

function saveReport(){

    try{

        localStorage.setItem(REPORT_KEY, JSON.stringify(report));

    }catch(err){

        console.error("Failed to save report:", err);

    }

}

function loadReport(){

    const raw = localStorage.getItem(REPORT_KEY);

    if(!raw) return;

    try{

        const data = JSON.parse(raw);

        Object.keys(data).forEach(key=>{

            report[key] = data[key];

        });

    }catch(err){

        console.error("Failed to load report:", err);

    }

}

function clearReport(){

    if(!confirmAction("هل أنت متأكد من مسح التقرير بالكامل؟ لا يمكن التراجع عن هذا الإجراء.")) return;

    localStorage.removeItem(REPORT_KEY);

    location.reload();

}

document.addEventListener("DOMContentLoaded", ()=>{

    const clearBtn = $("clearReportBtn");

    if(clearBtn){

        clearBtn.addEventListener("click", clearReport);

    }

});