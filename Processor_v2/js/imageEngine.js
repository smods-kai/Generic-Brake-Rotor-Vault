//====================================================
// RotorVault Image Engine
//====================================================

const ImageEngine = {

    //------------------------------------------------
    // Build Master Image URL
    //------------------------------------------------

    master(set){

        return `${CONFIG.IMAGE_BASE}/${set.group}/${set.folder}/${set.prefix}_master_v2.JPG?v=${CONFIG.CACHE}`;

    },

    //------------------------------------------------
    // Build Gallery
    //------------------------------------------------

    gallery(set){

        return [

            `${CONFIG.IMAGE_BASE}/${set.group}/${set.folder}/${set.prefix}_master_v2.JPG?v=${CONFIG.CACHE}`,

            `${CONFIG.IMAGE_BASE}/${set.group}/${set.folder}/${set.prefix}_02_v2.JPG?v=${CONFIG.CACHE}`,

            `${CONFIG.IMAGE_BASE}/${set.group}/${set.folder}/${set.prefix}_03_v2.JPG?v=${CONFIG.CACHE}`,

            `${CONFIG.IMAGE_BASE}/${set.group}/${set.folder}/${set.prefix}_04_v2.JPG?v=${CONFIG.CACHE}`,

            `${CONFIG.IMAGE_BASE}/${set.group}/${set.folder}/${set.prefix}_05_v2.JPG?v=${CONFIG.CACHE}`,

            `${CONFIG.IMAGE_BASE}/${set.group}/${set.folder}/${set.prefix}_06_v2.JPG?v=${CONFIG.CACHE}`,

            `${CONFIG.IMAGE_BASE}/${set.group}/${set.folder}/${set.prefix}_07_v2.JPG?v=${CONFIG.CACHE}`

        ];

    }

};