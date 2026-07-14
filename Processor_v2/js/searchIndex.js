//====================================================
//
// RotorVault Processor v2
// Search Index
//
//====================================================

const SearchIndex = {

    index : []

};

//----------------------------------------------------
// Build Index
//----------------------------------------------------

function buildSearchIndex(data){

    SearchIndex.index = data.map(item=>{

        return{

            item,

            text:[

                item.folder,

                item.group,

                item.prefix,

                item.rotorType,

                item.position,

                item.title

            ]

            .join(" ")

            .toLowerCase()

        };

    });

}

//----------------------------------------------------
// Search
//----------------------------------------------------

function searchDatabase(keyword){

    keyword =

        keyword

        .trim()

        .toLowerCase();

    if(keyword===""){

        return getDatabase();

    }

    return SearchIndex.index

        .filter(entry=>

            entry.text.includes(

                keyword

            )

        )

        .map(entry=>entry.item);

}

console.info(

    "[SearchIndex] Ready"

);