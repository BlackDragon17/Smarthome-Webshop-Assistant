import htmlToElements from "./util/html-to-elements.js";
import showModal from "./util/timeout-modal.js";
import scrollTo from "./util/scroll-to.js";


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

const ownSubmitButtonHtml = `<button type="button" id="own-submit-button" class="btn btn-lg btn-primary" style="display: none;">Next</button>`;
const ownSubmitButtonEl = htmlToElements(ownSubmitButtonHtml);

const resetShwaButtonHtml = `
<div id="reset-button-container" class="col-xs-6 text-middle">
    <button type="button" id="reset-shwa-button" class="btn btn-lg btn-danger" style="display: none;">Reset SHWA state</button>
</div>
`.trim();
const resetShwaButtonEl = htmlToElements(resetShwaButtonHtml);


// Define variables
const questionId = "563851X1005X15665";
const radioInputIds = [
    "answer563851X1005X15667Yes", "answer563851X1005X15667No", "answer563851X1005X15667"
];

const taskTimeout = 5; // Task timeout in minutes

let taskStartTime = null;
let shwaResets = 0;


// Hide not needed elements
$("button#ls-button-submit").hide();
$("button#ls-button-previous").hide();
$("#question15665").css({background: "none", border: "none"});
$("#question15665 > .answer-container").hide();

for (const item of radioInputIds) {
    $("#" + item).prop("disabled", true);
}


// Inject HTML
$("div#ls-question-text-" + questionId)[0].append(...cssImportEl, ...iframeEl);
$("button#ls-button-submit")[0].after(...ownSubmitButtonEl);
$("div.col-xs-6.text-left")[0].after(...resetShwaButtonEl);


// Set iframe height
const navbarHeight = $(".navbar.navbar-default")[0].offsetHeight;
$("div#shwa-iframe-container").css({height: `calc(100vh - ${navbarHeight}px - 20px)`});


// Set task start logic
$("button#start-task-button").on("click", function() {
    $("button#start-task-button").hide();
    $("div#shwa-iframe-container").show();
    $("button#own-submit-button").show();

    setTimeout(() => showModal("button#own-submit-button", taskTimeout), taskTimeout * 60000);
    for (const item of radioInputIds) {
        $("#" + item).prop("disabled", false);
    }
    scrollTo($("div#shwa-iframe-container")[0]);

    taskStartTime = Date.now();
});


// Set task submit logic
$("button#own-submit-button").on("click", function() {
    const taskTime = Date.now() - taskStartTime;
    $("input#answer" + questionId).val(`time:${taskTime}; resets:${shwaResets}`);
    $("button#ls-button-submit").trigger("click");
});


// Add SHWA reset postMessage
$("button#reset-shwa-button").on("click", function() {
    $("iframe#shwa-iframe")[0].contentWindow.postMessage("reset-state", "https://blackdragon17.github.io/Smarthome-Webshop-Assistant/");
    shwaResets++;
});
