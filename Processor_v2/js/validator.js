//====================================================
//
// RotorVault RC5
// Repository Validator
//
//====================================================

//----------------------------------------------------
// Run Repository Scan
//----------------------------------------------------

async function runRepositoryScan(){

    const report = {

        score:100,

        passed:0,

        warnings:0,

        errors:0,

        items:[]

    };

    const database = getDatabase();

    updateScanProgress(

        10,

        "Checking database..."

    );

        await new Promise(resolve=>setTimeout(resolve,150));

    validateDatabase(report, database);

    updateScanProgress(

        30,

        "Checking prefixes..."

    );

        await new Promise(resolve=>setTimeout(resolve,150));

    validatePrefixes(report, database);

    updateScanProgress(

        50,

        "Checking folders..."

    );

        await new Promise(resolve=>setTimeout(resolve,150));

    validateFolders(report, database);

    updateScanProgress(

        70,

        "Checking image count..."

    );

        await new Promise(resolve=>setTimeout(resolve,150));

    validateImageCount(report, database);

    updateScanProgress(

        80,

        "Checking metadata..."

    );

        await new Promise(resolve=>setTimeout(resolve,150));

    validateMetadata(report, database);

    updateScanProgress(

        85,

        "Checking naming convention..."

    );

        await new Promise(resolve=>setTimeout(resolve,150));

    validateNamingConvention(report, database);

    updateScanProgress(

        90,

        "Checking repository integrity..."

    );

        await new Promise(resolve=>setTimeout(resolve,150));

    validateRepositoryIntegrity(report, database);

    updateScanProgress(

        95,

        "Checking repository statistics..."

    );

        await new Promise(resolve=>setTimeout(resolve,150));

    validateRepositoryStatistics(report, database);

    updateScanProgress(

        98,

        "Generating report..."

    );

        await new Promise(resolve=>setTimeout(resolve,150));

    calculateHealth(report);

    if(typeof renderHealthReport==="function"){

        renderHealthReport(report);

    }

}

//----------------------------------------------------
// Database Validation
//----------------------------------------------------

function validateDatabase(report, database){

    if(!Array.isArray(database)){

        report.errors++;

        report.items.push({

            type:"warning",

            title:"Missing Field",

            folder:item.folder,

            field:field,

            current:"(empty)",

            expected:"Required value",

            message:`${field} is empty.`

        });

        return;

    }

    report.passed++;

}

//----------------------------------------------------
// Prefix Validation
//----------------------------------------------------

function validatePrefixes(report, database){

    const seen = new Set();

    database.forEach(item=>{

        if(seen.has(item.prefix)){

            report.errors++;

            report.items.push({

                type:"error",

                title:"Duplicate Prefix",

                message:item.prefix

            });

        }

        seen.add(item.prefix);

    });

    report.passed++;

}

//----------------------------------------------------
// Folder Validation
//----------------------------------------------------

function validateFolders(report, database){

    const seen = new Set();

    database.forEach(item=>{

        if(seen.has(item.folder)){

            report.errors++;

            report.items.push({

                type:"error",

                title:"Duplicate Folder",

                message:item.folder

            });

        }

        seen.add(item.folder);

    });

    report.passed++;

}

//----------------------------------------------------
// Image Count Validation
//----------------------------------------------------

function validateImageCount(report, database){

    database.forEach(item=>{

        if(item.imagesCount!==7){

            report.warnings++;

            report.items.push({

                type:"warning",

                title:"Image Count",

                message:

                    `${item.folder} has ${item.imagesCount} images`

            });

        }

    });

    report.passed++;

}

//----------------------------------------------------
// Metadata Validation
//----------------------------------------------------

function validateMetadata(report, database){

    const validGroups = [

        "BR2WP",

        "BR2WPH",

        "BRWP",

        "BRWPH"

    ];

    database.forEach(item=>{

        //------------------------------------------------
        // Required Fields
        //------------------------------------------------

        const required = [

            "title",

            "group",

            "folder",

            "prefix",

            "position",

            "rotorType",

            "rotorPair",

            "lugHoles",

            "imagesCount",

            "status"

        ];

        required.forEach(field=>{

            if(

                item[field]===undefined ||

                item[field]==="" ||

                item[field]===null

            ){

                report.warnings++;

                report.items.push({

                    type:"warning",

                    title:"Missing Field",

                    message:

                        `${field} is empty.`

                });

            }

        });

        //------------------------------------------------
        // Group Validation
        //------------------------------------------------

        if(

            !validGroups.includes(item.group)

        ){

            report.errors++;

            report.items.push({

                type:"error",

                title:"Invalid Group",

                folder:item.folder,

                field:"Group",

                current:item.group,

                expected:"BR2WP / BRWP / BR2WPH / BRWPH",

                message:`${item.group} is not valid.`

        }); 

        }

        //------------------------------------------------
        // Rotor Pair
        //------------------------------------------------

        if(

            item.rotorPair!==1 &&

            item.rotorPair!==2

        ){

            report.errors++;

            report.items.push({

                type:"error",

                title:"Invalid Rotor Pair",

                message:

                    item.rotorPair

            });

        }

        //------------------------------------------------
        // Image Count
        //------------------------------------------------

        if(

            item.imagesCount<1 ||

            item.imagesCount>7

        ){

            report.errors++;

            report.items.push({

                type:"error",

                title:"Invalid Image Count",

                message:

                    item.imagesCount

            });

        }

    });

    report.passed++;

}

