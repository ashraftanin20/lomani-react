import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom'

export default function CartScreen() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    let qty = searchParams.get('qty');
    //localStorage.setItem('cartItems', JSON.stringify((getState().cart.cartItems)));
    
    //const dispatch = useDispatch();

    // useEffect(() => {
    //     if(id) {
    //         dispatch(addToCart({id: id, qty: qty}));
    //     }
    // }, [dispatch, id, qty])
  return (
    <div>
        <h1>Cart Screen</h1>
        <p>
            ADD TO CART: productID: {id} Qty: {qty}
        </p>
    </div>
  )
}
