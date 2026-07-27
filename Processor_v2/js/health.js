//====================================================
//
// RotorVault RC5
// Repository Health
//
//====================================================

//----------------------------------------------------
// Elements
//----------------------------------------------------

const healthPage =
    document.getElementById("healthPage");

const healthNav =
    document.getElementById("healthNav");

const scanRepository =
    document.getElementById("scanRepository");

//----------------------------------------------------
// Open Health Workspace
//----------------------------------------------------

function openHealthPage(){

    document
        .querySelector(".hero")
        ?.style.setProperty("display","none");

    document
        .querySelector(".search-section")
        ?.style.setProperty("display","none");

    document
        .querySelector(".filter-section")
        ?.style.setProperty("display","none");

    document
        .querySelector(".stats-section")
        ?.style.setProperty("display","none");

    document
        .querySelector(".main-content")
        ?.style.setProperty("display","none");

    healthPage.classList.add("show");

}

//----------------------------------------------------
// Close Health Workspace
//----------------------------------------------------

function closeHealthPage(){

    document
        .querySelector(".hero")
        ?.style.removeProperty("display");

    document
        .querySelector(".search-section")
        ?.style.removeProperty("display");

    document
        .querySelector(".filter-section")
        ?.style.removeProperty("display");

    document
        .querySelector(".stats-section")
        ?.style.removeProperty("display");

    document
        .querySelector(".main-content")
        ?.style.removeProperty("display");

    healthPage.classList.remove("show");

}

//----------------------------------------------------
// Navigation
//----------------------------------------------------

function activateNav(link){

    document

        .querySelectorAll(".nav-link")

        .forEach(nav=>nav.classList.remove("active"));

    if(link){

        link.classList.add("active");

    }

}

if(healthNav){

    healthNav.addEventListener(

        "click",

        (event)=>{

            event.preventDefault();

            activateNav(healthNav);

            openHealthPage();

        }

    );

}

const homeNav =

    document.querySelector(".nav-left .nav-link");

if(homeNav){

    homeNav.addEventListener(

        "click",

        (event)=>{

            event.preventDefault();

            activateNav(homeNav);

            closeHealthPage();

        }

    );

}

//----------------------------------------------------
// Scan Button
//----------------------------------------------------

if(scanRepository){

    scanRepository.addEventListener(

        "click",

        async ()=>{

            updateScanProgress(

                0,

                "Preparing repository scan..."

            );

            await new Promise(resolve=>setTimeout(resolve,250));

            if(typeof runRepositoryScan==="function"){

                await runRepositoryScan();

            }

            updateScanProgress(

                100,

                "Repository scan completed."

            );

        }

    );

}

//----------------------------------------------------
// Scan Progress
//----------------------------------------------------

function updateScanProgress(percent, message){

    const fill =
        document.getElementById("scanProgressFill");

    const text =
        document.getElementById("scanStatus");

    const label =
        document.getElementById("scanPercent");

    if(fill){

        fill.style.width = `${percent}%`;

    }

    if(text){

        text.textContent = message;

    }

    if(label){

        label.textContent = `${percent}%`;

    }

}

//----------------------------------------------------
// Public API
//----------------------------------------------------

window.openHealthPage =
    openHealthPage;

window.closeHealthPage =
    closeHealthPage;