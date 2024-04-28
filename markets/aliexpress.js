var items = []

const collect = () => {
  let nodes = document.querySelectorAll('[data-spm-protocol="i"] [data-index]')
  for (let i=0;i<nodes.length;i++) {
    if (items.length > ITEMS_LIMIT) return finish(items)

    let item = new Item(
      nodes[i].querySelector('div[title]')?.title,
      nodes[i].innerHTML.match(/[0-9\s]+.₽/)[0],
      nodes[i].querySelector('a').href,
      'aliexpress',
      nodes[i].querySelector('.red-snippet_RedSnippet__deliveryItem__ufq8j > span')?.innerText
    )
    items.push(item)
  }

   return finish(items)
}

const search = () => {}

window.addEventListener('load', event => {
  chrome.runtime.sendMessage({ command: 'may_i_search?' }).then(response => { if (response) setTimeout(collect,2000) })
});