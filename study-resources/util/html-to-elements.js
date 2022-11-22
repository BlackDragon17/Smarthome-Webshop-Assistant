/**
 * Converts HTML in string-form to a list of HTMLElement objects.
 *
 * @param {string} html
 * @returns {NodeListOf<ChildNode>}
 */
export default function htmlToElements(html) {
    const template = document.createElement("template");
    template.innerHTML = html;
    return template.content.childNodes;
}
