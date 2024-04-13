var items = []

const collect = (nodes) => {
  for (let i=0;i<nodes.length;i++) {
    let node = nodes[i]
    let item = new Item(  
          node.querySelector('.catalog-product__name > span').innerText,
          node.querySelector('.product-buy__price').innerText,
          node.querySelector('[href]').href,
          'ДНС',
          node.querySelector('.delivery-info-widget__button').innerText
    )
    items.push(item)

  }

  // console.log(items)
  // return finish(items.slice(0,9))
}

const observe = (mutations) => {
  for(let mutation of mutations) {
    console.log(mutation)
    // chrome.runtime.sendMessage({ command: 'helper', value: mutation.addedNodes[0]?.className})
    if (mutation.addedNodes[0]?.className?.includes('products-page__helpers')){
      
    //   let node = mutation.target.parentNode
    //   if (items.length > 9) return finish(items.slice(0,9))

    setTimeout(collect,500,document.querySelectorAll('.catalog-products.view-simple > div'))
    }
  }
}

const singleItem = () => {
  let item = new Item(
    document.querySelector('h1.product-card-top__title').innerText,
    document.querySelector('.product-buy__price').innerText,
    location.href,
    'ДНС',
    document.querySelector('.delivery-info-widget__button').innerText
)

  sendItemsToBack([item])
  setTimeout(window.close,200);
}


const focus = () => {
  console.log('focus..')
  window.focus();
  document.querySelector('body').click()
}

const search = () => {
  let itemsObserver = new MutationObserver(observe);
  let config = {
    childList: true,
    subtree: true,
    characterData: true
  }


  if (location.pathname.slice(0,8) == '/product') return setTimeout(singleItem,500)
  if (document.querySelector('.empty-search-results,.low-relevancy,.products-list__low-relevancy-search') != null) return window.close()
  // itemsObserver.observe(document.getElementsByClassName('catalog-products')[0], config);
  itemsObserver.observe(document.querySelector('body'), config);
  setTimeout(focus,2000)
}


