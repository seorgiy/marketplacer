chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request['command'] == 'search') search()
  }
);

const sendItemsToBack = (items) => {
  chrome.runtime.sendMessage({ command: 'push_items', value: items})
}

const finish = (items) => {
  sendItemsToBack(items)
  return window.close();
}