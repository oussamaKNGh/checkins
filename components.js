// =======================================
// COMPONENTS
// PC INSPECTION REPORT SYSTEM
// =======================================

// ==========================
// CARD
// ==========================

function createCard(title, content, subtitle = ""){

    return `
        <div class="card-box">
            <h3 class="mb-3">${title}</h3>
            ${subtitle ? `<div class="card-subtitle">${subtitle}</div>` : ""}
            ${content}
        </div>
    `;

}

// ==========================
// INPUT
// ==========================

function createInput(id, label, type = "text", placeholder = "", extraAttrs = ""){

    return `
        <div class="mb-3">
            <label class="form-label" for="${id}">${typeof t === "function" ? t(label) : label}</label>
            <input
                type="${type}"
                id="${id}"
                placeholder="${escapeHtml(typeof t === "function" ? t(placeholder) : placeholder)}"
                class="form-control"
                ${extraAttrs}
            >
        </div>
    `;

}

// ==========================
// SELECT
// ==========================

function createSelect(id, label, options = [], placeholder = ""){

    let html = `
        <div class="mb-3">
            <label class="form-label" for="${id}">${typeof t === "function" ? t(label) : label}</label>
            <select id="${id}" class="form-select">
    `;

    if(placeholder){

        html += `<option value="">${typeof t === "function" ? t(placeholder) : placeholder}</option>`;

    }

    options.forEach(option => {

        html += `<option value="${escapeHtml(option)}">${escapeHtml(typeof t === "function" ? t(option) : option)}</option>`;

    });

    html += `
            </select>
        </div>
    `;

    return html;

}

// ==========================
// TEXTAREA
// ==========================

function createTextarea(id, label, placeholder = ""){

    return `
        <div class="mb-3">
            <label class="form-label" for="${id}">${typeof t === "function" ? t(label) : label}</label>
            <textarea
                id="${id}"
                rows="5"
                placeholder="${escapeHtml(typeof t === "function" ? t(placeholder) : placeholder)}"
                class="form-control"
            ></textarea>
        </div>
    `;

}

// ==========================
// CONDITION / STATUS SELECT
// ==========================

function createStatus(id, label = "الحالة العامة"){

    return createSelect(id, label, DATA.condition, "اختر الحالة");

}

// ==========================
// BUTTON
// ==========================

function createButton(id, text, color = "primary", icon = ""){

    return `
        <button id="${id}" type="button" class="btn btn-${color}">
            ${icon ? `<i class="bi ${icon}"></i>` : ""}
            ${text}
        </button>
    `;

}

// ==========================
// ROW / COLUMN
// ==========================

function createRow(content){

    return `<div class="row g-3">${content}</div>`;

}

function createCol(content, size = 6){

    return `<div class="col-md-${size}">${content}</div>`;

}

// ==========================
// BADGE
// ==========================

function createBadge(condition){

    if(!condition) return `<span class="badge-condition badge-average">-</span>`;

    return `<span class="badge-condition ${badgeClassFor(condition)}">${escapeHtml(typeof t === "function" ? t(condition) : condition)}</span>`;

}

// ==========================
// CHECKLIST ITEM
// ==========================

function createChecklistItem(id, label, checked = false){

    return `
        <div class="checklist-item">
            <span>${escapeHtml(typeof t === "function" ? t(label) : label)}</span>
            <input type="checkbox" class="form-check-input checklist-input" id="${id}" ${checked ? "checked" : ""}>
        </div>
    `;

}

// ==========================
// PHOTO UPLOADER
// ==========================

function createUpload(id){

    return `
        <div id="${id}" class="dropzone">
            <i class="bi bi-cloud-arrow-up"></i>
            <div>اسحب الصور هنا أو اضغط للاختيار</div>
            <input type="file" id="${id}Input" multiple accept="image/*" hidden>
        </div>
        <div id="${id}Grid" class="photo-grid"></div>
    `;

}

// ==========================
// STAT CARD (Dashboard)
// ==========================

function createStatCard(icon, color, value, label){

    return `
        <div class="stat-card">
            <div class="icon" style="background:${color};">
                <i class="bi ${icon}"></i>
            </div>
            <div>
                <h2>${value}</h2>
                <p>${label}</p>
            </div>
        </div>
    `;

}

// ==========================
// SECTION SHORTCUT (Dashboard grid)
// ==========================

function createSectionShortcut(page, icon, label){

    return `
        <div class="section-grid-item" data-nav="${page}">
            <i class="bi ${icon}"></i>
            <div>${typeof t === "function" ? t(label) : label}</div>
        </div>
    `;

}

// ==========================
// RESULT TABLE ROW
// ==========================

function createResultRow(label, value){

    return `
        <tr>
            <th>${escapeHtml(label)}</th>
            <td>${value}</td>
        </tr>
    `;
}

// ==========================
// FORM SECTION
// ==========================

function createFormSection(title, icon, content, subtitle = ""){

    return createCard(

        `<i class="bi ${icon}"></i> ${title}`,

        createRow(content),

        subtitle

    );

}