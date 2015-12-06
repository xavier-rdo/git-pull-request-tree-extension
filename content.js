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
        var items = [];
        var listElements = document.querySelectorAll('#toc ol li');
        for (var i = 0 ; i < listElements.length ; i++)
        {
            items.push((listElements[i].textContent).trim().replace('', ''));
        }
        var gitFilesInfo = {
            items: items,
            summary: document.querySelector('#toc .toc-diff-stats').textContent
        };
        // Respond to the sender ('popup' page action) :
        response(gitFilesInfo);
    }
});
