var items = []

const collect = () => {
  let nodes = document.querySelectorAll('#paginatorContent [href*="product"]:not([data-prerender]')
  for (let i=0;i<nodes.length;i++) {
    if (items.length > 9) return finish(items)

    console.log(nodes[i])
    let card = nodes[i].parentNode.parentNode.parentNode
    let item = new Item(
      nodes[i]?.innerText,
      card.innerHTML.match(/[0-9\s]+.₽/)[0],
      nodes[i]?.href,
      'Ozon',
      card.querySelector('button.b200-b5 > div:has(>svg) > div')?.innerText
    )
    items.push(item)
  }

  return finish(items)
}

const observe = (mutations) => { return collect() }
const checkIfNoLoading = () => {
  console.log('check')
   if (document.getElementById('paginatorContent').childElementCount == 1) return collect()
   }

const search = () => {
  let itemsObserver = new MutationObserver(observe);
  let config = { childList: true }
  let container = document.getElementById('paginatorContent')
  itemsObserver.observe(container, config);
  setTimeout(checkIfNoLoading, 300)

console.log('ozon')
}