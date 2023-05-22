import React from 'react'
import { useForm } from 'react-hook-form'
import { type Order, type CreateOrderAttributes } from '../../interfaces'
import OrderSide from '../../interfaces/order/order-side'
import { v4 } from 'uuid'
import '../order-styles.css'
import { createOrder } from '../../services/create-order'

interface CreateOrderFormProps {
  buyOrders: Order[]
  sellOrders: Order[]
  fulfilledOrders: Order[]
  setBuyOrders: any
  setSellOrders: any
  setFulfilledOrders: any
}

export default function CreateOrderForm ({ buyOrders, sellOrders, fulfilledOrders, setBuyOrders, setSellOrders, setFulfilledOrders }: CreateOrderFormProps) {
  const { register, handleSubmit } = useForm<CreateOrderAttributes>()

  const handleRegister = (newOrder: CreateOrderAttributes) => {
    const order: Order = {
      ...newOrder,
      createdAt: new Date().toISOString(),
      id: v4(),
      quantityRemaining: Number(newOrder.quantity),
      quantity: Number(newOrder.quantity),
      price: Number(newOrder.price),
    }

    const newOrders = createOrder({ buyOrders, sellOrders, fulfilledOrders, order })

    setBuyOrders([...newOrders.buyOrders])
    setSellOrders([...newOrders.sellOrders])
    setFulfilledOrders([...newOrders.fulfilledOrders])
  }

  return (
    <>
      <form className="create-order-form" onSubmit={handleSubmit(handleRegister)}>

        <label htmlFor="price">Price:</label>
        <input {...register('price', { required: true })} />

        <label htmlFor="quantity">Quantity:</label>
        <input {...register('quantity', { required: true })} />

        <label htmlFor="side">Side:</label>
        <select {...register('side')} id="side">
          <option value={OrderSide.BUY}>Buy</option>
          <option value={OrderSide.SELL}>Sell</option>
        </select>

        <input type="submit" value="Submit" />
      </form>
    </>
  )
}
