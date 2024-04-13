document.addEventListener('DOMContentLoaded', function () {
  const search = document.getElementById('search');
  const min_value = document.getElementById('min_value');
  const goButton = document.getElementById('go');
	const table = document.getElementById('items_table')
	var current_tab = {};
	chrome.tabs.getCurrent().then((result) => current_tab = result )

	const config = {
		"dns": {
			url: "https://www.dns-shop.ru/search/?q={search}&order=price-asc&stock=now-today-tomorrow-later"
		},
		// "citilink": {
		// 	url: "https://www.citilink.ru/search/?text={search}",
		// 	profiles: [0, 1]
		// },
		// "aliexpress": {
		// 	url: "https://aliexpress.ru/wholesale?catId=&SearchText={search}",
		// 	profiles: [0, 1]
		// },
		// "market": {
		// 	url: "https://market.yandex.ru/search?text={search}"
		// },
		// "megamarket": {
		// 	url: "https://megamarket.ru/catalog/?q={search}#?sort=1"
		// },
		// "ozon": {
		// 	url: "https://www.ozon.ru/search/?text={search}&sorting=price&currency_price={min_value}%3B99999999",
		// },
		// "wildberries": {
		// 	url: "https://www.wildberries.ru/catalog/0/search.aspx?sort=priceup&search={search}&priceU={min_value}00%3B999999999"
		// }
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

	const goAction = () => {
		document.querySelectorAll('tr:not(.static)').forEach(e => e.remove());
		let urls = Object.values(config).map(market => {	return createURLFromString(market.url, search.value, min_value.value) })
		chrome.windows.create({url: urls, state: 'minimized' }).then(search_window => {
			chrome.runtime.sendMessage({command: 'set_window_id', value: search_window.id });
		})
	}

	const createURLFromString = (string, value, min_value) => {
		return string
		.replace('{search}', encodeURI(value))
		.replace('{min_value}', encodeURI(min_value))
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
			priceCell.innerText = `${items[i]._price} ₽`
			marketCell.innerText = items[i]._market_name
			deliveryCell.innerText = items[i]._delivery_date
			buttonCell.innerHTML = `<button class="remove_button">X</button>`
			buttonCell.firstChild.addEventListener('click', function(){ this.parentNode.parentNode.remove() })
			row.append(marketCell)
			row.append(nameCell)
			row.append(priceCell)
			row.append(deliveryCell)
			row.append(buttonCell)
			table.lastChild.append(row)
		}
	}
	
	chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
			console.log(request)
			if (request['command'] == 'render_items') renderItems(request['value'])
		}
	);

});

