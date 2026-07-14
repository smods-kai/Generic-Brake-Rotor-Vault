//====================================================
//
// RotorVault Processor v2
// rename.js
//
//====================================================

console.log("🚀 NEW rename.js LOADED");

let renameItem = null;

let lastPrefix = "v2";

let dialogPosition = {

    x:null,

    y:null

};

//----------------------------------------------------
// Open Rename Modal
//----------------------------------------------------

async function openRenameModal(item){

    setCurrent(item);

    renameItem = getCurrent();

    const modal =
        document.getElementById("renameModal");

    modal.classList.add("show");

    document
        .getElementById("batchName")
        .value = item.prefix;

    document
        .getElementById("prefixName")
        .value = lastPrefix;

    const previewImage =
        document.getElementById("renamePreviewImage");

    previewImage.src =
        await getObjectURL(
            getImageURL(item, "master")
    );

        console.log("Calling buildRenameThumbnailStrip...");
            await buildRenameThumbnailStrip(item);
        console.log("Finished buildRenameThumbnailStrip.");

    buildRenamePreview();

    const window = document.getElementById("renameWindow");

        window.style.left = "";
        window.style.top = "";
        window.style.transform = "";

    document
        .getElementById("batchName")
        .focus();

}

//----------------------------------------------------
// Close Rename Modal
//----------------------------------------------------

function closeRenameModal(){

    document

        .getElementById(

            "renameModal"

        )

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

            `${batch}_${file}_${lastPrefix}.jpg`;

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

            if(typeof downloadSet==="function"){

                downloadSet(getCurrent());

            }

        }

    }

);

function restoreDialogPosition(){

    renameWindow.style.left = "";

    renameWindow.style.top = "";

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

        `${batch}_master_${prefix}.jpg`,
        `${batch}_02_${prefix}.jpg`,
        `${batch}_03_${prefix}.jpg`,
        `${batch}_04_${prefix}.jpg`,
        `${batch}_05_${prefix}.jpg`,
        `${batch}_06_${prefix}.jpg`,
        `${batch}_07_${prefix}.jpg`

    ];

}

//----------------------------------------------------
// Rename Button
//----------------------------------------------------

document
.getElementById("renameDownload")
.addEventListener(

    "click",

    ()=>{

        const files = getRenameList();

        if(!files) return;

        if(typeof downloadSet==="function"){

            downloadSet(

                renameItem,

                files

            );

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

    console.log("=== buildRenameThumbnailStrip Started ===");

    const strip =
        document.getElementById("renameThumbnailStrip");

    console.log("Strip:", strip);

    if(!strip){

        console.log("Strip NOT FOUND");

        return;

    }

    strip.innerHTML = "";

    const images =
        getGalleryImages(item);

    console.log("Images:", images);

    const thumbs = await Promise.all(

        images.map(async(image,index)=>{

            console.log("Loading:", image);

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

                document
                    .getElementById("renamePreviewImage")
                    .src = thumb.src;

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
// Initialize
//----------------------------------------------------

console.log(

    "Rename Module Ready"

);