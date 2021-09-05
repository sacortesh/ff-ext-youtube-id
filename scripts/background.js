window.devMode = false;

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
	console.log(tabId)
	console.log(changeInfo);
	
	if (typeof changeInfo.url !== 'undefined')
	{
		chrome.tabs.sendMessage(tabId, {
			query: 'page updated',
			url: changeInfo.url
		});
	}
});