class Item {
  constructor(name, price, link, market_name, delivery_date = null) {
    this._name = name
    this._link = link
    this._price = parseInt(price.replaceAll(new RegExp(/\s/g),''),10)
    this._market_name = market_name
    this._delivery_date = delivery_date
  }

  get name() { return this._name }
  get price() { return this._price }
  get link() { return this._link }
  get delivery_date() { return this._delivery_date }
}

// export default Item;