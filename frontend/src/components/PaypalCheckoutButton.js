import React from "react";
import { PayPalButtons } from '@paypal/react-paypal-js';
const PaypalCheckoutButton = (props) => {
    const { product } = props;

    return <PayPalButtons />
}

export default PaypalCheckoutButton;