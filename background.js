// Show page action icon in omnibar if current webpage's URL matches Github
// @TODO: matches gitlab also
function showPageAction( tabId, changeInfo, tab ) {
    if (tab.url.indexOf('https://github.com') == 0) {
        chrome.pageAction.show(tabId);
    }
};

// Call the above function when the url of a tab changes.
chrome.tabs.onUpdated.addListener(showPageAction);

chrome.runtime.onMessage.addListener(function(msg, sender) {
   if ((msg.from == 'content') && (msg.subject == 'showPageAction')) {
       chrome.pageAction.show(sender.tab.id);
   }
});
