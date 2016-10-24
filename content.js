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
    // If message from is 'popup' and its DOM is loaded :
    if ((msg.from == 'popup') && (msg.subject == 'DOMContentLoaded')) {

        // 1. Collect the changed files data :
        var listElements = document.querySelectorAll('#files div.file .file-info');
        // Make sure that we are visiting a Github commit or pull request page:
        if (listElements.length === 0) {
            response(false);
            return;
        }
        var items = [];
        for (var i = 0 ; i < listElements.length ; i++)
        {
            var content = listElements[i].innerHTML.trim();
            items.push(content);
        }

        // 2. Collect summary data (total changed files, new code lines, deleted code lines):

        var gitFilesInfo = {
            items: items,
            projectName: document.querySelector('h1').textContent,
            changedFilesText: document.querySelector('#files_bucket div.toc-select button').textContent,
            changedLinesText: document.querySelector('#files_bucket span.diffbar-item.diffstat').textContent
        };
        // Respond to the sender ('popup' page action) :
        response(gitFilesInfo);
    }
});
