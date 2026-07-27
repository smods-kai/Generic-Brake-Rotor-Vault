//====================================================
//
// RotorVault Processor v2
// rename.js
//
//====================================================

let renameItem = null;

let lastPrefix = "v2";

let dialogPosition = {

    x:null,

    y:null

};

let exportFolderHandle = null;

//----------------------------------------------------
// Export Button Animation
//----------------------------------------------------

const exportButton =
    document.getElementById("renameDownload");

function setButtonState(

    state,

    progress = 0,

    text = ""

){

    exportButton.className = "";

    exportButton.id = "renameDownload";

    exportButton.classList.add(state);

    exportButton.disabled =

        state !== "idle";

    const span =

        exportButton.querySelector("span");

    animateButtonProgress(progress);

    exportButton.style.setProperty(

        "--fill",

        progress + "%"

    );

    changeButtonText(

        state,

        text

    );

}

function setExportSuccess(){

    setButtonState("success",100);

    setTimeout(

        resetExportButton,

        1000

    );

}

function setExportError(){

    exportButton.classList.remove("exporting");

    exportButton.classList.add("error");

    exportButton.querySelector("span").textContent =

        "✖ Export Failed";

    exportButton.disabled = false;

    setTimeout(resetExportButton,1800);

}

function resetExportButton(){

    currentProgress = 0;

    animateButtonProgress(0);

    setButtonState("idle");

    document.getElementById("batchName").disabled = false;

    document.getElementById("prefixName").disabled = false;

    document.getElementById("selectFolder").disabled = false;

    document.getElementById("rememberFolder").disabled = false;

    document.querySelectorAll(

        'input[name="downloadMode"]'

    ).forEach(r=>r.disabled=false);

    document.getElementById("closeRename").disabled = false;

}

//----------------------------------------------------
// Button Text Animation
//----------------------------------------------------

let buttonTextTimer = null;

function changeButtonText(

    state,

    text = ""

){

    const span =

        exportButton.querySelector(

            "span"

        );

    span.style.opacity = "0";

    span.style.transform =

        "translateY(6px)";

    clearTimeout(buttonTextTimer);

    buttonTextTimer = setTimeout(()=>{

        switch(state){

            case "checking":

                span.textContent =

                    "Checking existing files...";

            break;

            case "duplicate":

                span.textContent =

                    text ||

                    "Duplicate Files Found";

            break;

            case "exporting":

                span.textContent =

                    text;

            break;

            case "finalizing":

                span.textContent =

                    "Finalizing...";

            break;

            case "success":

                span.textContent =

                    "✔ Export Complete";

            break;

            case "error":

                span.textContent =

                    "✖ Export Failed";

            break;

            default:

                span.textContent =

                    "Rename & Download";

        }

        span.style.opacity = "1";

        span.style.transform =

            "translateY(0)";

    },150);

}

//----------------------------------------------------
// Smooth Button Progress Animation
//----------------------------------------------------

let currentProgress = 0;

let progressAnimation = null;

function animateButtonProgress(target){

    cancelAnimationFrame(

        progressAnimation

    );

    function animate(){

        const diff =

            target - currentProgress;

        if(Math.abs(diff)<0.5){

            currentProgress = target;

        }

        else{

            currentProgress += diff * 0.15;

        }

        exportButton.style.setProperty(

            "--progress",

            currentProgress + "%"

        );

        if(currentProgress!==target){

            progressAnimation =

                requestAnimationFrame(

                    animate

                );

        }

    }

    animate();

}

//----------------------------------------------------
// Open Rename Modal
//----------------------------------------------------

async function openRenameModal(item){

    setCurrent(item);

    renameItem = item;

    const modal =
        document.getElementById("renameModal");

    // Close Preview first
    document
    .getElementById("previewModal")
    .classList.remove("show");

    // Open Rename
    modal.classList.add("show");

    document.body.style.overflow = "hidden";

    const footer = document.querySelector(".footer");

    if (footer) {
        footer.style.display = "none";
    }

    document
        .getElementById("batchName")
        .value = item.prefix;

    document
        .getElementById("prefixName")
        .value = lastPrefix;

    const previewImage =
        document.getElementById("renamePreviewImage");

    previewImage.classList.add("loading");

    previewImage.src =
        await getObjectURL(
        getImageURL(item,"master")
    );

    previewImage.onload = ()=>{

        previewImage.classList.remove("loading");

        previewImage.classList.add("loaded");

    };

        await buildRenameThumbnailStrip(item);

    buildRenamePreview();

    const renameWindow = document.getElementById("renameWindow");

        renameWindow.style.left = "";
        renameWindow.style.top = "";
        renameWindow.style.transform = "";

    document
        .getElementById("batchName")
        .focus();

}

