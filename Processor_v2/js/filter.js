//----------------------------------------------------
// Load Related Sets
//----------------------------------------------------

function loadRelatedSets(item){

    const panel =
        document.getElementById("relatedSets");

    panel.innerHTML = "";

    const related = getRelated(item);

    related.slice(0,6).forEach(set=>{

        const card =
            document.createElement("div");

        card.className = "related-card";

        card.innerHTML = `

            <img
                src="${getImageURL(set,"master")}"
                loading="lazy">

            <div class="related-info">

                <div class="related-title">

                    ${set.folder}

                </div>

                <div class="related-group">

                    ${set.rotorType}

                </div>

            </div>

        `;

        card.onclick = ()=>{

            openPreview(set);

        };

        panel.appendChild(card);

    });

}

//----------------------------------------------------
// Initialize Filters
//----------------------------------------------------

function initializeFilters(){

    console.log("Filters Ready");

}