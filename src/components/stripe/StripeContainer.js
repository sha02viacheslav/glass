import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "./PaymentForm";
import { useState } from "react";

const PUBLIC_KEY = "pk_test_51MeHgTKGje4SDelpoXidOZQiyl4HeOUxMetnmgGNFZ3VxRfghF1fu8CabVFpaSawtJvtxJfRljV7I5WuQx3w06vj00wuE0hBZq";
const stripeTestPromise = loadStripe(PUBLIC_KEY);

export default function StripeContainer(qid) {

    return (
        <Elements stripe={stripeTestPromise}>
            <PaymentForm 
                qid={qid}
            />
        </Elements>
    )
}