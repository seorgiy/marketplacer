var auto_close = true
var active_search = false
const ITEMS_LIMIT = 100

chrome.storage.sync.get('auto_close').then(options => { 
  auto_close = options['auto_close'] ?? true
})

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request['command'] == 'search') { 
      active_search = true
      search()
    }
  }
);

const sendItemsToBack = (items) => {
  chrome.runtime.sendMessage({ command: 'push_items', value: items})
}

const closeWindow = () => {
  chrome.runtime.sendMessage({ command: 'close_me'})
}

const finish = (items) => {
  sendItemsToBack(items)
  if (auto_close) setTimeout(closeWindow, 500);
  return 
}