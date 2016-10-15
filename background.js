// Sent MR (or commit)'s details as HTML to content.js when visited web page DOM is loaded
chrome.runtime.onMessage.addListener(function(msg, sender, response) {
   if ((msg.from == 'content') && (msg.subject == 'DOMContentLoaded')) {
       var fileDetails = buildGitFilesHtml(msg.data);
       response({fileDetails: fileDetails});
   }
});

/**
 * Return HTML div to be injected in the visited page, containing the current Pull Request (or commit)'s details.
 *
 * @param {string[]} gitFilesInfo
 *
 * @returns {string}
 */
function buildGitFilesHtml(gitFilesInfo) {

    // Return if no commit files
    if (gitFilesInfo === false) {
        document.getElementById('pr-summary').textContent = 'No content';
        return;
    }

    var fileList     = document.getElementById('changed-files-list');
    var filesChanged = [];
    var parser       = new GithubParser();

    var summary = parser.parseSummary(gitFilesInfo.changedFilesText, gitFilesInfo.changedLinesText);

    document.getElementById('summary-changed-files').textContent = summary.changedFiles;
    document.getElementById('summary-changed-lines').textContent = summary.createdLines;
    document.getElementById('summary-removed-lines').textContent = summary.removedLines;
    // document.getElementById('changed-files-count').textContent   = summary.changedFiles;

    for (var i = 0 ; i < gitFilesInfo.items.length ; i++) {
        var itemNode = document.createElement('li');

        var itemDetails = parser.parseChangedFileBlock(gitFilesInfo.items[i]);

        if (itemDetails === false)
            continue;

        // Add changed file in the changed files list
        itemNode.textContent = itemDetails.fullPath;
        fileList.appendChild(itemNode);

        if (itemDetails.created > 0) {
            var spanCreated = document.createElement('span');
            spanCreated.textContent = itemDetails.created;
            spanCreated.className = "ext-counter counter-created";
            itemNode.appendChild(spanCreated);
        }

        if (itemDetails.removed > 0) {
            spanRemoved = document.createElement('span');
            spanRemoved.textContent = itemDetails.removed;
            spanRemoved.className = "ext-counter counter-removed";
            itemNode.appendChild(spanRemoved);
        }

        var changedFile = new GitFile(
            itemDetails.fullPath,
            itemDetails.created,
            itemDetails.updated,
            itemDetails.removed
        );

        filesChanged.push(changedFile);
    }

    var root = new Root(parser.parseProjectName(gitFilesInfo.projectName));
    new TreeBuilder(root, filesChanged);
    var renderer = new TreeRenderer(root);
    var treeView = renderer.render();
    document.getElementById('tree-view-container').appendChild(treeView);

    return document.getElementById('main_content').innerHTML;
}
