var items = []
var itemsObserver
var sendItemTimer

const collect = () => {
  try {
    if (document.querySelector('.catalog-listing-controls input')?.value == 'Лучшее совпадение' && location.hash.includes('sort=1')) return
    if (document.querySelector('.catalog-listing-controls span')?.innerText == 'Лучшее совпадение'&& location.hash.includes('sort=1')) return

    let nodes = document.querySelectorAll('div[data-product-id]')

    for (let i=0;i<nodes.length;i++) {
      if (items.length > ITEMS_LIMIT) return megaFinish(items)
      if (nodes[i].className.includes('catalog-item_out-of-stock')) continue;

      let item = new Item(
        nodes[i].querySelector('a[data-product-id][title]')?.innerText,
        nodes[i].querySelector('.item-price > span , .catalog-item-regular-desktop__price')?.innerText, 
        nodes[i].querySelector('a[data-product-id][title]')?.href,
        'megamarket',
        nodes[i].querySelector('.catalog-item-delivery__text')?.innerText,
        { cashback: parseInt(nodes[i].querySelector('.bonus-amount')?.innerText?.replaceAll(new RegExp(/\s/g),'')  ?? 0, 10) }
      )


      items.push(item)
    }

    return megaFinish(items)
  }
  catch(e){}
}

const megaFinish = (items) => {
  clearInterval(sendItemTimer);
  return finish(items.slice(0,ITEMS_LIMIT))
}

const collectWithDelay = () =>{
  sendItemTimer = setInterval(collect, 500); 
}

const observe = (mutations) => {
  for(let mutation of mutations) {
    if (mutation?.addedNodes[0]?.tagName == 'IFRAME' && sendItemTimer == undefined){
      setTimeout(collectWithDelay,2000)
    }
  }
}

const search = () => {
  itemsObserver = new MutationObserver(observe);
  let config = {
    childList: true,
    subtree: true,
    characterData: true
  }

  itemsObserver.observe(document.querySelector('html'), config);
}
