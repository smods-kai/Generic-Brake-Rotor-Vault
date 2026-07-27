//====================================================
//
// RotorVault RC5
// Health Report
//
//====================================================

//----------------------------------------------------
// Render Report
//----------------------------------------------------

function renderHealthReport(report){

    updateHealthScore(report);

    updateRepositoryStatus(report);

    document.getElementById("healthErrors").textContent =
    report.errors;

    document.getElementById("healthWarnings").textContent =
    report.warnings;

    document.getElementById("healthPassed").textContent =
    report.passed;

    updateRepositorySummary(report);
    updateHealthList(report);
    renderGroupedIssues(report);


}

//----------------------------------------------------
// Repository Status
//----------------------------------------------------

function updateRepositoryStatus(report){

    const icon =

        document.getElementById(

            "repositoryStatusIcon"

        );

    const title =

        document.getElementById(

            "repositoryStatusTitle"

        );

    const message =

        document.getElementById(

            "repositoryStatusMessage"

        );

    const panel =

        document.getElementById(

            "repositoryStatus"

        );

    if(report.errors > 0){

        icon.textContent = "🔴";

        title.textContent = "Critical";

        message.textContent =

            `${report.errors} critical issue(s) detected. Publishing is not recommended.`;

        panel.style.borderLeftColor = "#EF4444";

    }

    else if(report.warnings > 0){

        icon.textContent = "🟡";

        title.textContent = "Needs Attention";

        message.textContent =

            `${report.warnings} warning(s) require review before publishing.`;

        panel.style.borderLeftColor = "#FACC15";

    }

    else{

        icon.textContent = "🟢";

        title.textContent = "Healthy";

        message.textContent =

            "Repository is ready for publishing.";

        panel.style.borderLeftColor = "#22C55E";

    }

}

//----------------------------------------------------
// Health Score
//----------------------------------------------------

function updateHealthScore(report){

    const percent =

        document.getElementById("healthPercent");

    const fill =

        document.getElementById("healthFill");

    if(percent){

        percent.textContent =

            `${report.score}%`;

    }

    if(fill){

        fill.style.width =

            `${report.score}%`;

    }

    if(percent){

        if(report.score >= 90){

            percent.style.color = "#4ADE80";

        }

        else if(report.score >= 70){

            percent.style.color = "#FACC15";

        }

        else{

            percent.style.color = "#EF4444";

        }

    }

}

//----------------------------------------------------
// Issue List
//----------------------------------------------------

function updateIssueList(report){

    const container =

        document.getElementById(

            "healthIssuesList"

        );

    if(!container) return;

    container.innerHTML = "";

    //------------------------------------------------
    // No Issues
    //------------------------------------------------

    if(report.items.length===0){

        container.innerHTML=

        `

        <div class="health-empty">

            Repository is healthy.

            No issues found.

        </div>

        `;

        return;

    }

    //------------------------------------------------
    // Build Issues
    //------------------------------------------------

    report.items.forEach(issue=>{

        const card =

            document.createElement("div");

        card.className =

            `health-issue ${issue.type}`;

        card.innerHTML =

`

<div class="health-issue-header">

    <div class="health-issue-title">

        ${issue.title}

    </div>

    <span class="health-badge ${issue.type}">

        ${issue.type.toUpperCase()}

    </span>

    </div>

        <div class="health-folder">

        📁 ${issue.folder || "Unknown"}

    </div>

<div class="health-details">

    <div>

        <strong>Field</strong>

        <span>${issue.field ?? "-"}</span>

    </div>

    <div>

        <strong>Current</strong>

        <span>${issue.current ?? "-"}</span>

    </div>

    <div>

        <strong>Expected</strong>

        <span>${issue.expected ?? "-"}</span>

    </div>

</div>

<div class="health-issue-message">

    ${issue.message}

</div>

${renderRecommendation(issue)}

    `;

        container.appendChild(card);

    });

}

//----------------------------------------------------
// Group Scan Results
//----------------------------------------------------

function renderGroupedIssues(report){

    const container =

        document.getElementById(

            "healthIssuesList"

        );

    if(!container) return;

    container.innerHTML = "";

    const groups = [

        {

            name:"Database",

            keywords:[

                "Database",

                "Missing Field",

                "Invalid Group"

            ]

        },

        {

            name:"Folders",

            keywords:[

                "Folder",

                "Duplicate Folder"

            ]

        },

        {

            name:"Images",

            keywords:[

                "Image",

                "Image Count",

                "Missing Image"

            ]

        },

        {

            name:"Naming",

            keywords:[

                "Prefix",

                "Naming"

            ]

        },

        {

            name:"Cross Check",

            keywords:[

                "Cross"

            ]

        },

        {

            name:"Repository Structure",

            keywords:[

                "Repository Structure"

            ]

        }

    ];

groups.forEach(group=>{

    const issues =

        report.items.filter(issue=>

            group.keywords.some(keyword=>

                issue.title.includes(keyword)

            )

        );

        const card =

            document.createElement("div");

        card.className =

            "health-group";

    card.innerHTML =

`

<div class="health-group-header">

    <div class="health-group-title">

        <span class="health-arrow">

            ▼

        </span>

        <span>

            ${group.name}

        </span>

    </div>

    <div class="health-group-status">

        ${

            issues.length===0

            ? "🟢 Healthy"

            : `🔴 ${issues.length} Issue${issues.length>1?"s":""}`

        }

    </div>

</div>

<div class="health-group-body">

    ${

        issues.length

        ?

        issues

            .map(buildIssueModel)

            .map(renderIssueCard)

            .join("")

        :

        `

        <div class="health-empty">

            No issues found.

        </div>

        `

    }

</div>

`;

container.appendChild(card);

    const header =

    card.querySelector(".health-group-header");

const body =

    card.querySelector(".health-group-body");

const arrow =

    card.querySelector(".health-arrow");

body.style.display = "none";

header.onclick = ()=>{

    const expanded =

        body.style.display==="block";

    body.style.display =

        expanded ? "none":"block";

    arrow.textContent =

        expanded ? "▼":"▲";

};

    });

}

