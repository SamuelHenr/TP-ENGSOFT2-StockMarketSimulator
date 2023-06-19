import React from 'react'
import { useForm } from 'react-hook-form'
import { type Order, type CreateOrderAttributes } from '../../interfaces'
import OrderSide from '../../interfaces/order/order-side'
import { v4 } from 'uuid'
import '../order-styles.css'
import { createOrder } from '../../services/create-order'
import type CreateOrderFormProps from '../../interfaces/order/create-order-form-props'

export default function CreateOrderForm (orderProps: CreateOrderFormProps) {
  const { register, handleSubmit } = useForm<CreateOrderAttributes>()

  const handleRegister = (newOrder: CreateOrderAttributes) => {
    const order: Order = {

      ...newOrder,
      createdAt: new Date().toISOString(),
      id: v4(),
      quantityRemaining: Number(newOrder.quantity),
      quantity: Number(newOrder.quantity),
      price: Number(newOrder.price)
    }

    const newOrders = createOrder({ ...orderProps, order })

    orderProps.setBuyOrders([...newOrders.buyOrders])
    orderProps.setSellOrders([...newOrders.sellOrders])
    orderProps.setFulfilledOrders([...newOrders.fulfilledOrders])
  }

  return (
    <>
      <form className="create-order-form" onSubmit={handleSubmit(handleRegister)}>

        <label htmlFor="price">Price:</label>
        <input id="price" {...register('price', { required: true })} />

        <label htmlFor="quantity">Quantity:</label>
        <input id="quantity" {...register('quantity', { required: true })} />

        <label htmlFor="side">Side:</label>
        <select id="side" {...register('side')} id="side">
          <option value={OrderSide.BUY}>Buy</option>
          <option value={OrderSide.SELL}>Sell</option>
        </select>

        <input type="submit" value="Submit" />
      </form>
    </>
  )
}
