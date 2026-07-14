//====================================================
//
// RotorVault Processor v2
// search.js
//
//====================================================

//----------------------------------------------------
// Initialize Search
//----------------------------------------------------

function initializeSearch(){

    const input =
        document.getElementById(
            "searchInput"
        );

    if(!input) return;

    input.addEventListener(

        "input",

        performSearch

    );

}

//----------------------------------------------------
// Search
//----------------------------------------------------

function performSearch(){

    FilterEngine.search =

        document
        .getElementById("searchInput")
        .value
        .trim();

    applyFilterEngine();

}

//----------------------------------------------------
// Initialize
//----------------------------------------------------

console.log(

    "Search Ready"

);

//----------------------------------------------------
// Search Index (RC1)
//----------------------------------------------------

let SearchIndex = [];

function buildSearchIndex(data){

    SearchIndex = Array.isArray(data) ? data : [];

}