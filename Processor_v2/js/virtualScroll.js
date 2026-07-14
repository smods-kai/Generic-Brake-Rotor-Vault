//====================================================
//
// RotorVault Processor v2
// Virtual Rendering Engine
//
//====================================================

const VirtualScroll = {

    enabled:true,

    batch:24,

    current:0,

    observer:null

};

//----------------------------------------------------
// Initialize
//----------------------------------------------------

function initializeVirtualScroll(){

    if(VirtualScroll.observer){

        VirtualScroll.observer.disconnect();

    }

    const sentinel =

        document.getElementById(

            "scrollSentinel"

        );

    if(!sentinel) return;

    VirtualScroll.observer =

        new IntersectionObserver(

            entries=>{

                if(

                    entries[0].isIntersecting &&

                    renderedCount < filteredCards.length

                ){

                    renderNextBatch();

                }

            },

            {

                rootMargin:"300px"

            }

        );

    VirtualScroll.observer.observe(

        sentinel

    );

}