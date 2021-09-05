console.warn("YT ID Script");

//control variables

let injected = false;
let currentChannelId = '';

initiate();

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.query === 'update view') {
        initiate();
    }

    else if (request.query === 'page updated') {
        initiate();
    }
});

function initiate() {
    console.warn("YT ID Load for page");

    activate();
}

function injectButton() {

    let btnElement = document.createElement("button");
    btnElement.setAttribute("type", "button");
    btnElement.innerText = "Copy ID";
    btnElement.setAttribute("name", "ytid-copy");

    let elementAnchorArray = document.querySelectorAll('div.style-scope.ytd-channel-name');
    //let parentDiv = elementAnchor.parentNode;
    elementAnchorArray[2].append(btnElement);

    btnElement.addEventListener("click", function () {
        sendTextToClipboard(currentChannelId);
    }, false);

    injected = true;
}


function activate() {

    setTimeout(function () {

        // stuff that happens for each web page load goes here
        /*
        let element = document.querySelectorAll('a.yt-simple-endpoint.style-scope.ytd-video-owner-renderer');
        let route;
    
        if (element != null) {
            console.warn("YT ID: Found element");
    
            route = element[1].href;
            console.log(route);
    
            let elementAnchor = document.querySelector('#info-strings');
            let parentDiv = elementAnchor.parentNode;
            parentDiv.append(btnElement);
    
            btnElement.addEventListener("click", function() {
                alert("My ID is: " + route);
            }, false);
        }
        */

        //attempt 2

        if (!injected) {
            injectButton();
        }

        currentChannelId = getIdFromLinks();
        // currentChannelId = getMeta('channelId');
        console.log(currentChannelId);

    }, 2000);

}

function getIdFromLinks(){
        let element = document.querySelectorAll('a.yt-simple-endpoint.style-scope.ytd-video-owner-renderer');
        let route;
    
        if (element != null) {
            console.warn("YT ID: Found element");
    
            route = element[1].href;
            console.log(route);
        }

        if(route){
            return extractIdFromUrl(route);
        }
}





//can be extracted from meta as well UC7W3o1VkFdTWIahcZhNKENw <meta itemprop="channelId" content="UC7W3o1VkFdTWIahcZhNKENw">

function extractIdFromUrl(urlRaw) {
    let reg = 'https\:\/\/www\.youtube\.com\/channel\/(.+)$';

    let extraction = urlRaw.match(reg);
    console.warn(extraction);
    return extraction[1];
}

function getMeta(metaName) {
    const metas = document.getElementsByTagName('meta');

    for (let i = 0; i < metas.length; i++) {
        if (metas[i].getAttribute('itemprop') === metaName) {
            return metas[i].getAttribute('content');
        }
    }

    return '';
}

function sendTextToClipboard(text) {
    navigator.clipboard.writeText(text);
    console.log('text copied');
}



