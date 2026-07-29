function renderForm(config){

    const page = $("pageContent");

    page.innerHTML = `

    <div class="card-box">

        <h3>

            <i class="bi ${config.icon}"></i>

            ${config.title}

        </h3>

        <p class="card-subtitle">

            ${config.subtitle ?? ""}

        </p>

        <div class="row g-3">

            ${config.fields.join("")}

        </div>

    </div>

    `;

    restoreSection(config.section,config.ids);

    bindSection(config.section,config.ids);

}

function renderRAM(){

    const page = $("pageContent");

    page.innerHTML = createFormSection(

        "Memory (RAM)",

        "bi-memory",

        createCol(
            createSelect(
                "ramSize",
                "Capacity",
                DATA.ram.size,
                "Select Capacity"
            )
        )

        +

        createCol(
            createSelect(
                "ramType",
                "Type",
                DATA.ram.type,
                "Select Type"
            )
        )

        +

        createCol(
            createSelect(
                "ramSpeed",
                "Speed",
                DATA.ram.speed,
                "Select Speed"
            )
        )

        +

        createCol(
            createStatus(
                "ramCondition"
            )
        )

        +

        createCol(
            createTextarea(
                "ramNotes",
                "Notes"
            ),
            12
        ),

        "RAM Information"

    );

    const ids=[
        "ramSize",
        "ramType",
        "ramSpeed",
        "ramCondition",
        "ramNotes"
    ];

    restoreSection("ram",ids);
    bindSection("ram",ids);

}