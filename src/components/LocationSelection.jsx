import '../css/location.css';
import Checkbox from '@mui/material/Checkbox';
import { useEffect, useState } from 'react';
import {autocomplete} from 'getaddress-autocomplete';

export default function LocationSelection({userBillingAddress, deliveryAddressToParent}) {

    const [address, setAddress] = useState('');
    const [addressInput, setAddressInput] = useState(false);

    function handleAdressCheck() {
        if (addressInput) {
            // console.log("Address found at handleAdressCheck True Case"+userBillingAddress);
            setAddressInput(false);
            setDeliveryAddress(userBillingAddress);
            const field = document.getElementById('autocomplete-field');
            field.setAttribute('readonly', '');
        } else {
            // console.log("Address found at handleAdressCheck ELSE Case"+userBillingAddress);
            setAddressInput(true);
            setDeliveryAddress('');
            const field = document.getElementById('autocomplete-field');
            field.removeAttribute('readonly');
            field.focus();
            // const field = document.getElementById('address-field');
            // field.setAttribute('contentEditable', '');
        }
    }

    const handlePCodeChange = (event) => {
        setDeliveryAddress(event.target.value);
    }

    function setDeliveryAddress(address){
        deliveryAddressToParent(address);
        setAddress(address);
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
            setDeliveryAddress(tempAddress);
            let allLocs = JSON.parse(sessionStorage.getItem('pastLocs')) || [];
            allLocs.push(tempAddress);
            sessionStorage.setItem('pastLocs', JSON.stringify(allLocs));
        });

        // get the width of the main container and set the input bar's width accordingly (the width needs to be hard set in pixels)
        let mainContainer = document.getElementById('loc-container');
        let inputField = document.getElementById('autocomplete-field');
        if (mainContainer != null) {
            let newWidth = (mainContainer.offsetWidth - 20).toString().concat('px');
            inputField.style.width = newWidth;
            console.log(mainContainer.offsetWidth);
        }

        setDeliveryAddress(userBillingAddress);
        // console.log("Address found at useEffect"+userBillingAddress);
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