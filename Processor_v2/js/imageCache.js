
//====================================================
//
// RotorVault RC3
// Image Cache
//
//====================================================

const ImageCache={

    blobs:new Map(),

    objectURLs:new Map(),

    pending:new Map(),

    stats:{

        hits:0,

        misses:0,

        downloads:0

    }

};

//----------------------------------------------------
// Download Blob
//----------------------------------------------------

async function fetchBlob(url){

    const response=await fetch(url,{

        cache:"no-store"

    });

    if(!response.ok){

        throw new Error(url);

    }

    return await response.blob();

}

//----------------------------------------------------
// Blob Cache
//----------------------------------------------------

async function getCachedImage(url){

    if(ImageCache.blobs.has(url)){

        ImageCache.stats.hits++;

        return ImageCache.blobs.get(url);

    }

    if(ImageCache.pending.has(url)){

        return await ImageCache.pending.get(url);

    }

    const promise=fetchBlob(url);

    ImageCache.pending.set(url,promise);

    try{

        const blob=await promise;

        ImageCache.blobs.set(url,blob);

        ImageCache.pending.delete(url);

        ImageCache.stats.downloads++;

        return blob;

    }

    catch(error){

        ImageCache.pending.delete(url);

        throw error;

    }

}

//----------------------------------------------------
// Object URL
//----------------------------------------------------

async function getObjectURL(url){

    if(ImageCache.objectURLs.has(url)){

        return ImageCache.objectURLs.get(url);

    }

    try{

        const blob=await getCachedImage(url);

        const objectURL=

            URL.createObjectURL(blob);

        ImageCache.objectURLs.set(

            url,

            objectURL

        );

        return objectURL;

    }

    catch{

        return CONFIG.PLACEHOLDER;

    }

}

//----------------------------------------------------
// Preload Images
//----------------------------------------------------

async function preloadImages(urls){

    await Promise.all(

        urls.map(

            url=>getCachedImage(url)

        )

    );

}

//----------------------------------------------------
// Statistics
//----------------------------------------------------

function getCacheStatistics(){

    return{

        cached:

            ImageCache.blobs.size,

        objectURLs:

            ImageCache.objectURLs.size,

        downloads:

            ImageCache.stats.downloads,

        hits:

            ImageCache.stats.hits

    };

}

//----------------------------------------------------
// Clear Cache
//----------------------------------------------------

function clearImageCache(){

    ImageCache.objectURLs.forEach(

        url=>URL.revokeObjectURL(url)

    );

    ImageCache.objectURLs.clear();

    ImageCache.blobs.clear();

    ImageCache.pending.clear();

}

//----------------------------------------------------
// Exports
//----------------------------------------------------

window.getCachedImage=
    getCachedImage;

window.getObjectURL=
    getObjectURL;

window.preloadImages=
    preloadImages;

window.clearImageCache=
    clearImageCache;

window.getCacheStatistics=
    getCacheStatistics;

window.addEventListener(

    "beforeunload",

    clearImageCache

);

console.log("RC3 Image Cache Ready");