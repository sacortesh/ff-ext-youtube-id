console.warn("YT ID Script");

//control variables

let injected = false;

initiate();

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.query === "update view") {
    console.warn("YT ID Load update view");
    initiate();
  } else if (request.query === "full_navigation") {
    console.warn("YT ID Load page full navigation");
    initiate();
  } else if (request.query === "partial_navigation") {
    console.warn("YT ID Load page partial navigation");
    initiate(2000);
  }
});

function initiate(delay = 0) {
  console.warn("YT ID Initiate Called");

  if (!isHeaderElementAppended()) injectHeader();

  if (delay) {
    execute();
  } else {
    setTimeout(function () {
      execute();
    }, 2000);
  }
}

function injectButton() {
  let btnElement = document.createElement("button");
  btnElement.setAttribute("type", "button");
  btnElement.innerText = "Copy ID";
  btnElement.setAttribute("name", "ytid-copy");

  let elementAnchorArray = document.querySelectorAll(
    "div.style-scope.ytd-channel-name"
  );
  //let parentDiv = elementAnchor.parentNode;
  elementAnchorArray[2].append(btnElement);

  btnElement.addEventListener(
    "click",
    function () {
      sendTextToClipboard(currentChannelId);
    },
    false
  );

  injected = true;
}

function injectHeader() {
  let headerElement = document.createElement("div");
  headerElement.innerText = "Loading...";
  headerElement.setAttribute("class", "ytd-cz-debug-channel-info"); // Set a custom class for styling
  headerElement.style.width = "15%"; // Set the width of the header to 100% of the parent element
  headerElement.style.height = "2.5rem"; // Set the width of the header to 100% of the parent element
  headerElement.style.backgroundColor = "#FFD700";
  headerElement.style.color = "#FFFFFF";
  headerElement.style.position = "sticky";
  headerElement.style.zIndex = "2025";
  headerElement.style.marginLeft = "72.5%";
  headerElement.style.paddingTop = "0.25rem";

  document.body.insertBefore(headerElement, document.body.firstChild);

  // Append the header element to the body element or another appropriate parent element
  //document.body.prepend(headerElement); // Prepend to the body to place it at the top of the page

  injected = true;
}

function isHeaderElementAppended() {
  let headerElement = document.querySelector(".ytd-cz-debug-channel-info"); // Replace with your custom class name

  console.warn("lement foundd?");
  console.warn(headerElement);
  // If the header element is found in the DOM, it means it has been appended
  if (headerElement) {
    console.warn("found");

    return true;
  } else {
    console.warn("not found");

    return false;
  }
}

function execute(retries = 0) {
  if (retries > 4) {
    console.error("Max retries reached. Unable to execute.");
    return;
  }

  if (!isHeaderElementAppended()) {
    injectHeader();
  }

  try {
    let currentChannelId = getIdFromLinks();
    let currentChannelName = getChannelName();

    let htmlContent = assembleDebugContent(
      currentChannelId,
      currentChannelName
    );

    updateDebugContent(htmlContent);

    // currentChannelId = getMeta('channelId');
    console.log(currentChannelId);
  } catch (err) {
    console.warn(err);
    setTimeout(function () {
      execute(retries + 1);
    }, 1000);
  }
}

function assembleDebugContent(channelId, channelName) {
  let rowElement = document.createElement("tr");
  let channelIdCell = document.createElement("td");
  channelIdCell.innerText = channelId;

  let channelNameCell = document.createElement("td");
  channelNameCell.innerText = channelName;

  rowElement.appendChild(channelIdCell);
  rowElement.appendChild(channelNameCell);

  return rowElement.outerHTML;
}

function updateDebugContent(htmlContent) {
  let headerElement = document.querySelector(".ytd-cz-debug-channel-info"); // Replace with your custom class name
  console.warn(htmlContent);
  headerElement.innerHTML = htmlContent;
}

function getIdFromLinks() {
  let element = document.querySelectorAll(
    "a.yt-simple-endpoint.style-scope.ytd-video-owner-renderer"
  );
  let route;

  if (element != null && element[1]) {
    console.warn("YT ID: Found element", element);
    route = element[1].href;
    console.log(route);
  }

  try {
    if (route) {
      return extractIdFromUrl(route);
    } else {
      throw new Error("Route is not defined");
    }
  } catch (error) {
    console.error("Error in getIdFromLinks():", error.message);
    throw error;
  }
}

function getChannelName() {
  let element = document.querySelectorAll(
    ".complex-string a.yt-formatted-string"
  );
  let route;

  if (element != null && element[0]) {
    console.warn("YT ID: Found element", element);
    route = element[0].innerHTML;
  }

  console.warn("YTI:", route);
  if (!route) {
    throw new Error("Route is not defined");
  }
  return route;
}

//can be extracted from meta as well UC7W3o1VkFdTWIahcZhNKENw <meta itemprop="channelId" content="UC7W3o1VkFdTWIahcZhNKENw">

function extractIdFromUrl(urlRaw) {
  let reg = new RegExp("https://www.youtube.com/channel/(.+)$");
  let reeg2 = new RegExp("https://www.youtube.com/@(.+)$");

  let result = "";

  let extraction = urlRaw.match(reg);

  if (!extraction) {
    extraction = urlRaw.match(reeg2);
    result = "@" + extraction[1];
  } else {
    result = extraction[1];
  }
  console.warn(extraction);
  return result;
}

function getMeta(metaName) {
  const metas = document.getElementsByTagName("meta");

  for (let i = 0; i < metas.length; i++) {
    if (metas[i].getAttribute("itemprop") === metaName) {
      return metas[i].getAttribute("content");
    }
  }

  return "";
}

function sendTextToClipboard(text) {
  navigator.clipboard.writeText(text);
  console.log("text copied");
}
