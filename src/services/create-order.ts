import { type Order } from '../interfaces'
import OrderSide from '../interfaces/order/order-side'
import type CreateOrderRequest from '../interfaces/order/create-order-request'

export const createOrder = (orderRequest: CreateOrderRequest) => {
  matchOrder(orderRequest)
  if (orderRequest.order.quantityRemaining > 0) {
    if (orderRequest.order.side === OrderSide.BUY) {
      insertAndSortOrders(orderRequest.buyOrders, orderRequest.order)
    } else {
      insertAndSortOrders(orderRequest.sellOrders, orderRequest.order)
    }
  } else {
    orderRequest.fulfilledOrders.push(orderRequest.order)
  }
  return orderRequest
}

const insertAndSortOrders = (orders: Order[], order: Order) => {
  orders.unshift(order)
  orders.sort((order1, order2) => order1.price - order2.price)
}

const matchOrder = ({ buyOrders, sellOrders, fulfilledOrders, order }: { buyOrders: Order[], sellOrders: Order[], fulfilledOrders: Order[], order: Order }) => {
  if (order.quantityRemaining === 0) {
    return
  }
  const isBuy = order.side === OrderSide.BUY
  const matchingOrderList = isBuy ? sellOrders : buyOrders
  const matchingOrder = matchingOrderList.pop()
  if (matchingOrder == null) {
    return
  }
  if (!(isBuy
    ? matchingOrder.price <= order.price
    : order.price <= matchingOrder.price)) {
    matchingOrderList.push(matchingOrder)
    return
  }
  const filledQuantity = Math.min(matchingOrder.quantityRemaining, order.quantityRemaining)
  order.quantityRemaining -= filledQuantity
  matchingOrder.quantityRemaining -= filledQuantity
  if (matchingOrder.quantityRemaining > 0) {
    matchingOrderList.push(matchingOrder)
  } else {
    fulfilledOrders.push(matchingOrder)
  }
  matchOrder({ buyOrders, sellOrders, fulfilledOrders, order })
}
