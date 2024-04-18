var items = []

const collect = () => {
  let nodes = document.querySelectorAll('[data-spm-protocol="i"] [data-index]')
  for (let i=0;i<nodes.length;i++) {
    if (items.length > 9) return finish(items)

    let item = new Item(
      nodes[i].querySelector('div[title]')?.title,
      nodes[i].querySelector('.red-snippet_RedSnippet__priceNew__ufq8j .red-snippet_RedSnippet__overflowWrap__ufq8j span')?.innerText,
      nodes[i].querySelector('a').href,
      'AliExpress',
      nodes[i].querySelector('.red-snippet_RedSnippet__deliveryItem__ufq8j > span')?.innerText
    )
    items.push(item)
  }

   return finish(items)
}

const search = () => {
  collect()
}