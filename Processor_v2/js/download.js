//====================================================
//
// RotorVault Processor v2
// download.js
//
//====================================================

//----------------------------------------------------
// Download Current Set
//----------------------------------------------------

async function downloadSet(

    item,

    renamedFiles = null

){

    let filename;

    if(!item) return;

    try{

        showDownloadLoading();

        const button =

    document.getElementById(

    "downloadButton"

);

if(button){

    button.disabled = true;

}

        const zip = new JSZip();

        const images = [

            "master",

            "02",

            "03",

            "04",

            "05",

            "06",

            "07"

        ];

        for(

            let i=0;

            i<images.length;

            i++

        ){

            const url =

                getImageURL(

                    item,

                    images[i]

                );

        const blob =

            await getCachedImage(

            url

        );

            if(

                renamedFiles

            ){

                filename =

                    renamedFiles[i];

            }

            else{

                filename =

                    getImageFilename(

                        item.prefix,

                        images[i]

                    );

            }

            zip.file(

                filename,

                blob

            );

        }

        await buildZip(

            zip,

            item

        );

    }

    catch(error){

        console.error(error);

        hideDownloadLoading();

    }

}

//----------------------------------------------------
// Build ZIP
//----------------------------------------------------

async function buildZip(

    zip,

    item

){

    try{

        const content =

            await zip.generateAsync(

                {

                    type:"blob",

                    compression:"DEFLATE",

                    compressionOptions:{

                        level:9

                    }

                },

                (metadata)=>{

                    updateDownloadProgress(

                        metadata.percent

                    );

                }

            );

        const filename =

            `${item.folder}.zip`;

        saveAs(

            content,

            filename

        );

        hideDownloadLoading();

        showToast(

            `${filename} downloaded successfully.`,

            "success"

        );

    }

    catch(error){

        console.error(error);

        hideDownloadLoading();

        const button =

    document.getElementById(

    "downloadButton"

);

        if(button){

    button.disabled = false;

}

        showToast(

            "Failed to build ZIP.",

            "error"

        );

    }

}

//----------------------------------------------------
// Download Progress
//----------------------------------------------------

function updateDownloadProgress(

    percent

){

    const loader =

        document.getElementById(

            "loadingOverlay"

        );

    if(!loader) return;

    const text =

        loader.querySelector(

            "span"

        );

    if(text){

        text.textContent =

            `Building ZIP... ${Math.round(percent)}%`;

    }

}

//----------------------------------------------------
// Loading
//----------------------------------------------------

function showDownloadLoading(){

    const loader =

        document.getElementById(

            "loadingOverlay"

        );

    if(loader){

        loader.style.display="flex";

        const text =

            loader.querySelector(

                "span"

            );

        if(text){

            text.textContent =

                "Preparing Download...";

        }

    }

}

function hideDownloadLoading(){

    const loader =

        document.getElementById(

            "loadingOverlay"

        );

    if(loader){

        loader.style.display = "none";

    }

}

//----------------------------------------------------
// Collect Images
//----------------------------------------------------

async function collectImages(item){

    const files = [];

    const names = [

        "master",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07"

    ];

    for(const image of names){

        const url = getImageURL(

            item,

            image

        );

        try{

            await getCachedImage(url);

            files.push(url);

        }

        catch{

            console.warn(

                `Missing image: ${url}`

            );

        }

    }

    return files;

}

//----------------------------------------------------
// Initialize
//----------------------------------------------------

console.log(

    "Download Engine Ready"

);