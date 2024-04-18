var items = []

const collect = () => {
  let nodes = document.querySelectorAll('article:not(#banner-streamer)')
  for (let i=0;i<nodes.length;i++) {
    if (items.length > 9) return finish(items)

    let item = new Item(
      nodes[i].querySelector('h3[role="link"]')?.innerText,
      nodes[i].querySelector('[data-auto="snippet-price-current"]')?.innerText,
      nodes[i].querySelector('h3[role="link"]').parentNode.href,
      'Яндекс',
      nodes[i].querySelectorAll('[data-auto="delivery-wrapper"] span')[0]?.innerText
    )
    items.push(item)
  }

  return finish(items)
}

const search = () => {
  collect()
}