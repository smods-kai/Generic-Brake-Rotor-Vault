//====================================================
//
// RotorVault Processor v2
// Data Manager
//
//====================================================

const DataManager = {

    //--------------------------------------------
    // Master Database
    //--------------------------------------------

    database : [],

    //--------------------------------------------
    // Current Filtered Result
    //--------------------------------------------

    filtered : [],

    //--------------------------------------------
    // Current Selected Set
    //--------------------------------------------

    current : null,

    //--------------------------------------------
    // Statistics
    //--------------------------------------------

    stats : {

        totalSets : 0,

        totalImages : 0,

        totalGroups : 0

    }

};

//====================================================
// Initialize
//====================================================

function initializeDataManager(data){

    DataManager.database = [...data];

    DataManager.filtered = [...data];

    DataManager.stats.totalSets =

        data.length;

    DataManager.stats.totalImages =

        data.length *

        CONFIG.IMAGES_PER_SET;

    DataManager.stats.totalGroups =

        new Set(

            data.map(item=>item.group)

        ).size;

}

//====================================================
// Database
//====================================================

function getDatabase(){

    return DataManager.database;

}

function getFiltered(){

    return DataManager.filtered;

}

function setFiltered(data){

    DataManager.filtered = [...data];

}

function getCurrent(){

    return DataManager.current;

}

function setCurrent(item){

    DataManager.current = item;

}

function clearCurrent(){

    DataManager.current = null;

}

//====================================================
// Search
//====================================================

function findSet(folder){

    return DataManager.database.find(

        item=>item.folder===folder

    );

}

function findByPrefix(prefix){

    return DataManager.database.find(

        item=>item.prefix===prefix

    );

}

function getGroup(group){

    return DataManager.database.filter(

        item=>item.group===group

    );

}

function getRelated(item){

    return DataManager.database.filter(set=>{

        return(

            set.group===item.group &&

            set.folder!==item.folder

        );

    });

}

//====================================================
// Statistics
//====================================================

function getStatistics(){

    return{

        totalSets:

        DataManager.stats.totalSets,

        totalImages:

        DataManager.stats.totalImages,

        totalGroups:

        DataManager.stats.totalGroups,

        showing:

        DataManager.filtered.length

    };

}

//====================================================
// Exports
//====================================================

window.initializeDataManager =

initializeDataManager;

window.getDatabase =

getDatabase;

window.getFiltered =

getFiltered;

window.setFiltered =

setFiltered;

window.findSet =

findSet;

window.findByPrefix =

findByPrefix;

window.getGroup =

getGroup;

window.getRelated =

getRelated;

window.getStatistics =

getStatistics;

window.getCurrent =

getCurrent;

window.setCurrent =

setCurrent;

window.clearCurrent =

clearCurrent;