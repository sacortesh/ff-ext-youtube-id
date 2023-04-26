window.devMode = false;

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
	console.log(tabId)
	console.log(changeInfo);
	
	if (typeof changeInfo.url !== 'undefined')
	{
		console.warn('reeddireection full');
		chrome.tabs.sendMessage(tabId, {
			query: 'full_navigation',
			url: changeInfo.url
		});
	}

	if (typeof changeInfo.url !== 'undefined' && changeInfo.status === 'complete') {
		console.warn('reeddireection partial');
		chrome.tabs.sendMessage(tabId, {
		  query: 'partial_navigation',
		  url: changeInfo.url
		});
	  }
});