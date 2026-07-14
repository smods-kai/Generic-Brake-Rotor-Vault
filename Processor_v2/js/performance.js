//====================================================
//
// Performance Monitor
//
//====================================================

const Performance={

    start:0,

    stop:0

};

function beginMeasure(){

    Performance.start=

        performance.now();

}

function endMeasure(name){

    Performance.stop=

        performance.now();

    console.info(

        `[${name}] ${(

            Performance.stop-

            Performance.start

        ).toFixed(1)} ms`

    );

}