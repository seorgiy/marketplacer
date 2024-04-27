const saveMarketsOption = () => {
  let options = {}
  document.querySelectorAll('#market_options > div').forEach(node => {
    let name = node.id.replace('_option', '')
    let value = []
    node.querySelectorAll('select, input').forEach(input => { value.push(input.value) })
    options[name] = value
  })

   chrome.storage.sync.set({ market_options: options });
};

const saveAutoOption = (e) => {
  chrome.storage.sync.set({ auto_close: e.target.checked }); 
}