//----------------------------------------------------
// Naming Convention Validation
//----------------------------------------------------

function validateNamingConvention(report, database){

    database.forEach(item=>{

        //--------------------------------------------
        // Group must match Folder
        //--------------------------------------------

        if(

            !item.folder.startsWith(item.group)

        ){

            report.errors++;

            report.items.push({

                type:"error",

                title:"Folder Naming",

                message:

                    `${item.folder} does not match group ${item.group}.`

            });

        }

        //--------------------------------------------
        // Folder must contain SET
        //--------------------------------------------

        if(

            !/SET\d{4}$/i.test(item.folder)

        ){

            report.errors++;

            report.items.push({

                type:"error",

                title:"Folder Format",

                message:item.folder

            });

        }

        //--------------------------------------------
        // Prefix format
        //--------------------------------------------

        if(

            !/\d{4}$/.test(item.prefix)

        ){

            report.errors++;

            report.items.push({

                type:"error",

                title:"Prefix Format",

                message:item.prefix

            });

        }

    });

    report.passed++;

}

//----------------------------------------------------
// Repository Integrity Validation
//----------------------------------------------------

function validateRepositoryIntegrity(report, database){

    const validPositions = [

        "Left",

        "Right",

        "Left and Right"

    ];

    const validRotorTypes = [

        "Plain",

        "Drilled & Slotted"

    ];

    const validYesNo = [

        "Yes",

        "No"

    ];

    const validStatus = [

        "Generic Images"

    ];

    database.forEach(item=>{

        //--------------------------------------------
        // Position
        //--------------------------------------------

        if(

            !validPositions.includes(item.position)

        ){

            report.errors++;

            report.items.push({

                type:"error",

                title:"Invalid Position",

                message:

                    `${item.folder} → ${item.position}`

            });

        }

        //--------------------------------------------
        // Rotor Type
        //--------------------------------------------

        if(

            !validRotorTypes.includes(item.rotorType)

        ){

            report.errors++;

            report.items.push({

                type:"error",

                title:"Invalid Rotor Type",

                message:

                    `${item.folder} → ${item.rotorType}`

            });

        }

        //--------------------------------------------
        // Brake Pads
        //--------------------------------------------

        if(

            !validYesNo.includes(item.brakePads)

        ){

            report.errors++;

            report.items.push({

                type:"error",

                title:"Invalid Brake Pads",

                message:

                    `${item.folder} → ${item.brakePads}`

            });

        }

        //--------------------------------------------
        // Hardware
        //--------------------------------------------

        if(

            !validYesNo.includes(item.hardware)

        ){

            report.errors++;

            report.items.push({

                type:"error",

                title:"Invalid Hardware",

                message:

                    `${item.folder} → ${item.hardware}`

            });

        }

        //--------------------------------------------
        // Status
        //--------------------------------------------

        if(

            !validStatus.includes(item.status)

        ){

            report.errors++;

            report.items.push({

                type:"error",

                title:"Invalid Status",

                message:

                    `${item.folder} → ${item.status}`

            });

        }

    });

    report.passed++;

}

//----------------------------------------------------
// Repository Statistics Validation
//----------------------------------------------------

function validateRepositoryStatistics(report, database){

    const expectedGroups = [

        "BR2WP",
        "BR2WPH",
        "BRWP",
        "BRWPH"

    ];

    const groupTotals = {};

    let totalImages = 0;

    database.forEach(item=>{

        groupTotals[item.group] =

            (groupTotals[item.group] || 0) + 1;

        totalImages += item.imagesCount || 0;

    });

    //----------------------------------------
    // Missing Groups
    //----------------------------------------

    expectedGroups.forEach(group=>{

        if(!groupTotals[group]){

            report.warnings++;

            report.items.push({

                type:"warning",

                title:"Empty Group",

                message:

                    `${group} contains no sets.`

            });

        }

    });

    //----------------------------------------
    // Unexpected Groups
    //----------------------------------------

    Object.keys(groupTotals).forEach(group=>{

        if(!expectedGroups.includes(group)){

            report.errors++;

            report.items.push({

                type:"error",

                title:"Unexpected Group",

                message:group

            });

        }

    });

    //----------------------------------------
    // Total Images
    //----------------------------------------

    const expectedImages =

        database.length * 7;

    if(totalImages !== expectedImages){

        report.warnings++;

        report.items.push({

            type:"warning",

            title:"Repository Image Count",

            message:

                `Expected ${expectedImages}, found ${totalImages}.`

        });

    }

    report.passed++;

}

//----------------------------------------------------
// Health Score
//----------------------------------------------------

function calculateHealth(report){

    const penalty =

        (report.errors*10)+

        (report.warnings*2);

    report.score =

        Math.max(

            0,

            100-penalty

        );

}