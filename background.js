var tabs = []
var search_tab_id
var search_window_id

chrome.action.onClicked.addListener(tab => {
  chrome.tabs.create({url: chrome.runtime.getURL('search.html')});
});

const setTabs = (windowId) => {
  chrome.tabs.query({ windowId: windowId }).then(search_tabs => tabs = search_tabs.map(tab => { return tab.id }))
}

const askTab = (tab) => {
  chrome.tabs.sendMessage(tab.id, { command: "search" })
}

const pushItems = (items) => {
  chrome.windows.update(search_window_id, { focused: true })
  chrome.tabs.sendMessage(search_tab_id, { command: "render_items", value: items })
}

chrome.runtime.onMessage.addListener(
  function(request, sender, _sendResponse) {
    console.log(request['value'])
    if (request['command'] == 'set_window_id') {
      search_tab_id = sender.tab.id
      search_window_id = request['value']
      setTabs(request['value'])
      chrome.windows.update(search_window_id, { focused: true })
     }
    if (request['command'] == 'push_items') pushItems(request['value'])
  }
);

const updatedTab = (_tabId, changeInfo, tab) => {
  if (changeInfo.status == 'complete' && tabs.includes(tab.id)) askTab(tab)
}

chrome.tabs.onUpdated.addListener(updatedTab)
