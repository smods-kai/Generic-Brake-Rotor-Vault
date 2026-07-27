//====================================================
//
// RotorVault Processor v2
// app.js
//
//====================================================

window.addEventListener("DOMContentLoaded", initializeApp);

//----------------------------------------------------
// Initialize
//----------------------------------------------------

async function initializeApp(){

    try{
        
        beginMeasure();

        showLoader();

        renderSkeletonCards();

        await loadDatabase();

        updateStatistics();

        initializeSearch();

        initializeFilters();

        initializeAnimations();

        initializeVirtualScroll();

       requestAnimationFrame(()=>{

        hideLoader();

            endMeasure(
        "Startup"

    );

    });

    }

    catch(error){

        console.error(error);

        hideLoader();

    }

}

//----------------------------------------------------
// Loader
//----------------------------------------------------

function showLoader(){

    const loader =
        document.getElementById(
            "loadingOverlay"
        );

    if(loader){

        loader.style.display = "flex";

    }

}

function hideLoader(){

    const loader =
        document.getElementById(
            "loadingOverlay"
        );

    if(loader){

        loader.style.display = "none";

    }

}