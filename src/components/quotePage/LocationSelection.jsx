import '../../css/location.css';
import Checkbox from '@mui/material/Checkbox';
import { useEffect, useState } from 'react';
import {autocomplete} from 'getaddress-autocomplete';
import axios from 'axios';

export default function LocationSelection({userBillingAddress, deliveryAddressToParent, ids, deliveryAddressToChild}) {

    const [address, setAddress] = useState('');
    const [addressInput, setAddressInput] = useState(false);
    const customer_id = ids[0].customerId;
    const address_id = ids[0].addressId;
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const del = deliveryAddressToChild;

    function handleAdressCheck() {
        if (addressInput) {
            setAddressInput(false);
            newDeliveryAddress(userBillingAddress);
            const field = document.getElementById('autocomplete-field');
            field.setAttribute('readonly', '');
        } else {
            setAddressInput(true);
            const field = document.getElementById('autocomplete-field');
            if (deliveryAddress === address) {
                newDeliveryAddress('');
                field.removeAttribute('readonly');
                field.focus();
            } else {
                newDeliveryAddress(deliveryAddress);
                field.removeAttribute('readonly');
            }          
        }
    }

    const handlePCodeChange = (event) => {
        newDeliveryAddress(event.target.value);
    }

    function newDeliveryAddress(address){
        deliveryAddressToParent(address);
        setAddress(address);
    }

    function updateDeliveryAddress(fullAddress) {
        let data = JSON.stringify({
            "jsonrpc": "2.0",
            "params": {
                "customer_id": customer_id,
                "address_id": address_id,
                "line_1": fullAddress.line_1,
                "line_2": fullAddress.line_2,
                "postcode": fullAddress.postcode,
                "latitude": fullAddress.latitude,
                "longitude": fullAddress.longitude,
                "town_or_city": fullAddress.town_or_city,
                "county": fullAddress.county,
                "country": fullAddress.country
            }
        });
        let config = {
            method: 'post',
            url: process.env.REACT_APP_UPDATE_DELIVERY,
            headers: {
                'Content-Type': 'application/json',
                'api-key': process.env.REACT_APP_ODOO_STAGING_KEY,
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

    useEffect(() => {
        // Integration of PostalCode/ Address AutoComplete API
        autocomplete("autocomplete-field","SFB4ZD1fO0ONndTgHnmUmg26020", { 
            delay: 500,
        });

        // Preventing Default to show complete address with Postal Code
        window.addEventListener("getaddress-autocomplete-address-selected", function(e){
            e.preventDefault();
            let tempAddress = e.address.formatted_address.filter(Boolean).join(", ")+" "+e.address.postcode;
            newDeliveryAddress(tempAddress);
            updateDeliveryAddress(e.address);
            // let allLocs = JSON.parse(sessionStorage.getItem('pastLocs')) || [];
            // allLocs.push(tempAddress);
            // sessionStorage.setItem('pastLocs', JSON.stringify(allLocs));
        });

        // get the width of the main container and set the input bar's width accordingly (the width needs to be hard set in pixels)
        let mainContainer = document.getElementById('loc-container');
        let inputField = document.getElementById('autocomplete-field');
        if (mainContainer != null) {
            let newWidth = (mainContainer.offsetWidth - 60).toString().concat('px');
            inputField.style.width = newWidth;
            // console.log(mainContainer.offsetWidth);
        }

        newDeliveryAddress(userBillingAddress);

        // format delivery address
        const deliveryFromAPI = del.line_1 + ', ' + del.line_2 + ', ' + del.town_or_city + ', ' + del.county + ' ' + del.postcode;
        // console.log(deliveryFromAPI);
        setDeliveryAddress(deliveryFromAPI);
    }, []);

    return(
        <div className="location-container" id='loc-container'>
            <h3 className="text-24 text-blue mb-4 LS-header">Where do we fix?</h3> 
            <div className='option-header'>At home or work</div>
            <input 
                id="autocomplete-field" 
                type='text'
                className='address-input'
                onChange={handlePCodeChange}
                defaultValue={address}
                value={address}
                /> 
            <div className="option-container">
                <div>
                    <span className='shop-address'>Same as billing address</span>
                    <Checkbox 
                        checked={!addressInput}
                        onChange={handleAdressCheck}
                        sx={{
                            color: '#9a73dd',
                            '&.Mui-checked': {
                                color: '#9a73dd',
                            }
                        }}
                        defaultChecked/>  
                </div>
            </div>
        </div>
    )
}