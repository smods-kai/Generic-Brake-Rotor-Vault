//====================================================
// RotorVault Database
//====================================================

let rotorSets = [];


//====================================================
// Load Database
//====================================================

async function loadDatabase(){

    try{

        const response = await fetch(

            CONFIG.DATABASE + "?v=" + CONFIG.CACHE,

            {

                cache:"no-store"

            }

        );

        if(!response.ok){

            throw new Error(

                "database.json not found"

            );

        }

        rotorSets = await response.json();

        initializeDataManager(rotorSets);

        initializeFilterEngine(rotorSets);

        buildSearchIndex(rotorSets);

        filterCards(getDatabase());

        updateStatistics();

    }

    catch(error){

        console.error(error);

        showToast(

            "Unable to load database.json",

            "error"

        );

    }

}