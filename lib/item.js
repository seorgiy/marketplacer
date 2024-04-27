class Item {
  constructor(name, price, link, market_id, delivery_date = null, details = {}) {
    this._name = name
    this._link = link
    this._price = parseInt(price.replaceAll(new RegExp(/\s/g),''),10)
    this._market_id = market_id
    this._delivery_date = delivery_date
    this._details = details
    this._overall_price = this._price - (details['cashback'] ?? 0)
  }
}
