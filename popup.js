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
    document.getElementById('loaded-info').textContent = "Github page has been loaded";
    console.log(gitFilesInfo.items);
}
