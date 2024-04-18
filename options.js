const saveMarketsOption = () => {
  let options = {}
  document.querySelectorAll('#market_options > span > select').forEach(node => {
    options[node.name] = node.value
  })

  chrome.storage.sync.set({ market_options: options });
};

const saveAutoOption = (e) => {
  chrome.storage.sync.set({ auto_close: e.target.checked }); 
}
