// =======================================
// UI ENGINE
// Toasts, autosave indicator, generic
// save/restore/bind logic for sections
// =======================================

// ==========================
// TOAST
// ==========================

function showToast(message, type = "success"){

    const container = $("toastContainer");

    if(!container) return;

    const colorMap = {
        success: "text-bg-success",
        danger: "text-bg-danger",
        warning: "text-bg-warning",
        info: "text-bg-primary"
    };

    const toastEl = document.createElement("div");

    toastEl.className = `toast align-items-center ${colorMap[type] || colorMap.success} border-0`;

    toastEl.setAttribute("role","alert");

    toastEl.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${escapeHtml(message)}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;

    container.appendChild(toastEl);

    const toast = new bootstrap.Toast(toastEl, { delay: 2200 });

    toast.show();

    toastEl.addEventListener("hidden.bs.toast", ()=> toastEl.remove());

}

// ==========================
// AUTOSAVE INDICATOR
// ==========================

const flashAutosave = debounce(function(){

    const el = $("autosaveIndicator");

    if(!el) return;

    el.classList.add("show");

    setTimeout(()=> el.classList.remove("show"), 1200);

    saveReport();

}, 250);

// ==========================
// SECTION SAVE / RESTORE / BIND
// ==========================

function saveSection(section, ids){

    if(!report[section]) report[section] = {};

    ids.forEach(id=>{

        const el = $(id);

        if(!el) return;

        if(el.type === "checkbox"){

            report[section][id] = el.checked;

        } else {

            report[section][id] = el.value;

        }

    });

    flashAutosave();

}

function restoreSection(section, ids){

    if(!report[section]) return;

    ids.forEach(id=>{

        const el = $(id);

        if(!el) return;

        const value = report[section][id];

        if(value === undefined) return;

        if(el.type === "checkbox"){

            el.checked = !!value;

        } else {

            el.value = value;

        }

    });

}

function bindSection(section, ids){

    ids.forEach(id=>{

        const el = $(id);

        if(!el) return;

        const handler = ()=> saveSection(section, ids);

        el.addEventListener("input", handler);

        el.addEventListener("change", handler);

    });

}

// ==========================
// CASCADING DROPDOWNS (e.g. CPU brand -> family -> model)
// ==========================

function fillSelect(selectEl, options, keepPlaceholder = false){

    if(!selectEl) return;

    const placeholderOption = keepPlaceholder ? selectEl.querySelector('option[value=""]') : null;

    selectEl.innerHTML = "";

    if(placeholderOption){

        selectEl.appendChild(placeholderOption);

    }

    options.forEach(opt=>{

        const optionEl = document.createElement("option");

        optionEl.value = opt;

        optionEl.textContent = opt;

        selectEl.appendChild(optionEl);

    });

}

// ==========================
// CONFIRM DIALOG WRAPPER
// ==========================

function confirmAction(message){

    return window.confirm(message);

}