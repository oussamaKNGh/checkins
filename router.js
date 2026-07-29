(function () {
    const pageTitles = {
        dashboard: "لوحة التحكم",
        customer: "معلومات الزبون",
        technician: "الفني",
        cpu: "المعالج",
        gpu: "كارت الشاشة",
        ram: "الرام",
        storage: "التخزين",
        motherboard: "اللوحة الأم",
        psu: "مزود الطاقة",
        cooling: "التبريد",
        pcCase: "الهيكل",
        monitor: "الشاشة",
        battery: "البطارية",
        ports: "المنافذ",
        network: "الشبكة",
        photos: "الصور",
        checklist: "قائمة الفحص",
        notes: "ملاحظات عامة",
        result: "النتيجة النهائية",
        pdf: "إنشاء PDF"
    };

    function normalizePage(page) {
        if (!page) return "dashboard";
        return page === "case" ? "pcCase" : page;
    }

    function getCurrentPage() {
        const hash = (window.location.hash || "").replace(/^#/, "");
        return normalizePage(hash || "dashboard");
    }

    function setPageTitle(page) {
        const titleEl = document.getElementById("pageTitle");
        if (titleEl) {
            titleEl.textContent = pageTitles[page] || pageTitles.dashboard;
        }
    }

    function setActivePage(page) {
        document.querySelectorAll(".sidebar li[data-page]").forEach((item) => {
            item.classList.toggle("active", item.dataset.page === page);
        });
    }

    function renderFormPage(config) {
        const page = document.getElementById("pageContent");
        if (!page) return;

        page.innerHTML = `
            <div class="card-box">
                <h3>
                    <i class="bi ${config.icon}"></i>
                    ${config.title}
                </h3>
                ${config.subtitle ? `<p class="card-subtitle">${config.subtitle}</p>` : ""}
                <div class="row g-3">
                    ${config.fields.join("")}
                </div>
            </div>
        `;

        if (config.section && config.ids) {
            restoreSection(config.section, config.ids);
            bindSection(config.section, config.ids);
        }
    }

    function renderDashboardPage() {
        const page = document.getElementById("pageContent");
        if (!page) return;

        const customerName = report.customer.customerName || "-";
        const technicianName = report.technician.techName || "-";
        const cpuModel = report.cpu.cpuModel || "-";
        const storageSize = report.storage.storageSize || "-";

        page.innerHTML = `
            <div class="card-box">
                <h3><i class="bi bi-speedometer2"></i> لوحة التحكم</h3>
                <div class="row g-3">
                    ${createCol(createStatCard("bi-person", "#0d6efd", customerName, "اسم الزبون"), 4)}
                    ${createCol(createStatCard("bi-person-badge", "#198754", technicianName, "اسم الفني"), 4)}
                    ${createCol(createStatCard("bi-cpu", "#6f42c1", cpuModel, "المعالج"), 4)}
                    ${createCol(createStatCard("bi-device-hdd", "#fd7e14", storageSize, "التخزين"), 4)}
                </div>
                <div class="section-grid mt-4">
                    ${createSectionShortcut("customer", "bi-person", "معلومات الزبون")}
                    ${createSectionShortcut("technician", "bi-person-badge", "الفني")}
                    ${createSectionShortcut("cpu", "bi-cpu", "المعالج")}
                    ${createSectionShortcut("gpu", "bi-gpu-card", "كارت الشاشة")}
                    ${createSectionShortcut("ram", "bi-memory", "الرام")}
                    ${createSectionShortcut("storage", "bi-device-hdd", "التخزين")}
                    ${createSectionShortcut("photos", "bi-images", "الصور")}
                    ${createSectionShortcut("checklist", "bi-list-check", "قائمة الفحص")}
                    ${createSectionShortcut("result", "bi-clipboard-check", "النتيجة النهائية")}
                    ${createSectionShortcut("pdf", "bi-file-earmark-pdf", "إنشاء PDF")}
                </div>
            </div>
        `;
    }

    function renderCustomerPage() {
        renderFormPage({
            icon: "bi-person",
            title: "معلومات الزبون",
            subtitle: "أدخل بيانات العميل الأساسية",
            section: "customer",
            ids: ["customerName", "customerPhone", "sellerName", "reportDate", "deviceType", "serialNumber", "customerNotes"],
            fields: [
                createCol(createInput("customerName", "اسم العميل"), 6),
                createCol(createInput("customerPhone", "رقم الهاتف", "tel"), 6),
                createCol(createInput("sellerName", "اسم البائع"), 6),
                createCol(createInput("reportDate", "تاريخ التقرير", "date"), 6),
                createCol(createInput("deviceType", "نوع الجهاز"), 6),
                createCol(createInput("serialNumber", "السيريال"), 6),
                createCol(createTextarea("customerNotes", "ملاحظات العميل"), 12)
            ]
        });
    }

    function renderTechnicianPage() {
        renderFormPage({
            icon: "bi-person-badge",
            title: "معلومات الفني",
            subtitle: "أدخل بيانات الفني الذي يقوم بالفحص",
            section: "technician",
            ids: ["techName", "techCompany", "techPhone", "inspectionDate", "techNotes"],
            fields: [
                createCol(createInput("techName", "اسم الفني"), 6),
                createCol(createInput("techCompany", "الشركة/المؤسسة"), 6),
                createCol(createInput("techPhone", "رقم الهاتف", "tel"), 6),
                createCol(createInput("inspectionDate", "تاريخ الفحص", "date"), 6),
                createCol(createTextarea("techNotes", "ملاحظات الفني"), 12)
            ]
        });
    }

    function initCpuCascade() {
        const brandEl = document.getElementById("cpuBrand");
        const familyEl = document.getElementById("cpuFamily");
        const modelEl = document.getElementById("cpuModel");

        if (!brandEl || !familyEl || !modelEl) return;

        function fillOptions(selectEl, options, keepPlaceholder = false) {
            if (!selectEl) return;

            const placeholder = keepPlaceholder ? selectEl.querySelector('option[value=""]') : null;
            selectEl.innerHTML = "";

            if (placeholder) {
                selectEl.appendChild(placeholder);
            }

            options.forEach((option) => {
                const optionEl = document.createElement("option");
                optionEl.value = option;
                optionEl.textContent = typeof t === "function" ? t(option) : option;
                selectEl.appendChild(optionEl);
            });
        }

        function updateFamilies() {
            const brand = brandEl.value;
            const families = brand && DATA.cpu[brand] ? Object.keys(DATA.cpu[brand]) : [];
            fillOptions(familyEl, families, true);
            fillOptions(modelEl, [], true);

            if (report.cpu.cpuFamily) {
                familyEl.value = report.cpu.cpuFamily;
            }

            updateModels();
        }

        function updateModels() {
            const brand = brandEl.value;
            const family = familyEl.value;
            const models = brand && family && DATA.cpu[brand] && DATA.cpu[brand][family] ? DATA.cpu[brand][family] : [];
            fillOptions(modelEl, models, true);

            if (report.cpu.cpuModel) {
                modelEl.value = report.cpu.cpuModel;
            }
        }

        brandEl.addEventListener("change", updateFamilies);
        familyEl.addEventListener("change", updateModels);
        updateFamilies();
    }

    function renderCpuPage() {
        const page = document.getElementById("pageContent");
        if (!page) return;

        page.innerHTML = `
            <div class="card-box">
                <h3><i class="bi bi-cpu"></i> المعالج</h3>
                <p class="card-subtitle">أدخل بيانات المعالج والتقييم</p>
                <div class="row g-3">
                    ${createCol(createSelect("cpuBrand", "العلامة التجارية", Object.keys(DATA.cpu), "اختر العلامة التجارية"), 6)}
                    ${createCol(createSelect("cpuFamily", "العائلة", [], "اختر العائلة"), 6)}
                    ${createCol(createSelect("cpuModel", "الموديل", [], "اختر الموديل"), 6)}
                    ${createCol(createStatus("cpuStatus", "الحالة العامة"), 6)}
                    ${createCol(createTextarea("cpuNotes", "ملاحظات المعالج"), 12)}
                </div>
            </div>
        `;

        restoreSection("cpu", ["cpuBrand", "cpuFamily", "cpuModel", "cpuStatus", "cpuNotes"]);
        bindSection("cpu", ["cpuBrand", "cpuFamily", "cpuModel", "cpuStatus", "cpuNotes"]);
        initCpuCascade();
    }

    function renderGpuPage() {
        renderFormPage({
            icon: "bi-gpu-card",
            title: "كارت الشاشة",
            subtitle: "أدخل معلومات بطاقة الرسومات",
            section: "gpu",
            ids: ["gpuBrand", "gpuModel", "gpuVram", "gpuTemp", "gpuStatus", "gpuNotes"],
            fields: [
                createCol(createInput("gpuBrand", "العلامة التجارية"), 6),
                createCol(createInput("gpuModel", "الموديل"), 6),
                createCol(createSelect("gpuVram", "سعة الذاكرة", DATA.gpuVram, "اختر سعة الذاكرة"), 6),
                createCol(createInput("gpuTemp", "درجة الحرارة", "number", "درجة الحرارة °C"), 6),
                createCol(createStatus("gpuStatus", "الحالة العامة"), 6),
                createCol(createTextarea("gpuNotes", "ملاحظات كارت الشاشة"), 12)
            ]
        });
    }

    function renderRamPage() {
        renderFormPage({
            icon: "bi-memory",
            title: "الرام",
            subtitle: "أدخل معلومات الذاكرة العشوائية",
            section: "ram",
            ids: ["ramSize", "ramType", "ramSpeed", "ramStatus", "ramNotes"],
            fields: [
                createCol(createSelect("ramSize", "السعة", DATA.ram.size, "اختر السعة"), 6),
                createCol(createSelect("ramType", "النوع", DATA.ram.type, "اختر النوع"), 6),
                createCol(createSelect("ramSpeed", "السرعة", DATA.ram.speed, "اختر السرعة"), 6),
                createCol(createStatus("ramStatus", "الحالة العامة"), 6),
                createCol(createTextarea("ramNotes", "ملاحظات الرام"), 12)
            ]
        });
    }

    function renderStoragePage() {
        renderFormPage({
            icon: "bi-device-hdd",
            title: "التخزين",
            subtitle: "أدخل معلومات وحدة التخزين",
            section: "storage",
            ids: ["storageType", "storageSize", "storageHealth", "storageStatus", "storageNotes"],
            fields: [
                createCol(createSelect("storageType", "النوع", DATA.storage.type, "اختر النوع"), 6),
                createCol(createSelect("storageSize", "السعة", DATA.storage.size, "اختر السعة"), 6),
                createCol(createInput("storageHealth", "الحالة الصحية", "number", "نسبة الصحة %"), 6),
                createCol(createSelect("storageStatus", "الحالة", DATA.condition, "اختر الحالة"), 6),
                createCol(createTextarea("storageNotes", "ملاحظات التخزين"), 12)
            ]
        });
    }

    function renderMotherboardPage() {
        renderFormPage({
            icon: "bi-motherboard",
            title: "اللوحة الأم",
            subtitle: "أدخل معلومات اللوحة الأم",
            section: "motherboard",
            ids: ["motherboardBrand", "motherboardChipset", "motherboardFormFactor", "motherboardStatus", "motherboardNotes"],
            fields: [
                createCol(createSelect("motherboardBrand", "العلامة التجارية", DATA.motherboard.brand, "اختر العلامة التجارية"), 6),
                createCol(createSelect("motherboardChipset", "الشيبست", DATA.motherboard.chipset, "اختر الشيبست"), 6),
                createCol(createSelect("motherboardFormFactor", "الشكل", DATA.motherboard.formFactor, "اختر الشكل"), 6),
                createCol(createStatus("motherboardStatus", "الحالة العامة"), 6),
                createCol(createTextarea("motherboardNotes", "ملاحظات اللوحة الأم"), 12)
            ]
        });
    }

    function renderPsuPage() {
        renderFormPage({
            icon: "bi-plug",
            title: "مزود الطاقة",
            subtitle: "أدخل معلومات مزود الطاقة",
            section: "psu",
            ids: ["psuBrand", "psuWattage", "psuCertification", "psuStatus", "psuNotes"],
            fields: [
                createCol(createSelect("psuBrand", "العلامة التجارية", DATA.psu.brand, "اختر العلامة التجارية"), 6),
                createCol(createSelect("psuWattage", "القدرة", DATA.psu.wattage, "اختر القدرة"), 6),
                createCol(createSelect("psuCertification", "الشهادة", DATA.psu.certification, "اختر الشهادة"), 6),
                createCol(createStatus("psuStatus", "الحالة العامة"), 6),
                createCol(createTextarea("psuNotes", "ملاحظات مزود الطاقة"), 12)
            ]
        });
    }

    function renderCoolingPage() {
        renderFormPage({
            icon: "bi-snow",
            title: "التبريد",
            subtitle: "أدخل معلومات نظام التبريد",
            section: "cooling",
            ids: ["coolingType", "coolingStatus", "coolingNotes"],
            fields: [
                createCol(createSelect("coolingType", "نوع التبريد", DATA.cooling.type, "اختر نوع التبريد"), 6),
                createCol(createStatus("coolingStatus", "الحالة العامة"), 6),
                createCol(createTextarea("coolingNotes", "ملاحظات التبريد"), 12)
            ]
        });
    }

    function renderCasePage() {
        renderFormPage({
            icon: "bi-box-seam",
            title: "الهيكل",
            subtitle: "أدخل معلومات الهيكل",
            section: "pcCase",
            ids: ["pcCaseType", "pcCaseStatus", "pcCaseNotes"],
            fields: [
                createCol(createSelect("pcCaseType", "نوع الهيكل", DATA.pcCase.type, "اختر نوع الهيكل"), 6),
                createCol(createStatus("pcCaseStatus", "الحالة العامة"), 6),
                createCol(createTextarea("pcCaseNotes", "ملاحظات الهيكل"), 12)
            ]
        });
    }

    function renderMonitorPage() {
        renderFormPage({
            icon: "bi-display",
            title: "الشاشة",
            subtitle: "أدخل معلومات الشاشة",
            section: "monitor",
            ids: ["monitorSize", "monitorResolution", "monitorPanel", "monitorStatus", "monitorNotes"],
            fields: [
                createCol(createSelect("monitorSize", "الحجم", DATA.monitor.size, "اختر الحجم"), 6),
                createCol(createSelect("monitorResolution", "الدقة", DATA.monitor.resolution, "اختر الدقة"), 6),
                createCol(createSelect("monitorPanel", "اللوحة", DATA.monitor.panel, "اختر نوع اللوحة"), 6),
                createCol(createStatus("monitorStatus", "الحالة العامة"), 6),
                createCol(createTextarea("monitorNotes", "ملاحظات الشاشة"), 12)
            ]
        });
    }

    function renderBatteryPage() {
        renderFormPage({
            icon: "bi-battery-half",
            title: "البطارية",
            subtitle: "أدخل معلومات البطارية",
            section: "battery",
            ids: ["batteryHealth", "batteryStatus", "batteryNotes"],
            fields: [
                createCol(createSelect("batteryHealth", "الحالة", DATA.battery.health, "اختر الحالة"), 6),
                createCol(createStatus("batteryStatus", "الحالة العامة"), 6),
                createCol(createTextarea("batteryNotes", "ملاحظات البطارية"), 12)
            ]
        });
    }

    function renderPortsPage() {
        renderFormPage({
            icon: "bi-usb-symbol",
            title: "المنافذ",
            subtitle: "أدخل المنافذ المتوفرة",
            section: "ports",
            ids: ["portsList", "portsStatus", "portsNotes"],
            fields: [
                createCol(createInput("portsList", "المنافذ المتوفرة"), 6),
                createCol(createStatus("portsStatus", "الحالة العامة"), 6),
                createCol(createTextarea("portsNotes", "ملاحظات المنافذ"), 12)
            ]
        });
    }

    function renderNetworkPage() {
        renderFormPage({
            icon: "bi-wifi",
            title: "الشبكة",
            subtitle: "أدخل معلومات الشبكة",
            section: "network",
            ids: ["networkWifi", "networkEthernet", "networkStatus", "networkNotes"],
            fields: [
                createCol(createSelect("networkWifi", "Wi-Fi", DATA.network.wifi, "اختر نوع الواي فاي"), 6),
                createCol(createSelect("networkEthernet", "Ethernet", DATA.network.ethernet, "اختر سرعة الشبكة"), 6),
                createCol(createStatus("networkStatus", "الحالة العامة"), 6),
                createCol(createTextarea("networkNotes", "ملاحظات الشبكة"), 12)
            ]
        });
    }

    function renderPhotosPage() {
        const page = document.getElementById("pageContent");
        if (!page) return;

        page.innerHTML = `
            <div class="card-box">
                <h3><i class="bi bi-images"></i> الصور</h3>
                <p class="card-subtitle">أضف صورًا للجهاز واللوحة والملحقات</p>
                ${createUpload("photosUpload")}
            </div>
        `;

        initPhotoUploader("photosUpload");
    }

    function renderChecklistPage() {
        const page = document.getElementById("pageContent");
        if (!page) return;

        const items = (DATA.checklist || []).map((item) => `
            <label class="checklist-item" for="${item.id}">
                <span>${escapeHtml(item.label)}</span>
                <input type="checkbox" class="form-check-input checklist-input" id="${item.id}" ${report.checklist[item.id] ? "checked" : ""}>
            </label>
        `).join("");

        page.innerHTML = `
            <div class="card-box">
                <h3><i class="bi bi-list-check"></i> قائمة الفحص</h3>
                <p class="card-subtitle">أكمل عناصر الفحص الأساسية</p>
                ${items}
            </div>
        `;

        page.querySelectorAll(".checklist-input").forEach((input) => {
            input.addEventListener("change", () => {
                report.checklist[input.id] = input.checked;
                flashAutosave();
            });
        });
    }

    function renderNotesPage() {
        renderFormPage({
            icon: "bi-journal-text",
            title: "ملاحظات عامة",
            subtitle: "اكتب أي ملاحظات أو ملاحظات إضافية",
            section: "notes",
            ids: ["generalNotes"],
            fields: [
                createCol(createTextarea("generalNotes", "الملاحظات العامة"), 12)
            ]
        });
    }

    function renderResultPage() {
        const page = document.getElementById("pageContent");
        if (!page) return;

        const filledCount = [
            report.customer.customerName,
            report.technician.techName,
            report.cpu.cpuStatus,
            report.gpu.gpuStatus,
            report.ram.ramStatus,
            report.storage.storageStatus,
            report.motherboard?.motherboardStatus,
            report.psu?.psuStatus
        ].filter(Boolean).length;

        const score = Math.min(100, Math.round((filledCount / 8) * 100));

        const rows = [
            createResultRow("العميل", report.customer.customerName || "-"),
            createResultRow("الفني", report.technician.techName || "-"),
            createResultRow("المعالج", report.cpu.cpuStatus || "-"),
            createResultRow("كارت الشاشة", report.gpu.gpuStatus || "-"),
            createResultRow("الرام", report.ram.ramStatus || "-"),
            createResultRow("التخزين", report.storage.storageStatus || "-")
        ].join("");

        page.innerHTML = `
            <div class="card-box">
                <h3><i class="bi bi-clipboard-check"></i> النتيجة النهائية</h3>
                <div class="score-ring-wrap mt-4">
                    <div class="score-ring" style="--pct:${score}">
                        <span>${score}</span>
                    </div>
                    <div class="text-muted">النتيجة الحالية بناءً على العناصر المكتملة</div>
                </div>
                <table class="result-table mt-4">
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
            </div>
        `;
    }

    function renderPdfPage() {
        const page = document.getElementById("pageContent");
        if (!page) return;

        page.innerHTML = `
            <div class="card-box">
                <h3><i class="bi bi-file-earmark-pdf"></i> إنشاء PDF</h3>
                <p class="card-subtitle">أنشئ ملف PDF شاملًا للتقرير</p>
                <button id="generatePdfBtn" class="btn btn-primary" type="button">
                    <i class="bi bi-file-earmark-pdf"></i>
                    إنشاء PDF
                </button>
            </div>
        `;

        const button = document.getElementById("generatePdfBtn");
        if (button) {
            button.addEventListener("click", async () => {
                try {
                    await generatePDF();
                    showToast("تم إنشاء ملف PDF بنجاح", "success");
                } catch (error) {
                    console.error(error);
                    showToast("فشل إنشاء ملف PDF", "danger");
                }
            });
        }
    }

    function renderPage(page) {
        const safePage = normalizePage(page);
        setPageTitle(safePage);
        setActivePage(safePage);

        const renderers = {
            dashboard: renderDashboardPage,
            customer: renderCustomerPage,
            technician: renderTechnicianPage,
            cpu: renderCpuPage,
            gpu: renderGpuPage,
            ram: renderRamPage,
            storage: renderStoragePage,
            motherboard: renderMotherboardPage,
            psu: renderPsuPage,
            cooling: renderCoolingPage,
            pcCase: renderCasePage,
            monitor: renderMonitorPage,
            battery: renderBatteryPage,
            ports: renderPortsPage,
            network: renderNetworkPage,
            photos: renderPhotosPage,
            checklist: renderChecklistPage,
            notes: renderNotesPage,
            result: renderResultPage,
            pdf: renderPdfPage
        };

        const renderer = renderers[safePage] || renderDashboardPage;
        renderer();
        if (typeof translateDOM === "function") translateDOM(document.getElementById("pageContent") || document.body);
    }

    function navigateTo(page) {
        const safePage = normalizePage(page);
        window.location.hash = `#${safePage}`;
        renderPage(safePage);
    }

    function bindSidebarNavigation() {
        document.querySelectorAll(".sidebar li[data-page]").forEach((item) => {
            item.addEventListener("click", () => {
                if (item.dataset.page) {
                    navigateTo(item.dataset.page);
                }
            });
        });

        // Dashboard shortcuts (e.g. "معلومات الزبون", "الفني", "المعالج")
        // use data-nav instead of sidebar data-page.
        document.addEventListener("click", (event) => {
            const shortcut = event.target.closest("[data-nav]");
            if (!shortcut) return;

            const page = shortcut.getAttribute("data-nav");
            if (page) navigateTo(page);
        });
    }

    function initRouter() {
        bindSidebarNavigation();

        window.addEventListener("hashchange", () => {
            renderPage(getCurrentPage());
        });

        renderPage(getCurrentPage());
    }

    window.initRouter = initRouter;
    window.navigateToPage = navigateTo;
    window.renderPage = renderPage;
})();
