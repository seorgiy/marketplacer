var items = []

const search = () => {
  let nodes = document.querySelectorAll('.product-card-list > .product-card')
  if (document.querySelector('.searching-results > p').innerText.match('ничего') != null) return finish([])

  for (let i=0;i<nodes.length;i++) {
    if (items.length > ITEMS_LIMIT) return finish(items)

    let item = new Item(
      nodes[i].querySelector('.product-card__brand-wrap')?.innerText?.replaceAll('\n',' '),
      nodes[i].querySelector('.price__lower-price')?.innerText, 
      nodes[i].querySelector('[href]')?.href,
      'wildberries',
      nodes[i].querySelector('.product-card__add-basket > span.btn-text')?.innerText
    )
    items.push(item)
  }

  return finish(items.slice(0,ITEMS_LIMIT))
}