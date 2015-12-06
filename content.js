/**
 * This part of the extension is the one that is aware of the visited web page DOM and therefore
 * can parse it & send the information about it to the background/action page.
 */

// Inform the background page that the current tab should have a page action
chrome.runtime.sendMessage({
    from: 'content',
    subject: 'showPageAction'
});

chrome.runtime.onMessage.addListener(function(msg, sender, response) {
    // If message from popup when it its DOM is loaded :
    if ((msg.from == 'popup') && (msg.subject == 'DOMContentLoaded')) {
        // Collect the necessary data :
        var gitFilesInfo = {
            items: document.querySelectorAll('#toc ol li'),
            htmlList: document.querySelector('#toc ol').innerHTML,
            summary: document.querySelector('#toc .toc-diff-stats').textContent
        };
        // Respond to the sender (popup) :
        response(gitFilesInfo);
    }
});
