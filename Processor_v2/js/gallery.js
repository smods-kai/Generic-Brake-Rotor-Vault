//====================================================
//
// RotorVault RC3
// Gallery Engine
//
//====================================================

window.galleryImages=[];

let galleryIndex=0;

//----------------------------------------------------
// Load Gallery
//----------------------------------------------------

function loadGallery(item){

    window.galleryImages = getGalleryImages(item);

    galleryIndex = 0;

    window.currentGallery = {

        item,

        images: window.galleryImages,

        index: 0

    };

    return window.galleryImages;

}

//----------------------------------------------------
// Current Image
//----------------------------------------------------

function currentGalleryImage(){

    return window.galleryImages[galleryIndex];

}

//----------------------------------------------------
// Next
//----------------------------------------------------

function nextGalleryImage(){

    galleryIndex++;

    if(galleryIndex>=window.galleryImages.length){

        galleryIndex=0;

    }

    window.currentGallery.index = galleryIndex;

    return currentGalleryImage();

}

//----------------------------------------------------
// Previous
//----------------------------------------------------

function previousGalleryImage(){

    galleryIndex--;

    if(galleryIndex<0){

        galleryIndex=window.galleryImages.length-1;

    }

    window.currentGallery.index = galleryIndex;

    return currentGalleryImage();

}

//----------------------------------------------------
// Select
//----------------------------------------------------

function selectGalleryImage(index){

    galleryIndex=index;

    window.currentGallery.index=index;

    return currentGalleryImage();

}

//----------------------------------------------------
// Preload
//----------------------------------------------------

async function preloadGallery(){

    await preloadImages(galleryImages);

}

//----------------------------------------------------
// Exports
//----------------------------------------------------

window.loadGallery=
    loadGallery;

window.currentGalleryImage=
    currentGalleryImage;

window.nextGalleryImage=
    nextGalleryImage;

window.previousGalleryImage=
    previousGalleryImage;

window.selectGalleryImage=
    selectGalleryImage;

window.preloadGallery=
    preloadGallery;

console.log("RC3 Gallery Ready");