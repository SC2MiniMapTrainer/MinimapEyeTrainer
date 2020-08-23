var crash = new Audio("sounds/crash.mp3");
crash.volume = 1.0;
var looked = false;
var started = false;
var resetTimer;
var checks = 0;
var missed = 0;
var interval = 0;
var corner;

function listenerToggle() {
    started = !started;
    if (!started) {
        $("#start_stop_toggle").text("Start!");
        clearInterval(resetTimer);
        $(".results_raw_numbers").text("Results: " + (checks - missed) + "/" + checks);
        let percent = (checks - missed) / checks * 100;
        $(".results_percentage").text(percent.toFixed(2) + "%");
        $(".results").removeClass("hidden");
        $(".settings").removeClass("hidden");
        checks = 0;
        missed = 0;
    } else {
        corner = $(".radio_container input[type='radio']:checked").val();
        interval = $("#interval").val() * 1000;
        resetTimer = setInterval(lookCheck, interval);
        $(".results").addClass("hidden");
        $("#start_stop_toggle").text("Stop!");
        $(".settings").addClass("hidden");
    }
}

webgazer.setRegression('ridge').setGazeListener(function(data, elapsedTime) {
    if (data == null) {
        return;
    }
    let xprediction = data.x;
    let yprediction = data.y;

    //400/750 are rough estimates of the minimap zone
    if ((corner === "bottom_left" && xprediction < 400 && yprediction > 750) ||
        (corner === "bottom_right" && xprediction > 1520 && yprediction > 750) ||
        (corner === "top_left" && xprediction < 400 && yprediction < 330) ||
        (corner === "top_right" && xprediction > 1520 && yprediction < 330)) {
        looked = true;
    }

}).begin();

console.log(webgazer.getRegression());

function lookCheck() {
    console.log("help");
    checks++;
    if (!looked) {
        //need to stop the sound in case the interval is too short
        crash.pause();
        crash.currentTime = 0;
        crash.play();
        missed++;
    }
    looked = false;
}

// // Kalman Filter defaults to on. Can be toggled by user.
window.applyKalmanFilter = true;

// // Set to true if you want to save the data even if you reload the page.
window.saveDataAcrossSessions = true;

window.onbeforeunload = function() {
    webgazer.end();
}