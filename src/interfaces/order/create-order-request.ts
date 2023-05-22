import type Order from './order'

interface CreateOrderRequest { 
    buyOrders: Order[], 
    sellOrders: Order[], 
    fulfilledOrders: Order[], 
    order: Order }

export default CreateOrderRequest