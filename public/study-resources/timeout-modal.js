import htmlToElements from "./html-to-elements.js";

/**
 * Creates and opens the timeout modal.
 *
 * @param {string} proceedButtonQuery query selector of which button click() on proceed button press.
 * @param {number} timeoutDelayMin task timeout value in minutes.
 */
export default function showModal(proceedButtonQuery, timeoutDelayMin = 5) {
    const modalHtml = `
<div id="timeout-modal" class="modal fade" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Would you like to proceed?</h4>
            </div>
            <div class="modal-body">
                <p>This step of the study was meant to take less than ${timeoutDelayMin} minute${timeoutDelayMin === 1 ? "" : "s"} of your time.</p>
                <p>Would you like to proceed to the next study step now?</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Stay on this step</button>
                <button type="button" id="modal-proceed-button" class="btn btn-primary">Proceed to next step</button>
            </div>
        </div>
    </div>
</div>
`.trim();
    const modalEl = htmlToElements(modalHtml);

    $("div#myModalPrivacyEN")[0].after(...modalEl);
    $("div#timeout-modal button#modal-proceed-button").on("click", function() {
        if (proceedButtonQuery) {
            $(proceedButtonQuery).trigger("click");
        }
    });

    $("div#timeout-modal").modal({backdrop: "static"});
}
