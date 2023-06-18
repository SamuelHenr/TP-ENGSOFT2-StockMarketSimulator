import { v4 } from 'uuid'
import { type Order } from '../src/interfaces'
import OrderSide from '../src/interfaces/order/order-side'
import { createOrder } from '../src/services/create-order'

//função que cria um objeto do tipo Order
const createOrderObject = ({
  id,
  price,
  quantity,
  quantityRemaining,
  side,
  createdAt
}: {
  id?: string
  price?: number
  quantity?: number
  quantityRemaining?: number
  side?: OrderSide
  createdAt?: string
}): Order => {
  return {
    id: id ?? v4(),
    price: price ?? 10,
    quantity: quantity ?? 10,
    quantityRemaining: quantityRemaining ?? 10,
    side: side ?? OrderSide.BUY,
    createdAt: createdAt ?? getISODate('2023-01-01')
  }
}

//Converte uma data no modelo ISO 8601
const getISODate = (date: string) => (new Date(date)).toISOString()

//describe => descreve o que será feito no teste
describe('create order method', () => {

  describe('check for zero and negative values',() => {
    it('throws an error if the quantity is zero or negative', () => {
        const negativeQuantityOrder = createOrderObject({
          price: 100,
          quantity: -100,
          quantityRemaining: -100
        })
        
        expect(() => {
            createOrder({
                buyOrders: [],
                sellOrders: [],                
                fulfilledOrders: [],
                order: negativeQuantityOrder
            });
        }).toThrowError('Quantity must be positive');
      })

      it('throws an error if the price is zero or negative', () => {
        const negativePriceOrder = createOrderObject({
          price: -100,
          quantity: 100,
          quantityRemaining: 100
        })
        
        expect(() => createOrder({
          buyOrders: [],
          sellOrders: [],
          fulfilledOrders: [],
          order: negativePriceOrder
        })).toThrowError('Price must be positive')
      })

      it('throws an error if the price and quantity is zero or negative', () => {
        const negativePriceAndQuantityOrder = createOrderObject({
          price: -100,
          quantity: 0,
          quantityRemaining: 100
        })
        
        expect(() => createOrder({
          buyOrders: [],
          sellOrders: [],
          fulfilledOrders: [],
          order: negativePriceAndQuantityOrder
        })).toThrowError('Price and quantity must be positive')
      })
      
  })
  describe('orders matching', () => {
    it('creates a sell order with no matching buy orders', () => {
      const buyOrder = createOrderObject({
        price: 100,
        quantity: 100,
        quantityRemaining: 100
      })

      const sellOrder = createOrderObject({
        price: 200,
        quantity: 100,
        quantityRemaining: 100,
        side: OrderSide.SELL
      })

      const { buyOrders, sellOrders, fulfilledOrders } = createOrder({
        buyOrders: [buyOrder],
        sellOrders: [],
        fulfilledOrders: [],
        order: sellOrder
      })

      expect(fulfilledOrders.length).toBe(0)

      expect(buyOrders.length).toBe(1)
      expect(buyOrders[0].id).toBe(buyOrder.id)
      expect(buyOrders[0].quantityRemaining).toBe(100)

      expect(sellOrders.length).toBe(1)
      expect(sellOrders[0].id).toBe(sellOrder.id)
      expect(sellOrders[0].quantityRemaining).toBe(100)
    })

    it('creates a sell order that partially matches with buy orders', () => {
      const buyOrder = createOrderObject({
        price: 100,
        quantity: 100,
        quantityRemaining: 100

      })
      const sellOrder = createOrderObject({
        price: 50,
        quantity: 200,
        quantityRemaining: 200,
        side: OrderSide.SELL
      })

      const { buyOrders, sellOrders, fulfilledOrders } = createOrder({
        buyOrders: [buyOrder],
        sellOrders: [],
        fulfilledOrders: [],
        order: sellOrder
      })

      expect(fulfilledOrders.length).toBe(1)
      expect(fulfilledOrders[0].id).toBe(buyOrder.id)

      expect(buyOrders.length).toBe(0)

      expect(sellOrders.length).toBe(1)
      expect(sellOrders[0].id).toBe(sellOrder.id)
      expect(sellOrders[0].quantityRemaining).toBe(100)
    })

    it('creates a sell order that entirely matches with buy orders', () => {
      const buyOrder1 = createOrderObject({
        price: 100,
        quantity: 100,
        quantityRemaining: 100,
        createdAt: getISODate('2020-01-01')
      })
      const buyOrder2 = createOrderObject({
        price: 100,
        quantity: 200,
        quantityRemaining: 200,
        createdAt: getISODate('2020-01-02')
      })
      const sellOrder = createOrderObject({
        price: 50,
        quantity: 200,
        quantityRemaining: 200,
        createdAt: getISODate('2020-01-02'),
        side: OrderSide.SELL
      })

      const { buyOrders, sellOrders, fulfilledOrders } = createOrder({
        buyOrders: [buyOrder2, buyOrder1],
        sellOrders: [],
        fulfilledOrders: [],
        order: sellOrder
      })

      expect(fulfilledOrders.length).toBe(2)
      expect(fulfilledOrders[0].id).toBe(buyOrder1.id)
      expect(fulfilledOrders[1].id).toBe(sellOrder.id)

      expect(buyOrders.length).toBe(1)
      expect(buyOrders[0].id).toBe(buyOrder2.id)
      expect(buyOrders[0].quantityRemaining).toBe(100)

      expect(sellOrders.length).toBe(0)
    })

    it('creates a buy order with no matching sell orders', () => {
      const buyOrder = createOrderObject({
        price: 100,
        quantity: 100,
        quantityRemaining: 100
      })
      const sellOrder = createOrderObject({
        price: 200,
        quantity: 100,
        quantityRemaining: 100,
        side: OrderSide.SELL
      })

      const { buyOrders, sellOrders, fulfilledOrders } = createOrder({
        buyOrders: [],
        sellOrders: [sellOrder],
        fulfilledOrders: [],
        order: buyOrder
      })

      expect(fulfilledOrders.length).toBe(0)

      expect(buyOrders.length).toBe(1)
      expect(buyOrders[0].id).toBe(buyOrder.id)
      expect(buyOrders[0].quantityRemaining).toBe(100)

      expect(sellOrders.length).toBe(1)
      expect(sellOrders[0].id).toBe(sellOrder.id)
      expect(sellOrders[0].quantityRemaining).toBe(100)
    })

    it('creates a buy order that partially matches with sell orders', () => {
      const buyOrder = createOrderObject({
        price: 100,
        quantity: 200,
        quantityRemaining: 200
      })
      const sellOrder = createOrderObject({
        price: 50,
        quantity: 100,
        quantityRemaining: 100,
        side: OrderSide.SELL
      })

      const { buyOrders, sellOrders, fulfilledOrders } = createOrder({
        buyOrders: [],
        sellOrders: [sellOrder],
        fulfilledOrders: [],
        order: buyOrder
      })

      expect(fulfilledOrders.length).toBe(1)
      expect(fulfilledOrders[0].id).toBe(sellOrder.id)

      expect(buyOrders.length).toBe(1)
      expect(buyOrders[0].id).toBe(buyOrder.id)
      expect(buyOrders[0].quantityRemaining).toBe(100)

      expect(sellOrders.length).toBe(0)
    })

    it('creates a buy order that entirely matches with sell orders', () => {
      const buyOrder = createOrderObject({
        price: 100,
        quantity: 200,
        quantityRemaining: 200,
        createdAt: getISODate('2020-01-02')
      })
      const sellOrder1 = createOrderObject({
        price: 50,
        quantity: 100,
        quantityRemaining: 100,
        side: OrderSide.SELL,
        createdAt: getISODate('2020-01-01')
      })
      const sellOrder2 = createOrderObject({
        price: 50,
        quantity: 200,
        quantityRemaining: 200,
        side: OrderSide.SELL,
        createdAt: getISODate('2020-01-02')
      })

      const { buyOrders, sellOrders, fulfilledOrders } = createOrder({
        buyOrders: [],
        sellOrders: [sellOrder2, sellOrder1],
        fulfilledOrders: [],
        order: buyOrder
      })

      expect(fulfilledOrders.length).toBe(2)
      expect(fulfilledOrders[0].id).toBe(sellOrder1.id)
      expect(fulfilledOrders[1].id).toBe(buyOrder.id)

      expect(buyOrders.length).toBe(0)

      expect(sellOrders.length).toBe(1)
      expect(sellOrders[0].id).toBe(sellOrder2.id)
      expect(sellOrders[0].quantityRemaining).toBe(100)
    })
  })
  describe('orders sorting', () => {
    it('creates a not matched sell order and sorts by price', () => {
      const sellOrder1 = createOrderObject({
        price: 50,
        quantity: 100,
        quantityRemaining: 100,
        side: OrderSide.SELL,
        createdAt: getISODate('2020-01-01')
      })

      const sellOrder2 = createOrderObject({
        price: 100,
        quantity: 100,
        quantityRemaining: 100,
        side: OrderSide.SELL,
        createdAt: getISODate('2020-01-01')
      })

      const newSellOrder = createOrderObject({
        price: 75,
        quantity: 100,
        quantityRemaining: 100,
        side: OrderSide.SELL,
        createdAt: getISODate('2020-01-01')
      })

      const { buyOrders, sellOrders, fulfilledOrders } = createOrder({
        buyOrders: [],
        sellOrders: [sellOrder2, sellOrder1],
        fulfilledOrders: [],
        order: newSellOrder
      })

      expect(fulfilledOrders.length).toBe(0)
      expect(buyOrders.length).toBe(0)

      expect(sellOrders.length).toBe(3)
      expect(sellOrders[0].id).toBe(sellOrder1.id)
      expect(sellOrders[1].id).toBe(newSellOrder.id)
      expect(sellOrders[2].id).toBe(sellOrder2.id)
    })

    it('creates a not matched sell order with same price and sorts by createdAt', () => {
      const sellOrder1 = createOrderObject({
        price: 50,
        quantity: 100,
        quantityRemaining: 100,
        side: OrderSide.SELL,
        createdAt: getISODate('2020-01-01T03:20:00')
      })

      const sellOrder2 = createOrderObject({
        price: 100,
        quantity: 100,
        quantityRemaining: 100,
        side: OrderSide.SELL,
        createdAt: getISODate('2020-01-01T03:21:00')
      })

      const newSellOrder = createOrderObject({
        price: 50,
        quantity: 100,
        quantityRemaining: 100,
        side: OrderSide.SELL,
        createdAt: getISODate('2020-01-01T03:22:00')
      })

      const { buyOrders, sellOrders, fulfilledOrders } = createOrder({
        buyOrders: [],
        sellOrders: [sellOrder2, sellOrder1],
        fulfilledOrders: [],
        order: newSellOrder
      })

      expect(fulfilledOrders.length).toBe(0)
      expect(buyOrders.length).toBe(0)

      expect(sellOrders.length).toBe(3)
      expect(sellOrders[0].id).toBe(newSellOrder.id)
      expect(sellOrders[1].id).toBe(sellOrder1.id)
      expect(sellOrders[2].id).toBe(sellOrder2.id)
    })

    it('creates a not matched buy order and sorts by price', () => {
      const buyOrder1 = createOrderObject({
        price: 100,
        quantity: 100,
        quantityRemaining: 100,
        side: OrderSide.BUY,
        createdAt: getISODate('2020-01-01')
      })

      const buyOrder2 = createOrderObject({
        price: 50,
        quantity: 100,
        quantityRemaining: 100,
        side: OrderSide.BUY,
        createdAt: getISODate('2020-01-01')
      })

      const newBuyOrder = createOrderObject({
        price: 75,
        quantity: 100,
        quantityRemaining: 100,
        side: OrderSide.BUY,
        createdAt: getISODate('2020-01-01')
      })

      const { buyOrders, sellOrders, fulfilledOrders } = createOrder({
        buyOrders: [buyOrder2, buyOrder1],
        sellOrders: [],
        fulfilledOrders: [],
        order: newBuyOrder
      })

      expect(fulfilledOrders.length).toBe(0)
      expect(sellOrders.length).toBe(0)

      expect(buyOrders.length).toBe(3)
      expect(buyOrders[0].id).toBe(buyOrder2.id)
      expect(buyOrders[1].id).toBe(newBuyOrder.id)
      expect(buyOrders[2].id).toBe(buyOrder1.id)
    })

    it('creates a not matched buy order with same price and sorts by createdAt', () => {
      const buyOrder1 = createOrderObject({
        price: 100,
        quantity: 100,
        quantityRemaining: 100,
        side: OrderSide.BUY,
        createdAt: getISODate('2020-01-01T03:20:00')
      })

      const buyOrder2 = createOrderObject({
        price: 50,
        quantity: 100,
        quantityRemaining: 100,
        side: OrderSide.BUY,
        createdAt: getISODate('2020-01-01T03:21:00')
      })

      const newBuyOrder = createOrderObject({
        price: 100,
        quantity: 100,
        quantityRemaining: 100,
        side: OrderSide.BUY,
        createdAt: getISODate('2020-01-01T03:22:00')
      })

      const { buyOrders, sellOrders, fulfilledOrders } = createOrder({
        buyOrders: [buyOrder2, buyOrder1],
        sellOrders: [],
        fulfilledOrders: [],
        order: newBuyOrder
      })

      expect(fulfilledOrders.length).toBe(0)
      expect(sellOrders.length).toBe(0)

      expect(buyOrders.length).toBe(3)
      expect(buyOrders[0].id).toBe(buyOrder2.id)
      expect(buyOrders[1].id).toBe(newBuyOrder.id)
      expect(buyOrders[2].id).toBe(buyOrder1.id)
    })
  })
})
