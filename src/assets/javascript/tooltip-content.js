/**
 * A DTO for configuration of and content to be displayed in the TutorialTooltip.
 */
export default class TooltipContent {
    /**
     * @param {string} [heading] heading to display in tooltip.
     * @param {string[]} paragraphs paragraphs to display in tooltip.
     * @param {HTMLElement} [target] optional element to anchor the tooltip to.
     * @param {string} [placement] where to place the tooltip relative to the anchor.
     * @param {boolean} [showArrow] whether to display an arrow pointing to the anchor.
     */
    constructor(heading, paragraphs, target, placement, showArrow) {
        this.heading = heading;
        this.paragraphs = paragraphs ?? [];
        this.target = target;
        this.placement = target && !placement ? "auto" : placement;
        this.showArrow = target && showArrow;
    }
}
