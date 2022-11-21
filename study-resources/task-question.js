if (!window.questionId || typeof window.questionId !== "string" || !window.taskNumber || typeof window.taskNumber !== "number") {
    throw new Error("Global variables not set!");
}

/**
 * Converts HTML in string-form to a list of HTMLElement objects.
 *
 * @param {string} html
 * @returns {NodeListOf<ChildNode>}
 */
function htmlToElements(html) {
    const template = document.createElement("template");
    template.innerHTML = html;
    return template.content.childNodes;
}

const iframeHtml = `
<button type="button" id="start-task-button" class="btn btn-lg btn-success">Begin</button>
<div id="shwa-iframe-container" style="display: none">
    <iframe id="shwa-iframe" src="https://blackdragon17.github.io/Smarthome-Webshop-Assistant/?setup=study-task-${window.taskNumber}"></iframe>
</div>
`.trim();
const iframeEl = htmlToElements(iframeHtml);

const skipTaskButtomHtml = `<button type="button" id="skip-task-button" class="btn btn-lg btn-danger" style="display: none;">Skip step</button>`;
const skipTaskButtonEl = htmlToElements(skipTaskButtomHtml);

const resetShwaButtonHtml = `
<div id="reset-button-container" class="col-xs-6 text-middle">
    <button type="button" id="reset-shwa-button" class="btn btn-lg btn-danger" style="display: none;">Reset SHWA state</button>
</div>
`.trim();
const resetShwaButtonEl = htmlToElements(resetShwaButtonHtml);


const skipButtonDelay = 15; // Button-show delay in seconds
const taskTimeout = 3; // Task timeout in minutes

let taskStartTime = 0;
let skipButtonTimerId = 0;
let taskTimeoutTimerId = 0;


$(document).on("ready pjax:scriptcomplete", function() {
    // Hide not needed elements
    $("#ls-button-submit").hide();
    $("#ls-button-previous").hide();
    $(".question-container").css({ background: "none", border: "none" });
    $(".answer-container").hide();

    // Inject HTML
    $("div#ls-question-text-" + window.questionId)[0].append(...iframeEl);
    $("#ls-button-submit")[0].after(...skipTaskButtonEl);
    $("div.col-xs-6.text-left")[0].after(...resetShwaButtonEl);

    const navbarHeight = $(".navbar.navbar-default")[0].offsetHeight;
    $("#shwa-iframe-container").css({ height: `calc(100vh - ${ navbarHeight }px - 20px)` });


    window.addEventListener("message", (event) => {
        if (event.origin !== "https://blackdragon17.github.io") {
            return;
        }

        if (event.data === "task-successful") {
            $("#" + window.questionId).val(Date.now() - taskStartTime);
        } else if (event.data === "task-failed") {
            $("#" + window.questionId).val("FAILED");
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
            $("#" + window.questionId).val("TIMEOUT");
            $("#skip-task-button").hide();
            $("#reset-shwa-button").hide();
            $("#ls-button-submit").fadeIn(500);
        }, taskTimeout * 60000);
    });

    $("#skip-task-button").on("click", function() {
        $("#" + window.questionId).val("SKIPPED");
        $("#ls-button-submit").trigger("click");
    });

    $("#reset-shwa-button").on("click", function() {
        $("#shwa-iframe")[0].contentWindow.postMessage("reset-state", "https://blackdragon17.github.io/Smarthome-Webshop-Assistant/");
    });
});
