import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js"
import axios from "axios"
import { useEffect, useState } from 'react'


const CARD_OPTIONS = {
	iconStyle: "solid",
	style: {
		base: {
			iconColor: "#c4f0ff",
			color: "#000066",
			fontWeight: 500,
			fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
			fontSize: "16px",
			fontSmoothing: "antialiased",
			":-webkit-autofill": { color: "#fce883" },
			"::placeholder": { color: "#87bbfd" }
		},
		invalid: {
			iconColor: "#ffc7ee",
			color: "#ffc7ee"
		}
	}
}

export default function PaymentForm(qid) {
    const [success, setSuccess ] = useState(false)
    const stripe = useStripe()
    const elements = useElements()

    useEffect(() => {
        if (success) {
            let data = JSON.stringify({
                "jsonrpc": "2.0",
                "params": {
                    "fe_token": qid,
                    "invoice_number": "INV/2023/02012",
                    "payment_gateway": "stripe",
                    "data": {
                        "payment_status": success
                    }
                }
            });
            let config = {
                method: 'post',
                url: 'https://fixglass-staging-2-7305738.dev.odoo.com/api/v1/react/invoice/get_invoice',
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': 'e2aa3aea-baaf-4d45-aed5-44be3fc34e83'
                },
                data: data
            };
            axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response));
            })
            .catch(function (error) {
                console.log(error);
            })
        }
    }, [success]);


    const handleSubmit = async (e) => {
        e.preventDefault()
        const {error, paymentMethod} = await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardElement)
        })


        if(!error) {
            try {
                const {id} = paymentMethod
                const response = await axios.post("http://localhost:4000/payment", {
                    amount: 1000,
                    id
                })

                if(response.data.success) {
                    // Payment was successful
                    console.log("Successful payment")
                    setSuccess(true)
                }

            } catch (error) {
                console.log("Error", error)
            }
        } else {
            console.log(error.message)
        }
    }

    return (
        <>
        {!success ? 
            <form onSubmit={handleSubmit}>
                <fieldset className="FormGroup">
                    <div className="FormRow">
                        <CardElement options={CARD_OPTIONS}/>
                    </div>
                </fieldset>
                <button>Pay</button>
            </form>
            :
            <div>
                <h2>You just bought a sweet spatula congrats this is the best decision of you're life</h2>
            </div> 
        }
            
        </>
    )
}