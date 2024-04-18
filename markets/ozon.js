var items = []

const collect = () => {
  let nodes = document.querySelectorAll('#paginatorContent .widget-search-result-container [href*="product"]:not([data-prerender]')
  for (let i=0;i<nodes.length;i++) {
    if (items.length > 9) return finish(items)

    let card = nodes[i].parentNode.parentNode.parentNode
    if (card.querySelector("div[title='Нет в наличии']") != null) continue

    let item = new Item(
      nodes[i]?.innerText,
      card.innerHTML.match(/[0-9\s]+.₽/)[0],
      nodes[i]?.href,
      'Ozon',
      card.querySelector('button.b200-b5 > div:has(>svg) > div')?.innerText
    )
    items.push(item)
  }

  return finish(items.slice(0,10))
}

const search = () => {}

window.addEventListener('load', event => {
  chrome.runtime.sendMessage({ command: 'may_i_search?' }).then(response => { if (response) collect() })
});
