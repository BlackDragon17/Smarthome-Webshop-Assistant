import htmlToElements from "./html-to-elements.js";
import showModal from "./timeout-modal.js";


// Define HTML elements
const cssImportHtml = `<link rel="stylesheet" href="https://blackdragon17.github.io/Smarthome-Webshop-Assistant/study-resources/task-question.css">`;
const cssImportEl = htmlToElements(cssImportHtml);

const iframeHtml = `
<button type="button" id="start-task-button" class="btn btn-lg btn-success">Begin</button>
<div id="shwa-iframe-container" style="display: none;">
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


// Define variables
const skipButtonDelay = window.disableSkipTimer ? 0.1 : 15; // Button-show delay in seconds
const taskTimeout = 5; // Task timeout in minutes

let taskStartTime = null;
let shwaResets = 0;
let skipButtonTimerId = null;
let taskTimeoutTimerId = null;


// Hide not needed elements
$("button#ls-button-submit").hide();
$("button#ls-button-previous").hide();
$(".question-container").css({background: "none", border: "none"});
$(".answer-container").hide();


// Inject HTML
$("div#ls-question-text-" + window.questionId)[0].append(...cssImportEl, ...iframeEl);
$("button#ls-button-submit")[0].after(...skipTaskButtonEl);
$("div.col-xs-6.text-left")[0].after(...resetShwaButtonEl);


// Set iframe height
const navbarHeight = $(".navbar.navbar-default")[0].offsetHeight;
$("div#shwa-iframe-container").css({height: `calc(100vh - ${navbarHeight}px - 20px)`});


// Add postMessage listener
window.addEventListener("message", (event) => {
    if (event.origin !== "https://blackdragon17.github.io" || event.data !== "task-successful") {
        return;
    }

    clearTimeout(skipButtonTimerId);
    clearTimeout(taskTimeoutTimerId);
    const taskTime = Date.now() - taskStartTime;
    $("input#answer" + window.questionId).val(`time:${taskTime}; resets:${shwaResets}`);
    $("button#skip-task-button").hide();
    $("button#reset-shwa-button").hide();
    $("button#ls-button-submit").fadeIn(500);
});


// Set task start logic
$("button#start-task-button").on("click", function() {
    $("button#start-task-button").hide();
    $("div#shwa-iframe-container").show();
    $("button#reset-shwa-button").show();
    skipButtonTimerId = setTimeout(() => $("button#skip-task-button").fadeIn(500), skipButtonDelay * 1000);
    taskTimeoutTimerId = setTimeout(() => showModal("button#skip-task-button", taskTimeout), taskTimeout * 60000);

    const containerPosition = $("div#shwa-iframe-container")[0].getBoundingClientRect().top;
    const offsetPosition = containerPosition + window.pageYOffset - navbarHeight - 10;
    window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
    });

    taskStartTime = Date.now();
});


// Set task skip logic
$("button#skip-task-button").on("click", function() {
    $("input#answer" + window.questionId).val("time:SKIPPED; resets:" + shwaResets);
    $("button#ls-button-submit").trigger("click");
});


// Add SHWA reset postMessage
$("button#reset-shwa-button").on("click", function() {
    $("iframe#shwa-iframe")[0].contentWindow.postMessage("reset-state", "https://blackdragon17.github.io/Smarthome-Webshop-Assistant/");
    shwaResets++;
});
