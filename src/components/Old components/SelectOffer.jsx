import { useEffect, useState } from 'react';
import '../css/select-offer.css';
import Checkbox from '@mui/material/Checkbox';
import check from './icons/check.png';
import x from './icons/x.png';
import data from '../data/selectOfferDummyData.json';
import headersData from '../data/headersDummy.json';
import emptyData from '../data/selectOfferEmpty.json';
import emptyHeadersData from '../data/headersEmpty.json';

export default function SelectOffer({selectOfferToCustomer, isRetrieved}) {

    const dummyData = data;
    const headers = headersData;
    const emptyDummy = emptyData;
    const emptyHeaders = emptyHeadersData;
    // switch if populated data has been received
    const [dataUsed, setDataUsed] = useState(emptyDummy);
    const [headerUsed, setHeaderUsed] = useState(emptyHeaders);

    const [selectedIds, setSelectedIds] = useState([]);

    const wipers = dataUsed[dataUsed.length - 2];
    const price = dataUsed[dataUsed.length - 1];

    const [totalPrice, setTotalPrice] = useState(0);
    const [wiperSelected, setWiperSelected] = useState([]);

    // function for selecting columns and calculating total price
    function selectOffer(selectedIndex) {
        const index = selectedIds.findIndex(id => id === selectedIndex);
        let currentPrice = totalPrice;
        if (index >= 0) {
            // if offer clicked is already selected, then deselect
            selectedIds.splice(index, 1);
            currentPrice -= price.values[selectedIndex].discount;
            if (wiperSelected.includes(selectedIndex)) {
                handleWiperSelect(selectedIndex);
            }
        } else {
            // check if other offer for the same window is already selected
            if (selectedIndex % 2 === 0) {
                const partnerId = selectedIndex + 1;
                if (selectedIds.includes(partnerId)) {
                    const partnerIndex = selectedIds.findIndex(id => id === partnerId);
                    selectedIds.splice(partnerIndex, 1);
                    currentPrice -= price.values[partnerId].discount;
                    if (wiperSelected.includes(partnerId)) {
                        handleWiperSelect(partnerId);
                    }
                } 
            } else {
                const partnerId = selectedIndex - 1;
                if (selectedIds.includes(partnerId)) {
                    const partnerIndex = selectedIds.findIndex(id => id === partnerId);
                    selectedIds.splice(partnerIndex, 1);
                    currentPrice -= price.values[partnerId].discount;
                    if (wiperSelected.includes(partnerId)) {
                        handleWiperSelect(partnerId);
                    }
                } 
            }
            selectedIds.push(selectedIndex);
            currentPrice += price.values[selectedIndex].discount;
        }
        setSelectedIds(currentIds => {
            return currentIds.slice();
        })
        setTotalPrice(currentPrice);
    }

    function handleWiperSelect(newIndex) {
        if (wiperSelected.includes(newIndex)) {
            const findIndex = wiperSelected.findIndex(element => element === newIndex);
            wiperSelected.splice(findIndex,1);
            setWiperSelected(wiperSelected.slice());
            setTotalPrice(totalPrice - wipers.values[newIndex]);
        } else {
            wiperSelected.push(newIndex);
            setWiperSelected(wiperSelected.slice());
            setTotalPrice(totalPrice + wipers.values[newIndex]);
        }
    }

    useEffect(() => {
        selectOfferToCustomer(totalPrice);
    }, [selectedIds]);

    // needed to immediately refresh screen
    useEffect(() => {
        setSelectedIds(currentIds => {
            return currentIds.slice();
        })
    }, [totalPrice]);

    useEffect(() => {
        // reverse logic before switching to avoid errors
        if (!isRetrieved) {
            setDataUsed(emptyDummy);
            setHeaderUsed(emptyHeaders);
        } else {
            setDataUsed(dummyData);
            setHeaderUsed(headers);
        }
        setSelectedIds([]);
        setTotalPrice(0);
    }, [isRetrieved]);

    return (          
        <div className='select-offer'>
            <h3 className="text-24 text-blue mb-4 SO-header">Select Offer</h3>   
            <div className="table-container">
                <table className='SO-table'>
                    {/* map button headers (window type) */}
                    <tr>
                        <th className='SO-top'></th>
                        {headerUsed.map(element => 
                            <th className='SO-top' key={element} colSpan='2'>
                                {element.window}
                            </th>    
                        )}
                    </tr>
                    {/* map buttons with part names */}
                    <tr>
                        <th></th>
                        {headerUsed.map(element => 
                            element.parts.map(part => 
                                <th key={part.id}>
                                    <button className={selectedIds.includes(part.id) ? 'SO-button-active' : 'SO-button'} 
                                    onClick={() => selectOffer(part.id)}>{part.name}</button>
                                </th>
                            )
                        )}
                    </tr>
                    {/* map data in green bubbles */}
                    {isRetrieved && dummyData.slice(0, -2).map((element, i) => 
                        <tr key={i}>
                            <th className='SO-th'>{element.category}</th>
                            {element.values.map((value, i) =>
                                <td 
                                key={i}
                                className={selectedIds.includes(i) ? 'SO-data-selected' : 'SO-data'}>
                                    { value === 'Yes' && 
                                    <div className="icon-container"><img className='SO-icon' src={check} alt="Yes" /></div> }
                                    { value === 'No' && 
                                    <div className="icon-container"><img className='SO-icon' src={x} alt="No" /></div> }
                                    {(value !== 'Yes' && value !== 'No') && 
                                    <div className="icon-container">
                                        <a className={selectedIds.includes(i) ? 'btn btn-mini' : 'btn btn-mini-gray'}>{value}</a>
                                    </div> }
                                </td>
                            )}
                        </tr>
                    )}       
                    {/* empty data */}
                    {!isRetrieved && emptyDummy.slice(0, -2).map((element, i) => 
                        <tr key={i}>
                            <th className='SO-th'>{element.category}</th>
                            {element.values.map((value, i) =>
                                <td 
                                key={i}
                                className={selectedIds.includes(i) ? 'SO-data-selected' : 'SO-data'}>
                                    <a className={selectedIds.includes(i) ? 'btn btn-mini' : 'btn btn-mini-gray'}>{value}</a>
                                </td>
                            )}
                        </tr>
                    )}     
                    {/* map wipers */}
                    <tr>
                        <th className='SO-th'>{wipers.category}</th>
                        {wipers.values.map((value,i) => 
                            <td key={i}  
                            className={selectedIds.includes(i) ? 'SO-wipers-selected' : 'SO-wipers'}>
                                Claim: £{value} 
                                <Checkbox 
                                    checked={wiperSelected.includes(i)}
                                    onChange={() => handleWiperSelect(i)}
                                    sx={{
                                        color: '#9a73dd',
                                        '&.Mui-checked': {
                                            color: '#9a73dd',
                                        }
                                    }}/>
                            </td>
                        )}
                    </tr>
                    {/* map price */}
                    <tr>
                        <th className='SO-th'>{price.category}</th>
                        {price.values.map((value,i) => 
                            <td key={i}  
                            className={selectedIds.includes(i) ? 'SO-price-selected' : 'SO-price'}>
                                <span className='price-original'>£{value.original}</span>
                                <span> Our price: </span>
                                <span className='price-discount'> £{value.discount}</span>
                            </td>
                        )}
                    </tr>
                </table>
            </div>
            <div className="text-24 text-blue mb-4 SO-total-price">Total price: £{totalPrice}</div>
        </div>
    )
}