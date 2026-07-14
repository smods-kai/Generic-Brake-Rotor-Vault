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

    });

        console.log(
            "RotorVault v2 Ready"
        );

    }

    catch(error){

        console.error(error);

        hideLoader();

    }

    endMeasure(

    "Startup"

);

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