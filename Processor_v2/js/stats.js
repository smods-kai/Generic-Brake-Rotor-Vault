//====================================================
//
// RotorVault Processor v2
// Statistics
//
//====================================================

//----------------------------------------------------
// Counter Animation
//----------------------------------------------------

function animateCounter(

    element,

    target

){

    let current = 0;

    const step =

        Math.max(

            1,

            Math.ceil(target/30)

        );

    const timer =

        setInterval(()=>{

            current += step;

            if(current>=target){

                current=target;

                clearInterval(timer);

            }

            element.textContent=current;

        },15);

}

function updateStatistics(){

    const stats = getStatistics();

    document.getElementById("totalSets").textContent =
        stats.totalSets;

    document.getElementById("totalImages").textContent =
        stats.totalImages;

    document.getElementById("totalGroups").textContent =
        stats.totalGroups;

    document.getElementById("showingCount").textContent =
        stats.showing;

}

console.log("Statistics Ready");