var items = []

const collect = () => {
  let nodes = document.querySelectorAll('#paginatorContent .widget-search-result-container [href*="product"]:not([data-prerender]')
  console.log(nodes)
  for (let i=0;i<nodes.length;i++) {
    if (items.length > ITEMS_LIMIT) return finish(items)

    let card = nodes[i].parentNode.parentNode.parentNode
    if (card.querySelector("div[title='Нет в наличии']") != null) continue

    let item = new Item(
      nodes[i]?.innerText,
      card.innerHTML.match(/[0-9\s]+.₽/)[0],
      nodes[i]?.href,
      'ozon',
      card.querySelector('button.b200-b5 > div:has(>svg) > div')?.innerText
    )
    items.push(item)
  }

  return finish(items.slice(0,ITEMS_LIMIT))
}

const search = () => {}

window.addEventListener('load', event => {
  console.log(event)
  chrome.runtime.sendMessage({ command: 'may_i_search?' }).then(response => { if (response) setTimeout(collect,2000) })
});
