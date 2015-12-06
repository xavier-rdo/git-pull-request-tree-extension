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
    for (var i = 0 ; i < gitFilesInfo.items.length ; i++) {
        var itemNode = document.createElement('li');
        itemNode.textContent =  gitFilesInfo.items[i];
        fileList.appendChild(itemNode);
    }
    document.getElementById('changed_files_count').textContent = gitFilesInfo.items.length;
}
