var items = []
console.log('mega')

const collect = () => {
  let nodes = document.querySelectorAll('.catalog-item')

  for (let i=0;i<nodes.length;i++) {
    if (items.length > 9) return finish(items)

    let item = new Item(
      nodes[i].querySelector('.item-title > a')?.innerText,
      nodes[i].querySelector('.item-price > span')?.innerText, 
      nodes[i].querySelector('.item-title > a')?.href,
      'Мегамаркет',
      nodes[i].querySelector('.catalog-item-delivery__text')?.innerText
    )
    items.push(item)
  }

  return finish(items)
}

const observe = (mutations) => { 

  for(let mutation of mutations) {
    console.log(mutation?.addedNodes)
  }
 }

const search = () => {
  // let itemsObserver = new MutationObserver(observe);
  // let config = {
  //   childList: true,
  //   subtree: true,
  //   // characterData: true
  // }
  // let container = document.getElementsByTagName('body')[0]
  // itemsObserver.observe(container, config);
  // console.log(items)
  // sendItemsToBack(items)
  // setTimeout(window.close,2000);
  setTimeout(collect, 400)
}