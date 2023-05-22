import type Order from './order'

interface CreateOrderFormProps {
    buyOrders: Order[]
    sellOrders: Order[]
    fulfilledOrders: Order[]
    setBuyOrders: any
    setSellOrders: any
    setFulfilledOrders: any
}

export default CreateOrderFormProps