var items = []
var sendItemTimer

const collect = () => {
  let nodes = document.querySelectorAll('.catalog-products.view-simple > div')

  try {
    for (let i=0;i<nodes.length;i++) {
      let node = nodes[i]
      let item = new Item(  
            node.querySelector('.catalog-product__name > span').innerText,
            node.querySelector('.product-buy__price').innerText,
            node.querySelector('[href]').href,
            'ДНС',
            node.querySelector('.delivery-info-widget__button')?.innerText
      )
      items.push(item)
    }

    clearInterval(sendItemTimer);
    return finish(items.slice(0,10))
  }
  catch(e){}
}

const sendItem = () => {
  try {
    let item = new Item(
      document.querySelector('h1.product-card-top__title').innerText,
      document.querySelector('.product-buy__price').innerText,
      location.href,
      'ДНС',
      document.querySelector('.delivery-info-widget__button').innerText
    )

    clearInterval(sendItemTimer);
    return finish([item])
  }
  catch(e){}
}

const singleItem = () => {
  sendItemTimer = setInterval(sendItem, 500);
}

const multiItem = () => {
  sendItemTimer = setInterval(collect, 500);
}

const search = () => {}

window.addEventListener('load', event => {
  console.log(event)
    chrome.runtime.sendMessage({ command: 'may_i_search?' }).then(response => {
      if (!response) return
      if (location.pathname.slice(0,8) == '/product') return singleItem()
      if (document.querySelector('.products-count')?.innerText == '0 товаров') return finish([])
      if (document.querySelector('.empty-search-results,.low-relevancy,.products-list__low-relevancy-search') != null) return finish([])
      multiItem()
    })
});
