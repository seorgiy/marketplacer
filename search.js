document.addEventListener('DOMContentLoaded', function () {
  const search = document.getElementById('search');
  const min_value = document.getElementById('min_value');
  const goButton = document.getElementById('go');
	const table = document.getElementById('items_table')
	var current_tab = {};
	chrome.tabs.getCurrent().then((result) => current_tab = result )
	document.querySelector('#auto_close_input').addEventListener('change', saveAutoOption)

	const config = {
		"dns": {
			name: 'ДНС',
			url: "https://www.dns-shop.ru/search/?q={search}&stock=now-today-tomorrow-later&price={min_value}-999999",
			price: "&order=price-asc",
			popularity: ""
		},
		"aliexpress": {
			name: 'Али',
			url: "https://aliexpress.ru/wholesale?SearchText={search}&CatId=undefined&minPrice={min_value}&g=y&page=1",
			price: "&SortType=price_asc",
			popularity: "&SortType=default"
		},
		"yandex": {
			name: 'Яндекс',
			url: "https://market.yandex.ru/search?text={search}&pricefrom={min_value}",
			price: '&how=aprice',
			popularity: ''
		},
		"megamarket": {
			name: 'МегаМаркет',
			url: "https://megamarket.ru/catalog/?q={search}",
			price: '#?sort=1&filters={encoded_min_value}',
			popularity: '#?filters={encoded_min_value}'
		},
		"ozon": {
			name: 'Озон',
			url: "https://www.ozon.ru/search/?text={search}&currency_price={min_value}%3B99999999",
			price: '&sorting=price',
			popularity: '&sorting=score'
		},
		"wildberries": {
			name: 'Wildberries',
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
		document.querySelectorAll('.market_box').forEach(box => {
			let mode = box.querySelector('select').value
			let id = box.id.replace('_option', '')
			if (mode != 'off') urls.push(createURLFromString(config[id]['url'], search.value, min_value.value, config[id][mode]))
		})

		return urls
	}

	const goAction = () => {
		if (search.value == "") return

		document.getElementById('market_options').childNodes.forEach(box => {
			config[box.id.replace('_option', '')]['cashback'] = parseInt(box.querySelector('input').value, 10)
		})

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
			let item = items[i]
			let row = document.createElement("tr");
			let marketCell = document.createElement("td");
			let nameCell = document.createElement("td");
			let priceCell = document.createElement("td");
			let deliveryCell = document.createElement("td");
			let buttonCell = document.createElement("td");
			let cashbackCell = document.createElement("td");
			let cashback = item._price / 100 * config[item._market_id].cashback
			item._overall_price -= cashback
			cashbackCell.innerHTML = (`<p class='summ'>${formatPrice(cashback)}</p>`) 
			if (item._details['cashback'] > 0) cashbackCell.innerHTML += `<p class='summ'>${item._details['cashback']} (с)</p>`
			nameCell.innerHTML = `<a target="_blank" href='${item._link}'>${item._name}</a>`
			priceCell.innerHTML = item._overall_price == item._price ?
			formatPrice(item._overall_price) :
			`<div style='display: flex;flex-direction: column;'><span>${formatPrice(item._overall_price)}</span></div>`
      row.dataset.price = item._overall_price
			marketCell.innerText = config[item._market_id].name
			deliveryCell.innerText = item._delivery_date
			buttonCell.innerHTML = `<button class="remove_button">Удалить</button>`
			buttonCell.firstChild.addEventListener('click', function(){ this.parentNode.parentNode.remove() })
			row.append(marketCell)
			row.append(nameCell)
			row.append(priceCell)
			row.append(cashbackCell)
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

		let container = document.getElementById('market_options')
		for (const [key, value] of Object.entries(config)) {
			let market_options = options[key] ?? ['popularity', '1']
      let box = document.createElement("div");
			box.className = 'market_box'
			box.id =  key + '_option'
			box.innerHTML = `${value.name}
      <select>
        <option ${market_options[0] == 'price' ? 'selected' : ''} value='price'>Цена</option>
        <option ${market_options[0] == 'popularity' ? 'selected' : ''} value='popularity'>Популярность</option>
        <option ${market_options[0] == 'off' ? 'selected' : ''} value='off'>Выкл</option>
      </select>
      Кешбэк (%)
      <input max="100" min="0" type=number  style='width:60px' value='${market_options[1]}' />
      `
			container.appendChild(box)
		}

		container.querySelectorAll('select, input').forEach(selector => { selector.addEventListener('change', saveMarketsOption) })
	})

	chrome.storage.sync.get('auto_close').then(options => { 
		document.querySelector('#auto_close_input').checked = options['auto_close'] ?? true
	})
});

