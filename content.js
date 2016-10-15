/**
 * This part of the extension is the one that is aware of the visited web page DOM and therefore
 * can parse it & send the information about it to the background/action page.
 */

// Inform the background page that the visited web page DOM is loaded and send a message to the background
// if visited page is related to a commit or pull request:
var data = getFilesInfoFromWebPage();

if (data) {
    chrome.runtime.sendMessage({
        from: 'content',
        subject: 'DOMContentLoaded',
        data: data
    }, function(response) {
        handleResponse(response);
    });
}

function getFilesInfoFromWebPage() {

        // 1. Collect the changed files data :
        var listElements = document.querySelectorAll('#files div.file .file-info');

        // Make sure that we are visiting a Github commit or pull request page:
        if (listElements.length === 0) {
            return false;
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

        return gitFilesInfo;
}

function handleResponse(response) {
    var div = document.createElement('div');
    div.setAttribute('id', 'tree-extension-div');
    div.innerHTML = response.fileDetails;
    document.body.appendChild(div);
    document.getElementById("do-show-changed-files").addEventListener("click", function(evt) {
        evt.preventDefault();
        var changedFilesList = document.getElementById('changed-files-list');
        changedFilesList.style.display = changedFilesList.style.display == 'none' ? 'block' : 'none';
    });
    $('#tree-view-container').jstree({
        "core" : {
            "themes" : {
                "variant" : "small"
            }
        }
    });
    var span = document.createElement('span');
    span.setAttribute('id', 'ext-expand-panel');
    span.innerText = '>>';
    document.body.appendChild(span);
    $('#ext-expand-panel').click(function() {
        togglePanel();
    });
}

function togglePanel()
{
    var $panel = $("#tree-extension-div");
    var $toggleBtn = $('#ext-expand-panel');

    if ($panel.hasClass('ext-panel-expanded')) {
        $panel.removeClass('ext-panel-expanded');
        $toggleBtn.html('>>');
    } else {
        $panel.addClass('ext-panel-expanded');
        $toggleBtn.html('<<');
    }
}
