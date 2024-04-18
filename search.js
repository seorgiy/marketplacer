document.addEventListener('DOMContentLoaded', function () {
  const search = document.getElementById('search');
  const min_value = document.getElementById('min_value');
  const goButton = document.getElementById('go');
	const table = document.getElementById('items_table')
	var current_tab = {};
	chrome.tabs.getCurrent().then((result) => current_tab = result )
	document.querySelectorAll('#market_options > span > select').forEach(selector => { selector.addEventListener('change', saveMarketsOption) })
	document.querySelector('#auto_close_input').addEventListener('change', saveAutoOption)

	const config = {
		"dns": {
			url: "https://www.dns-shop.ru/search/?q={search}&stock=now-today-tomorrow-later&price={min_value}-999999",
			price: "&order=price-asc",
			popularity: ""
		},
		"aliexpress": {
			url: "https://aliexpress.ru/wholesale?SearchText={search}&CatId=undefined&minPrice={min_value}&g=y&page=1",
			price: "&SortType=price_asc",
			popularity: "&SortType=default"
		},
		"yandex": {
			url: "https://market.yandex.ru/search?text={search}&pricefrom={min_value}",
			price: '&how=aprice',
			popularity: ''
		},
		"megamarket": {
			url: "https://megamarket.ru/catalog/?q={search}",
			price: '#?sort=1&filters={encoded_min_value}',
			popularity: '#?filters={encoded_min_value}'
		},
		"ozon": {
			url: "https://www.ozon.ru/search/?text={search}&currency_price={min_value}%3B99999999",
			price: '&sorting=price',
			popularity: '&sorting=score'
		},
		"wildberries": {
			url: "https://www.wildberries.ru/catalog/0/search.aspx?search={search}&priceU={min_value}00%3B999999999",
			price: '&sort=priceup',
			popularity: '&sort=popular'
		}
	}

	search.addEventListener('keydown', (event) => {
		engine(event)
	})

	min_value.addEventListener('keydown', (event) => {
		engine(event)
	})

	goButton.addEventListener('click', () => {
		engine(true)
	})

	const engine = (event) => {
		if (event === true) {
			goAction()
		}
		if (event.key === 'Enter') {
			goAction()
		}
	}

	const formUrls = () => {
		let urls = []
		document.querySelectorAll('#market_options > span > select').forEach(node => {
			if (node.value != 'off') urls.push(createURLFromString(config[node.name]['url'], search.value, min_value.value, config[node.name][node.value]))
		})

		return urls
	}

	const goAction = () => {
		if (search.value == "") return

		document.querySelectorAll('tr:not(.static)').forEach(e => e.remove());
		chrome.windows.create({url: formUrls()}).then(search_window => {
			chrome.runtime.sendMessage({command: 'set_window_id', value: search_window.id });
		})
	}

	const createURLFromString = (string, value, min_value, sort_type) => {
		return (string + sort_type)
		.replace('{search}', encodeURI(value))
		.replace('{min_value}', encodeURI(min_value))
		.replace('{encoded_min_value}', encodeURI(`{"88C83F68482F447C9F4E401955196697":{"min":${min_value}}}`))
	}

	const formatPrice = (price) => {
		return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(price)
	}

	const renderItems = (items) => {
		for (i in items) {
			let row = document.createElement("tr");
			let marketCell = document.createElement("td");
			let nameCell = document.createElement("td");
			let priceCell = document.createElement("td");
			let deliveryCell = document.createElement("td");
			let buttonCell = document.createElement("td");
			nameCell.innerHTML = `<a target="_blank" href='${items[i]._link}'>${items[i]._name}</a>`
			priceCell.innerHTML = items[i]._overall_price == items[i]._price ?
			formatPrice(items[i]._overall_price) :
			`<div style='display: flex;flex-direction: column;'><span>${formatPrice(items[i]._overall_price)}</span><span style='font-size:xx-small; color: #778899'>${items[i]._price}-${items[i]._details['cashback']}</span></div>`
      row.dataset.price = items[i]._overall_price
			marketCell.innerText = items[i]._market_name
			deliveryCell.innerText = items[i]._delivery_date
			buttonCell.innerHTML = `<button class="remove_button">Удалить</button>`
			buttonCell.firstChild.addEventListener('click', function(){ this.parentNode.parentNode.remove() })
			row.append(marketCell)
			row.append(nameCell)
			row.append(priceCell)
			row.append(deliveryCell)
			row.append(buttonCell)
			table.lastElementChild.append(row)
		}
	}

	chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
			if (request['command'] == 'render_items') renderItems(request['value'])
		}
	);

  //load market options from google account
	chrome.storage.sync.get('market_options').then(options => { 
		options = options['market_options'] ?? {}
		document.querySelectorAll('#market_options > span > select').forEach(selector => { selector.value = options[selector.name] ?? 'price' })
	})

	chrome.storage.sync.get('auto_close').then(options => { 
		document.querySelector('#auto_close_input').checked = options['auto_close'] ?? true
	})
});

