//====================================================
//
// RotorVault Processor v2
// cardEngine.js
//
//====================================================

let renderedCount = 0;

const CARDS_PER_BATCH =
    CONFIG.CARDS_PER_BATCH;

//----------------------------------------------------
// Skeleton Loading
//----------------------------------------------------

function renderSkeletonCards(){

    const container =

        document.getElementById(

            "cards"

        );

    for(

        let i=0;

        i<12;

        i++

    ){

        const card =

            document.createElement(

                "div"

            );

        card.className="skeleton-card";

        card.innerHTML=`

            <div class="skeleton-image"></div>

            <div class="skeleton-line long"></div>

            <div class="skeleton-line medium"></div>

            <div class="skeleton-line short"></div>

        `;

        container.appendChild(

            card

        );

    }

}

//----------------------------------------------------
// Render Cards
//----------------------------------------------------

function renderCards(data){

    currentCards = data;

    filteredCards=[...data];

    renderedCount = 0;

    const container =
        document.getElementById("cards");

    showSkeletonCards();

    requestAnimationFrame(()=>{

    container.innerHTML = "";

    // empty state check...

    renderNextBatch();

    updateStatistics();

});

    if(data.length===0){

        empty.style.display="flex";

        return;

}

    empty.style.display="none";

    renderNextBatch();

    updateStatistics();

}

//----------------------------------------------------
// Render Batch
//----------------------------------------------------

function renderNextBatch(){

    const container =
        document.getElementById("cards");

    const fragment =
        document.createDocumentFragment();

    const end =
        Math.min(

            renderedCount + CARDS_PER_BATCH,

            filteredCards.length

        );

    for(

        let i = renderedCount;

        i < end;

        i++

    ){

        fragment.appendChild(

            createCard(

                filteredCards[i]

            )

        );

    }

    container.appendChild(fragment);

    renderedCount = end;

}

//----------------------------------------------------
// Create Card
//----------------------------------------------------

function createCard(item){

    const card =
        document.createElement("div");

    card.className = "card";

    card.dataset.group =
        item.group;

    card.dataset.folder =
        item.folder;

    card.dataset.id =
        item.id;

    const masterImage =
        getImageURL(
        item,
            "master"
    );

    card.innerHTML = `

        <div class="card-image">

        <img
            loading="lazy"
            src="${CONFIG.PLACEHOLDER}"
            alt="${item.title}">

            <div class="card-overlay"></div>

        </div>

        <div class="card-content">

            <div class="card-title">

                ${item.title}

            </div>

            <div class="card-id">

                ${item.folder}

            </div>

        <div class="card-meta">

            <span class="group-badge">

                ${item.group}

    </span>

    <span class="status">

        READY

    </span>

</div>

<div class="card-info">

                <div class="info-box">

                    <span class="info-label">

                        Pair

                    </span>

                    <span class="info-value">

                        ${item.rotorPair}

                    </span>

                </div>

                <div class="info-box">

                    <span class="info-label">

                        Lug

                    </span>

                    <span class="info-value">

                        ${item.lugHoles}

                    </span>

                </div>

                <div class="info-box">

                    <span class="info-label">

                        Type

                    </span>

                    <span class="info-value">

                        ${item.rotorType}

                    </span>

                </div>

                <div class="info-box">

                    <span class="info-label">

                        Images

                    </span>

                    <span class="info-value">

                        ${item.imagesCount || 7}

                    </span>

                </div>

            </div>

            <div class="card-footer">

                <span class="image-count">

                    Generic Images

                </span>

                <span class="status">

                    READY

                </span>

            </div>

        </div>

    `;

    //----------------------------------------------------
    // Missing Image
    //----------------------------------------------------
    
 const img =
    card.querySelector("img");

(async()=>{

    try{

        img.classList.add("loading");

        const objectURL = await getObjectURL(masterImage);

        img.src = objectURL;

        img.onload = ()=>{

            img.classList.remove("loading");

            img.classList.add("loaded");

        };

    }

    catch{

        img.src = CONFIG.PLACEHOLDER;

        img.classList.remove("loading");

    }

})();

card.addEventListener(

    "click",

    ()=>{

        if(typeof openPreview==="function"){

            openPreview(item);

        }

    }

);

card.style.opacity = "0";

card.style.transform = "translateY(20px)";

requestAnimationFrame(()=>{

    setTimeout(()=>{

        card.style.transition =

            "opacity .35s ease, transform .35s ease";

        card.style.opacity = "1";

        card.style.transform = "translateY(0)";

    }, renderedCount * 18);

});

return card;

}

//----------------------------------------------------
// Filter Cards
//----------------------------------------------------

function filterCards(filteredData){

    filteredCards = [...filteredData];

    renderedCount = 0;

    const container =
        document.getElementById("cards");

    container.innerHTML = "";

    renderNextBatch();

    updateStatistics();

}

//----------------------------------------------------
// Reset Cards
//----------------------------------------------------

function resetCards(){

    filterCards(currentCards);

}

//----------------------------------------------------
// Refresh Cards
//----------------------------------------------------

function refreshCards(){

    renderCards(getFiltered());

}

//----------------------------------------------------
// Image URL
//----------------------------------------------------

function getImageURL(item, image){

    const ROOT = CONFIG.GITHUB_RAW;

    let filename;

    if(image === "master"){

        filename = getImageFilename(item.prefix, "master");

    }else{

        filename = getImageFilename(item.prefix, image);

    }

    const url = `${ROOT}/${item.group}/${item.folder}/${filename}?v=${CONFIG.CACHE}`;

    return url;

}

//----------------------------------------------------
// Create Thumbnail URLs
//----------------------------------------------------

function getGalleryImages(item){

    return [

        getImageURL(item,"master"),

        getImageURL(item,"02"),

        getImageURL(item,"03"),

        getImageURL(item,"04"),

        getImageURL(item,"05"),

        getImageURL(item,"06"),

        getImageURL(item,"07")

    ];

}

//----------------------------------------------------
// Skeleton Cards
//----------------------------------------------------

function showSkeletonCards(){

    const container =
        document.getElementById("cards");

    container.innerHTML="";

    for(let i=0;i<12;i++){

        const skeleton =
            document.createElement("div");

        skeleton.className =
            "card skeleton";

        skeleton.innerHTML = `

            <div class="card-image"></div>

            <div class="card-content">

                <div class="card-title"></div>

                <div class="card-id"></div>

            </div>

        `;

        container.appendChild(
            skeleton
        );

    }

}

//----------------------------------------------------
// Remove Skeleton
//----------------------------------------------------

function removeSkeletonCards(){

    document
        .querySelectorAll(".skeleton")
        .forEach(card=>card.remove());

}

//----------------------------------------------------
// Image Filename
//----------------------------------------------------

function getImageFilename(

    prefix,

    image

){

    if(image==="master"){

        return `${prefix}${CONFIG.MASTER_SUFFIX}${CONFIG.DEFAULT_VERSION}${CONFIG.IMAGE_EXTENSION}`;

    }

    return `${prefix}_${image}${CONFIG.DEFAULT_VERSION}${CONFIG.IMAGE_EXTENSION}`;

}

//----------------------------------------------------
// Exports
//----------------------------------------------------

window.renderCards =
    renderCards;

window.filterCards =
    filterCards;

window.resetCards =
    resetCards;

window.refreshCards =
    refreshCards;

window.getGalleryImages =
    getGalleryImages;

//----------------------------------------------------
// Empty State Reset
//----------------------------------------------------

document

.getElementById(

    "emptyReset"

)

.addEventListener(

    "click",

    ()=>{

        resetFilters();

    }

);