//----------------------------------------------------
// Close Rename Modal
//----------------------------------------------------

function closeRenameModal(){

    document
        .getElementById("renameModal")
        .classList
        .remove("show");

    document.body.style.overflow = "";

    const footer = document.querySelector(".footer");

    if(footer){

        footer.style.display = "";

    }

    resetExportButton();

    document
        .getElementById("duplicatePanel")
        .classList
        .remove("show");

}

//----------------------------------------------------
// Build Preview
//----------------------------------------------------

function buildRenamePreview(){

    if(!renameItem) return;

    const batch =

        document

        .getElementById(

            "batchName"

        )

        .value

        .trim();

    const prefix =

        document

        .getElementById(

            "prefixName"

        )

        .value

        .trim();

    lastPrefix =

        prefix || "v2";

    const preview =

        document

        .getElementById(

            "renamePreview"

        );

    preview.innerHTML = "";

    const files = [

        "master",

        "02",

        "03",

        "04",

        "05",

        "06",

        "07"

    ];

    files.forEach(file=>{

        const row =

            document.createElement(

                "div"

            );

        row.textContent =

            `${batch}_${file}_${lastPrefix}.JPG`;

        preview.appendChild(

            row

        );

    });

}

//----------------------------------------------------
// Live Preview
//----------------------------------------------------

document
.getElementById("batchName")
.addEventListener(

    "input",

    buildRenamePreview

);

document
.getElementById("prefixName")
.addEventListener(

    "input",

    buildRenamePreview

);

//----------------------------------------------------
// Close Button
//----------------------------------------------------

document
.getElementById("closeRename")
.addEventListener(

    "click",

    closeRenameModal

);

//----------------------------------------------------
// ESC + ENTER
//----------------------------------------------------

document.addEventListener(

    "keydown",

    (event)=>{

        const modal =
            document.getElementById(
                "renameModal"
            );

        if(
            !modal.classList.contains(
                "show"
            )
        ){
            return;
        }

            if(event.key==="Escape"){

        closeRenameModal();

        renameItem = null;

    }

    if(event.key==="Enter"){

    const files = getRenameList();

    if(!files) return;

    if(typeof downloadSet==="function"){

        downloadSet(renameItem, files);

    }

}

    }

);

function restoreDialogPosition(){

    const renameWindow =
        document.getElementById("renameWindow");

    renameWindow.style.left = "";
    renameWindow.style.top = "";
    renameWindow.style.transform = "";

}

//----------------------------------------------------
// Validate Filename
//----------------------------------------------------

