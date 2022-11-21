if (!window.answerInputId || typeof window.answerInputId !== "string") {
    throw new Error("Global variables not set!");
}

const skipButtonDelay = 15; // Button-show delay in seconds
const taskTimeout = 3; // Task timeout in minutes

let taskStartTime = 0;
let skipButtonTimerId = 0;
let taskTimeoutTimerId = 0;

$(document).on("ready pjax:scriptcomplete", function() {
    $("#ls-button-submit").hide();
    $("#ls-button-previous").hide();
    $(".question-container").css({ background: "none", border: "none" });
    $(".answer-container").hide();
    $("#shwa-iframe-container").hide();

    $("#ls-button-submit")[0].after($("#skip-task-button")[0]);
    $("div.col-xs-6.text-left")[0].after($("#reset-button-container")[0]);

    const navbarHeight = $(".navbar.navbar-default")[0].offsetHeight;
    $("#shwa-iframe-container").css({ height: `calc(100vh - ${ navbarHeight }px - 20px)` });


    window.addEventListener("message", (event) => {
        if (event.origin !== "https://blackdragon17.github.io") {
            return;
        }

        if (event.data === "task-successful") {
            $("#" + window.answerInputId).val(Date.now() - taskStartTime);
        } else if (event.data === "task-failed") {
            $("#" + window.answerInputId).val("FAILED");
        } else {
            return;
        }

        clearTimeout(skipButtonTimerId);
        clearTimeout(taskTimeoutTimerId);
        $("#skip-task-button").hide();
        $("#reset-shwa-button").hide();
        $("#ls-button-submit").fadeIn(500);
    });

    $("#start-task-button").on("click", function() {
        $("#start-task-button").hide();
        $("#shwa-iframe-container").show();
        $("#reset-shwa-button").show();
        skipButtonTimerId = setTimeout(() => $("#skip-task-button").fadeIn(500), skipButtonDelay * 1000);

        const containerPosition = $("#shwa-iframe-container")[0].getBoundingClientRect().top;
        const offsetPosition = containerPosition + window.pageYOffset - navbarHeight - 10;
        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });

        taskStartTime = Date.now();

        taskTimeoutTimerId = setTimeout(function() {
            $("#shwa-iframe")[0].contentWindow.postMessage("task-failed", "https://blackdragon17.github.io/Smarthome-Webshop-Assistant/");
            $("#" + window.answerInputId).val("TIMEOUT");
            $("#skip-task-button").hide();
            $("#reset-shwa-button").hide();
            $("#ls-button-submit").fadeIn(500);
        }, taskTimeout * 60000);
    });

    $("#skip-task-button").on("click", function() {
        $("#" + window.answerInputId).val("SKIPPED");
        $("#ls-button-submit").trigger("click");
    });

    $("#reset-shwa-button").on("click", function() {
        $("#shwa-iframe")[0].contentWindow.postMessage("reset-state", "https://blackdragon17.github.io/Smarthome-Webshop-Assistant/");
    });
});
