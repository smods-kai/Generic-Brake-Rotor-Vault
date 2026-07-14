//====================================================
//
// RotorVault Preview Engine RC2
//
//====================================================

//--------------------------------------------
// Preview Session
//--------------------------------------------

let currentPreviewSession = 0;

//--------------------------------------------
// Open Preview
//--------------------------------------------

async function openPreview(item){

    const session = ++currentPreviewSession;

    setCurrent(item);

    const modal = document.getElementById("previewModal");

    modal.classList.add("show");

    await loadPreview(item, session);

    if(session !== currentPreviewSession) return;

    await buildThumbnails(item, session);

    if(session !== currentPreviewSession) return;

    loadRelatedSets(item);

}

//--------------------------------------------
// Close Preview
//--------------------------------------------

function closePreview(){

    currentPreviewSession++;

    document
        .getElementById("previewModal")
        .classList
        .remove("show");

}

//----------------------------------------------------
// Load Preview
//----------------------------------------------------

async function loadPreview(item, session){

    if(session !== currentPreviewSession){

    return;

}

    document.getElementById("previewTitle").textContent =
        item.title;

    document.getElementById("specGroup").textContent =
        item.group;

    document.getElementById("specPair").textContent =
        item.rotorPair;

    document.getElementById("specRotor").textContent =
        item.rotorType;

    document.getElementById("specPads").textContent =
        item.brakePads;

    document.getElementById("specHardware").textContent =
        item.hardware;

    document.getElementById("specLugs").textContent =
        item.lugHoles;

    const preview =
        document.getElementById("previewImage");

try{

    preview.classList.add("loading");

    preview.src = await getObjectURL(

        getImageURL(

            item,

            "master"

        )

    );

        preview.onload = ()=>{

    preview.classList.remove("loading");

    preview.classList.add("loaded");

};

}

catch{

    preview.src = CONFIG.PLACEHOLDER;

}

    preview.onerror = ()=>{

        preview.src =
            CONFIG.PLACEHOLDER;

    };

}

//----------------------------------------------------
// Build Thumbnails
//----------------------------------------------------

async function buildThumbnails(item, session){

    if(session !== currentPreviewSession) return;

    const strip = document.getElementById("thumbnailStrip");

    strip.innerHTML = "";

    const images = getGalleryImages(item);

    for(let i = 0; i < images.length; i++){

        if(session !== currentPreviewSession) return;

        const thumb = document.createElement("img");

        thumb.loading = "lazy";
        thumb.draggable = false;
        thumb.src = CONFIG.PLACEHOLDER;

        strip.appendChild(thumb);

        try{

            const objectURL = await getObjectURL(images[i]);

            await new Promise(resolve=>{

                const loader = new Image();

                loader.onload = ()=>{

                    thumb.src = objectURL;

                    // Required for fade-in
                    thumb.classList.add("loaded");

                    resolve();

                };

                loader.onerror = ()=>{

                    thumb.src = CONFIG.PLACEHOLDER;

                    resolve();

                };

                loader.src = objectURL;

            });

        }

        catch{

            thumb.src = CONFIG.PLACEHOLDER;

        }

        if(i===0){

            thumb.classList.add("active");

        }

        thumb.onclick = ()=>{

            selectThumbnail(

                thumb,

                images[i]

            );

        };

    }

}

//----------------------------------------------------
// Select Thumbnail
//----------------------------------------------------

function selectThumbnail(thumb, image){

    document
        .querySelectorAll("#thumbnailStrip img")
        .forEach(img => img.classList.remove("active"));

    thumb.classList.add("active");

    const preview =
        document.getElementById("previewImage");

    (async()=>{

        try{

            preview.classList.add("loading");

            preview.src = await getObjectURL(image);

            preview.onload = ()=>{

                preview.classList.remove("loading");
                preview.classList.add("loaded");

            };

        }

        catch{

            preview.src = CONFIG.PLACEHOLDER;

        }

    })();

}

//----------------------------------------------------
// Load Related Sets
//----------------------------------------------------

function loadRelatedSets(item){

    const panel =
        document.getElementById("relatedSets");

    panel.innerHTML = "";

    const related =
        getRelated(item);

    related.slice(0,8).forEach(set=>{

        const card =
            document.createElement("div");

        card.className =
            "related-card";

        card.innerHTML = `

            <img
                class="related-image"
                loading="lazy">

            <div class="related-info">

                <div class="related-title">

                    ${set.folder}

                </div>

                <div class="related-group">

                    ${set.rotorType}

                </div>

            </div>

        `;

        card.onclick = ()=>{

            openPreview(set);

        };

        panel.appendChild(card);

        const image =
            card.querySelector(".related-image");

        (async()=>{

            try{

                image.src =
                    await getObjectURL(

                        getImageURL(

                            set,

                            "master"

                        )

                    );

            }

            catch{

                image.src =
                    CONFIG.PLACEHOLDER;

            }

        })();

    });

}

//----------------------------------------------------
// Rename Button
//----------------------------------------------------

const renameButton =
    document.getElementById("renameButton");

if(renameButton){

    renameButton.onclick = ()=>{

        const item = getCurrent();

        if(!item) return;

        if(typeof openRenameModal === "function"){

            openRenameModal(item);

        }

    };

}

//----------------------------------------------------
// Download Button
//----------------------------------------------------

const downloadButton =
    document.getElementById("downloadButton");

if(downloadButton){

    downloadButton.addEventListener(

        "click",

        ()=>{

            if(

                typeof downloadSet ===

                "function"

            ){

                downloadSet(getCurrent());

            }

        }

    );

}

//----------------------------------------------------
// Close Button
//----------------------------------------------------

const closeButton =
    document.getElementById("closePreview");

if(closeButton){

    closeButton.addEventListener(

        "click",

        closePreview

    );

}

//----------------------------------------------------
// Click Outside
//----------------------------------------------------

const previewModal =
    document.getElementById("previewModal");

if(previewModal){

    previewModal.addEventListener(

        "click",

        (event)=>{

            if(

                event.target===previewModal

            ){

                closePreview();

            }

        }

    );

}

//----------------------------------------------------
// Keyboard Navigation
//----------------------------------------------------

window.addEventListener(

    "keydown",

    (event)=>{

        const modal =

            document

            .getElementById(

                "previewModal"

            );

        if(

            !modal.classList.contains(

                "show"

            )

        ){

            return;

        }

        //------------------------------------------------
        // ESC
        //------------------------------------------------

        if(event.key==="Escape"){

            closePreview();

        }

        //------------------------------------------------
        // Left / Right Images
        //------------------------------------------------

        if(

            event.key==="ArrowLeft" ||

            event.key==="ArrowRight"

        ){

            const thumbs =

                [

                    ...document.querySelectorAll(

                        "#thumbnailStrip img"

                    )

                ];

            if(!thumbs.length) return;

            let active =

                thumbs.findIndex(

                    img=>img.classList.contains(

                        "active"

                    )

                );

            if(

                event.key==="ArrowRight"

            ){

                active++;

            }else{

                active--;

            }

            if(active<0)

                active=

                thumbs.length-1;

            if(active>=thumbs.length)

                active=0;

            thumbs[active].click();

        }

    }

);

//----------------------------------------------------
// Image Preload
//----------------------------------------------------

async function preloadImages(images){

    if (!Array.isArray(images)) return;

    for (const image of images) {

        try {

            await getObjectURL(image);

        }

        catch (e) {

            // Ignore preload failures

        }

    }

}

//----------------------------------------------------
// Initialize Preview
//----------------------------------------------------

function initializePreview(){

    console.log(

        "Preview Module Ready"

    );

}

initializePreview();