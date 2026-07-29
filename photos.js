// =======================================
// PHOTOS ENGINE
// Drag & drop upload, preview, removal
// =======================================

function initPhotoUploader(zoneId){

    const zone = $(zoneId);

    const input = $(`${zoneId}Input`);

    const grid = $(`${zoneId}Grid`);

    if(!zone || !input || !grid) return;

    renderPhotoGrid(grid);

    zone.addEventListener("click", ()=> input.click());

    input.addEventListener("change", (e)=>{

        handleFiles(e.target.files, grid);

        input.value = "";

    });

    ["dragenter","dragover"].forEach(evt=>{

        zone.addEventListener(evt, (e)=>{

            e.preventDefault();

            e.stopPropagation();

            zone.classList.add("dragover");

        });

    });

    ["dragleave","drop"].forEach(evt=>{

        zone.addEventListener(evt, (e)=>{

            e.preventDefault();

            e.stopPropagation();

            zone.classList.remove("dragover");

        });

    });

    zone.addEventListener("drop", (e)=>{

        const files = e.dataTransfer.files;

        handleFiles(files, grid);

    });

}

async function handleFiles(fileList, grid){

    const files = Array.from(fileList).filter(f=> f.type.startsWith("image/"));

    if(files.length === 0) return;

    for(const file of files){

        try{

            const base64 = await fileToBase64(file);

            report.photos.push({

                id: uid("photo"),

                name: file.name,

                data: base64

            });

        }catch(err){

            console.error("Failed to read photo:", err);

        }

    }

    renderPhotoGrid(grid);

    flashAutosave();

    showToast(`${typeof t === "function" ? t("تمت إضافة") : "تمت إضافة"} ${files.length} ${typeof t === "function" ? t("صورة") : "صورة"}`, "success");

}

function renderPhotoGrid(grid){

    if(!grid) return;

    if(!report.photos || report.photos.length === 0){

        grid.innerHTML = `<div class="text-muted small mt-2">${typeof t === "function" ? t("لم يتم إضافة صور بعد") : "لم يتم إضافة صور بعد"}</div>`;

        return;

    }

    grid.innerHTML = report.photos.map(photo => `
        <div class="photo-thumb" data-photo-id="${photo.id}">
            <img src="${photo.data}" alt="${escapeHtml(photo.name)}">
            <button type="button" class="remove-photo" data-remove="${photo.id}">
                <i class="bi bi-x"></i>
            </button>
        </div>
    `).join("");

    grid.querySelectorAll("[data-remove]").forEach(btn=>{

        btn.addEventListener("click", (e)=>{

            e.stopPropagation();

            const id = btn.dataset.remove;

            removePhoto(id, grid);

        });

    });

}

function removePhoto(id, grid){

    report.photos = report.photos.filter(p => p.id !== id);

    renderPhotoGrid(grid);

    flashAutosave();

}