//----------------------------------------------------
// Build Issue Model
//----------------------------------------------------

function buildIssueModel(issue){

    return{

        title:

            issue.title,

        type:

            issue.type,

        folder:

            issue.folder || "-",

        field:

            issue.field || "-",

        current:

            issue.current || "-",

        expected:

            issue.expected || "-",

        reason:

            issue.reason ||

            issue.message ||

            "-",

        recommendation:

            issue.recommendation ||

            ""

    };

}

//----------------------------------------------------
// Issue Card
//----------------------------------------------------

function renderIssueCard(issue){

    return `

    <div class="health-issue ${issue.type}">

        <div class="health-issue-title">

            ${issue.title}

        </div>

        <div class="health-folder">

            📁 ${issue.folder || "-"}

        </div>

        <div class="health-details">

            <div>

                <strong>Field</strong>

                <span>

                    ${issue.field ?? "-"}

                </span>

            </div>

            <div>

                <strong>Current</strong>

                <span>

                    ${issue.current ?? "-"}

                </span>

            </div>

            <div>

                <strong>Expected</strong>

                <span>

                    ${issue.expected ?? "-"}

                </span>

            </div>

        </div>

        <div class="health-issue-message">

            ${issue.reason}

        </div>

    </div>

    `;

}

//----------------------------------------------------
// Recommendation
//----------------------------------------------------

function renderRecommendation(issue){

    if(!issue.recommendation){

        return "";

    }

    return `

    <div class="health-recommendation">

        <strong>

            Recommendation

        </strong>

        <div>

            ${issue.recommendation}

        </div>

    </div>

    `;

}

//----------------------------------------------------
// Repository Summary
//----------------------------------------------------

function updateRepositorySummary(report){

    const totalSets =

        Array.isArray(getDatabase())

        ? getDatabase().length

        : 0;

    document.getElementById("summarySets").textContent =

        totalSets.toLocaleString();

    document.getElementById("summaryImages").textContent =

        (totalSets * 7).toLocaleString();

    document.getElementById("summaryTime").textContent =

        `${((performance.now())/1000).toFixed(2)} sec`;

}

//----------------------------------------------------
// Validation List
//----------------------------------------------------

function updateHealthList(report){

    const list =

        document.getElementById("healthList");

    if(!list) return;

    list.innerHTML = "";

    const rows = [

    {
        icon:"🗄",
        label:"Database",
        status:"HEALTHY"
    },

    {
        icon:"📁",
        label:"Folders",
        status:"HEALTHY"
    },

    {
        icon:"🖼",
        label:"Images",
        status:
            report.items.some(
                item =>
                    item.title.includes("Image")
            )
            ? "ISSUES"
            : "HEALTHY"
    },

    {
        icon:"🏷",
        label:"Naming",
        status:
            report.items.some(
                item =>
                    item.title.includes("Prefix") ||
                    item.title.includes("Naming")
            )
            ? "ISSUES"
            : "HEALTHY"
    },

    {
        icon:"🔄",
        label:"Cross Check",
        status:"HEALTHY"
    },

    {
        icon:"🧩",
        label:"Repository Structure",
        status:"HEALTHY"
    }

];

    const validatorMap = {

    "Database":[
        "Database",
        "Missing Field",
        "Invalid Group"
    ],

    "Folders":[
        "Duplicate Folder",
        "Folder Naming",
        "Folder Format"
    ],

    "Images":[
        "Image Count",
        "Invalid Image Count",
        "Missing Image"
    ],

    "Naming":[
        "Duplicate Prefix",
        "Prefix Format",
        "Invalid Prefix"
    ],

    "Cross Check":[
        "Cross Validation"
    ],

    "Repository Structure":[
        "Repository Structure"
    ]

};

    rows.forEach(row=>{

        const item =

            document.createElement("div");

        item.className =

            "health-item";

    item.innerHTML =

    `

    <div class="health-item-left">

        <span class="health-icon">

            ${row.icon}

        </span>

        <span class="health-name">

            ${row.label}

        </span>

    </div>

    <div class="health-result">

    ${

        report.items.some(issue =>

            validatorMap[row.label]?.includes(issue.title)

        )

        ? "🔴 Issues"

        : "🟢 Healthy"

    }

    </div>

    `;
        list.appendChild(item);

    });

}