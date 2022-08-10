import React from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

export default function CartScreen() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const qty = searchParams.get('qty');
  return (
    <div>
        <h1>Cart Screen</h1>
        <p>
            ADD TO CART: productID: {id} Qty: {qty}
        </p>
    </div>
  )
}
