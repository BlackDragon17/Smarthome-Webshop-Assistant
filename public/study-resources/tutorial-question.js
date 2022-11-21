import htmlToElements from "./html-to-elements.js";
import showModal from "./timeout-modal.js";

const cssImportHtml = `<link rel="stylesheet" href="https://blackdragon17.github.io/Smarthome-Webshop-Assistant/study-resources/task-question.css">`;
const cssImportEl = htmlToElements(cssImportHtml);

const iframeHtml = `
<button type="button" id="start-task-button" class="btn btn-lg btn-success">Begin</button>
<div id="shwa-iframe-container" style="display: none">
    <iframe id="shwa-iframe" src="https://blackdragon17.github.io/Smarthome-Webshop-Assistant/?setup=study-task-0"></iframe>
</div>
`.trim();
const iframeEl = htmlToElements(iframeHtml);

const ownSubmitButtonHtml = `<button type="button" id="own-submit-button" class="btn btn-lg btn-primary" style="display: none">Next</button>`;
const ownSubmitButtonEl = htmlToElements(ownSubmitButtonHtml);

const resetShwaButtonHtml = `
<div id="reset-button-container" class="col-xs-6 text-middle">
    <button type="button" id="reset-shwa-button" class="btn btn-lg btn-danger" style="display: none;">Reset SHWA state</button>
</div>
`.trim();
const resetShwaButtonEl = htmlToElements(resetShwaButtonHtml);


const skipButtonDelay = 10; // Button-show delay in seconds
const taskTimeout = 5; // Task timeout in minutes

let taskStartTime = 0;
let shwaResets = 0;

console.log("load");

// Hide not needed elements
$("button#ls-button-submit").hide();
$("button#ls-button-previous").hide();
$(".question-container").css({background: "none", border: "none"});
$(".answer-container").hide();

// Inject HTML
$("div#ls-question-text-" + window.questionId)[0].append(...cssImportEl, ...iframeEl);
$("button#ls-button-submit")[0].after(...ownSubmitButtonEl);
$("div.col-xs-6.text-left")[0].after(...resetShwaButtonEl);

// Set iframe height
const navbarHeight = $(".navbar.navbar-default")[0].offsetHeight;
$("#shwa-iframe-container").css({height: `calc(100vh - ${navbarHeight}px - 20px)`});

// Set task start logic
$("button#start-task-button").on("click", function() {
    $("button#start-task-button").hide();
    $("div#shwa-iframe-container").show();
    $("button#reset-shwa-button").show();
    setTimeout(() => $("button#own-submit-button").fadeIn(500), skipButtonDelay * 1000);
    setTimeout(() => showModal("button#own-submit-button"), taskTimeout * 60000);

    const containerPosition = $("div#shwa-iframe-container")[0].getBoundingClientRect().top;
    const offsetPosition = containerPosition + window.pageYOffset - navbarHeight - 10;
    window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
    });

    taskStartTime = Date.now();
});

// Set task submit logic
$("button#own-submit-button").on("click", function() {
    const taskTime = Date.now() - taskStartTime;
    $("input#answer" + window.questionId).val(`time:${taskTime}; resets:${shwaResets}`);
    $("button#ls-button-submit").trigger("click");
});

// Add SHWA reset postMessage
$("button#reset-shwa-button").on("click", function() {
    $("iframe#shwa-iframe")[0].contentWindow.postMessage("reset-state", "https://blackdragon17.github.io/Smarthome-Webshop-Assistant/");
    shwaResets++;
});
