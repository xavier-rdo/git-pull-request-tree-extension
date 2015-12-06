// Once the DOM is ready :
window.addEventListener('DOMContentLoaded', function() {
   chrome.tabs.query({
       active: true,
       currentWindow: true
   },
   function(tabs) {
       chrome.tabs.sendMessage(
           tabs[0].id,
           { from: 'popup', subject: 'DOMContentLoaded' },
           {},
           displayGitFiles
       );
   });
});

function displayGitFiles(gitFilesInfo) {

    document.getElementById('pr-summary').textContent = gitFilesInfo.summary;

    var fileList = document.getElementById('changed-files-list');
    var filesChanged = [];
    var parser = new GithubParser();

    document.getElementById('changed_files_count').textContent = gitFilesInfo.items.length;

    for (var i = 0 ; i < gitFilesInfo.items.length ; i++) {
        var itemNode = document.createElement('li');
        var itemDetails = parser.parseChangedFileLine(gitFilesInfo.items[i]);

        // Add changed file in the changed files list
        itemNode.textContent = itemDetails.fullPath;
        fileList.appendChild(itemNode);

        if (itemDetails.created > 0) {
            var spanCreated = document.createElement('span');
            spanCreated.textContent = itemDetails.created;
            spanCreated.className = "counter counter-created";
            itemNode.appendChild(spanCreated);
        }

        if (itemDetails.removed > 0) {
            spanRemoved = document.createElement('span');
            spanRemoved.textContent = itemDetails.removed;
            spanRemoved.className = "counter counter-removed";
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

    var root = new Root();
    new TreeBuilder(root, filesChanged);
    var renderer = new TreeRenderer(root);
    var treeView = renderer.render();
    document.getElementById('tree-view-container').appendChild(treeView);
}
