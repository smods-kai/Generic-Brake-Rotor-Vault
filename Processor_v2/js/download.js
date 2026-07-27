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
            item,
            renamedFiles
    );

    }

    catch(error){

        console.error(error);

        hideDownloadLoading();

    }

}

//----------------------------------------------------
// Check Duplicate Files
//----------------------------------------------------

async function checkDuplicateFiles(folderHandle, fileNames){

    const duplicates = [];

    for(const name of fileNames){

        try{

            await folderHandle.getFileHandle(name);

            duplicates.push(name);

        }

        catch{

            // File does not exist

        }

    }

    return duplicates;

}

//----------------------------------------------------
// Export Individual JPG Files
//----------------------------------------------------

async function exportFiles(

    item,

    renamedFiles,

    folderHandle,

    replaceExisting = true

){

    if(!folderHandle) return;

    const images = [

        "master",

        "02",

        "03",

        "04",

        "05",

        "06",

        "07"

    ];

    let exported = 0;

    let skipped = 0;

        setButtonState(

            "exporting",

            0,

            "Preparing..."

        )

    for(let i=0;i<images.length;i++){

        const percent = Math.round(((i + 1) / images.length) * 100);

        const url = getImageURL(item, images[i]);

        const blob = await getCachedImage(url);

        let fileHandle;

            if(!replaceExisting){

try{

    await folderHandle.getFileHandle(

        renamedFiles[i]

    );

    skipped++;

    continue;

}

catch{

    // File doesn't exist

}

    }

        fileHandle = await folderHandle.getFileHandle(

            renamedFiles[i],

            {

                create:true

        }

    );

        const writable = await fileHandle.createWritable();

        await writable.write(blob);

        await writable.close();

        exported++;

        const progress = Math.round(

            ((i + 1) / images.length) * 100

        );

        setButtonState(

            "exporting",

            progress,

            `Exporting ${i + 1} of ${images.length}`

        );

    }

    showToast(

        `${exported} image(s) exported${

        skipped

        ?

        ` • ${skipped} skipped`

        :

        ""

        }`,

        "success"

    );

    setButtonState(

        "finalizing",

        100

    );

        await new Promise(

    resolve => setTimeout(resolve,300)

    );

    setExportSuccess();

}

//----------------------------------------------------
// Build ZIP
//----------------------------------------------------

async function buildZip(

    zip,

    item,

    renamedFiles = null

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

        const filename = renamedFiles
            ? `${sanitizeFilename(document.getElementById("batchName").value)}.zip`
            : `${item.folder}.zip`;

        saveAs(

            content,

            filename

        );

        hideDownloadLoading();

        showToast(

            `${filename} downloaded successfully.`,

            "success"


        );

        setButtonState(
            "finalizing",
            100
        );

        await new Promise(
            resolve => setTimeout(resolve,300)
        );

        setExportSuccess();

    }

    catch(error){

        setExportError();

        console.error(error);

        hideDownloadLoading();

        const button =

    document.getElementById(

    "downloadButton"

);

        if(button){

    button.disabled = false;

}

        await new Promise(

            resolve=>setTimeout(resolve,300)

        );

        setExportSuccess();

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
            
            setExportError();

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