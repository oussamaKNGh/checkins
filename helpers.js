// =======================================
// HELPERS
// Generic, reusable utility functions
// =======================================

function $(id){

    return document.getElementById(id);

}

function $all(selector, scope = document){

    return Array.from(scope.querySelectorAll(selector));

}

function escapeHtml(str){

    if(str === undefined || str === null) return "";

    return String(str)
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;")
        .replace(/"/g,"&quot;")
        .replace(/'/g,"&#39;");

}

function formatDateHuman(value){

    if(!value) return "-";

    const d = new Date(value);

    if(isNaN(d.getTime())) return value;

    return d.toLocaleDateString("en-GB");

}

function badgeClassFor(condition){

    return DATA.conditionBadgeMap[condition] || "badge-average";

}

function conditionToScore(condition){

    const map = {
        "ممتاز": 100,
        "جيد": 80,
        "متوسط": 60,
        "يحتاج صيانة": 35,
        "معطوب": 0
    };

    return map[condition] !== undefined ? map[condition] : null;

}

function clamp(value, min, max){

    return Math.max(min, Math.min(max, value));

}

function fileToBase64(file){

    return new Promise((resolve, reject)=>{

        const reader = new FileReader();

        reader.onload = () => resolve(reader.result);

        reader.onerror = reject;

        reader.readAsDataURL(file);

    });

}

function uid(prefix = "id"){

    return `${prefix}_${Date.now()}_${Math.floor(Math.random()*100000)}`;

}

function debounce(fn, delay = 300){

    let timer = null;

    return function(...args){

        clearTimeout(timer);

        timer = setTimeout(()=> fn.apply(this,args), delay);

    };

}
function $(id){
    return document.getElementById(id);
}