function sanitizeFilename(text){

    return text
        .trim()
        .replace(/[\\/:*?"<>|]/g,"")
        .replace(/\s+/g,"");

}

//----------------------------------------------------
// Generate Rename List
//----------------------------------------------------

function getRenameList(){

    const batch = sanitizeFilename(

        document
            .getElementById("batchName")
            .value

    );

    const prefix = sanitizeFilename(

        document
            .getElementById("prefixName")
            .value

    );

    if(batch===""){

        showToast("Image Batch Name cannot be empty.","warning");

        return null;

    }

    if(prefix===""){

        showToast("Prefix cannot be empty.","warning");

        return null;

    }

    lastPrefix = prefix;

    return [

        `${batch}_master_${prefix}.JPG`,
        `${batch}_02_${prefix}.JPG`,
        `${batch}_03_${prefix}.JPG`,
        `${batch}_04_${prefix}.JPG`,
        `${batch}_05_${prefix}.JPG`,
        `${batch}_06_${prefix}.JPG`,
        `${batch}_07_${prefix}.JPG`

    ];

}

//----------------------------------------------------
// Rename Button
//----------------------------------------------------

document
.getElementById("renameDownload")
.addEventListener(

    "click",

    async ()=>{

        const files = getRenameList();

        if(!files) return;

        if(typeof downloadSet==="function"){
            
            const mode = document.querySelector(

                'input[name="downloadMode"]:checked'

            ).value;

            if(mode==="files"){

        setButtonState(

            "checking",

            10

        );

    const duplicates = await checkDuplicateFiles(

        exportFolderHandle,

        files

    );

        setButtonState(

            "exporting",

            30,

            "Preparing export..."

        );

    if(duplicates.length===0){

        exportFiles(

            renameItem,

            files,

            exportFolderHandle

        );

        return;

    }

    setButtonState(

    "duplicate",

        100,

        `⚠ ${duplicates.length} Duplicate File${duplicates.length > 1 ? "s" : ""} Found`

    );

    const panel = document.getElementById("duplicatePanel");

    const list = document.getElementById("duplicateList");

    list.innerHTML = duplicates.join("<br>");

    setTimeout(()=>{

        resetExportButton();

        panel.classList.add("show");

    },500);

    return;

}

            else{

            downloadSet(

            renameItem,

            files

        );

    }

        }

    }

);

//----------------------------------------------------
// Click Outside
//----------------------------------------------------

document
.getElementById("renameModal")
.addEventListener(

    "click",

    (event)=>{

        if(

            event.target.id==="renameModal"

        ){

            closeRenameModal();

            renameItem = null;

        }

    }

);

//----------------------------------------------------
// Build Thumbnail Strip
//----------------------------------------------------

//----------------------------------------------------
// Build Rename Thumbnail Strip
//----------------------------------------------------

async function buildRenameThumbnailStrip(item){

    const strip =
        document.getElementById("renameThumbnailStrip");   

    if(!strip){

        return;

    }

    strip.innerHTML = "";

    const images =
        getGalleryImages(item);

    const thumbs = await Promise.all(

        images.map(async(image,index)=>{      

            const thumb =
                document.createElement("img");

            thumb.loading = "lazy";

            try{

                thumb.src =
                    await getObjectURL(image);

            }

            catch{

                thumb.src =
                    CONFIG.PLACEHOLDER;

            }

            if(index===0){

                thumb.classList.add("active");

            }

            thumb.onclick = ()=>{

                const preview =

                    document.getElementById(

                        "renamePreviewImage"

                    );

                preview.classList.remove("loaded");

                preview.classList.add("loading");

                setTimeout(()=>{

                    preview.src = thumb.src;

                },120);

                preview.onload = ()=>{

                    preview.classList.remove("loading");

                    preview.classList.add("loaded");

                };

                strip
                    .querySelectorAll("img")
                    .forEach(img=>img.classList.remove("active"));

                thumb.classList.add("active");

            };

            return thumb;

        })

    );

    strip.replaceChildren(...thumbs);

}

//----------------------------------------------------
// Select Export Folder
//----------------------------------------------------

document
.getElementById("selectFolder")
.addEventListener("click", async ()=>{

    try{

        exportFolderHandle =
            await window.showDirectoryPicker();

        document.getElementById(
            "selectedFolder"
        ).textContent =
            exportFolderHandle.name;

    }

    catch(error){

    }

});

//----------------------------------------------------
// Duplicate Panel
//----------------------------------------------------

document
.getElementById("cancelDuplicate")
.addEventListener("click",()=>{

    document
        .getElementById("duplicatePanel")
        .classList
        .remove("show");

    resetExportButton();

})

document
.getElementById("replaceFiles")
.addEventListener("click",async()=>{

    document
    .getElementById("duplicatePanel")
    .classList
    .remove("show");

    const files = getRenameList();

    if(!files) return;

    await exportFiles(

        renameItem,

        files,

        exportFolderHandle,

        true

    );

});

document
.getElementById("skipFiles")
.addEventListener("click",async()=>{

    document
    .getElementById("duplicatePanel")
    .classList
    .remove("show");

    const files = getRenameList();

    if(!files) return;

    await exportFiles(

        renameItem,

        files,

        exportFolderHandle,

        false

    );

});