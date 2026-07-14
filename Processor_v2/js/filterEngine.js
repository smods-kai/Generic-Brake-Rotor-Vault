//====================================================
//
// RotorVault Processor v2
// filterEngine.js
//
//====================================================

const FilterEngine = {

    data : [],

    filtered : [],

    search : "",

    filters : {

        group : "",

        pair : "",

        lug : "",

        rotor : "",

        pads : "",

        hardware : "",

        sort : "Newest"

    }

};

//----------------------------------------------------
// Initialize
//----------------------------------------------------

function initializeFilterEngine(data){

    initializeDataManager(data);

    FilterEngine.data = getDatabase();

    FilterEngine.filtered = getDatabase();

}

//----------------------------------------------------
// Apply
//----------------------------------------------------

function applyFilterEngine(){

    let result = [...FilterEngine.data];

    //--------------------------------------------------
    // Search
    //--------------------------------------------------

    if(FilterEngine.search){

        const key = FilterEngine.search.toLowerCase();

        result = result.filter(item=>

            item.title.toLowerCase().includes(key) ||

            item.group.toLowerCase().includes(key) ||

            item.folder.toLowerCase().includes(key) ||

            item.prefix.toLowerCase().includes(key) ||

            item.id.toLowerCase().includes(key)

        );

    }

    //--------------------------------------------------
    // Group
    //--------------------------------------------------

    if(FilterEngine.filters.group){

        result = result.filter(item=>

            item.group===FilterEngine.filters.group

        );

    }

    //--------------------------------------------------
    // Rotor Pair
    //--------------------------------------------------

    if(FilterEngine.filters.pair){

        result = result.filter(item=>

            String(item.rotorPair)===FilterEngine.filters.pair

        );

    }

    //--------------------------------------------------
    // Lug Holes
    //--------------------------------------------------

    if(FilterEngine.filters.lug){

        result = result.filter(item=>

            String(item.lugHoles)===FilterEngine.filters.lug

        );

    }

    //--------------------------------------------------
    // Rotor Type
    //--------------------------------------------------

    if(FilterEngine.filters.rotor){

        result = result.filter(item=>

            item.rotorType===FilterEngine.filters.rotor

        );

    }

    //--------------------------------------------------
    // Pads
    //--------------------------------------------------

    if(FilterEngine.filters.pads){

        result = result.filter(item=>

            item.brakePads===FilterEngine.filters.pads

        );

    }

    //--------------------------------------------------
    // Hardware
    //--------------------------------------------------

    if(FilterEngine.filters.hardware){

        result = result.filter(item=>

            item.hardware===FilterEngine.filters.hardware

        );

    }

    //--------------------------------------------------
    // Sort
    //--------------------------------------------------

    switch(FilterEngine.filters.sort){

        case "Newest":

            result.sort((a,b)=>

                b.folder.localeCompare(a.folder)

            );

            break;

        case "Oldest":

            result.sort((a,b)=>

                a.folder.localeCompare(b.folder)

            );

            break;

        case "A-Z":

            result.sort((a,b)=>

                a.title.localeCompare(b.title)

            );

            break;

        case "Z-A":

            result.sort((a,b)=>

                b.title.localeCompare(a.title)

            );

            break;

    }

    setFiltered(result);

    filterCards(getFiltered());

}
