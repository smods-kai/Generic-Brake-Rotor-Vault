//====================================================
// Toast Notification
//====================================================

function showToast(message, type = "info") {

    console[type === "error" ? "error" : "log"](message);

}