import { useEffect, useState } from 'react';
import '../../css/select-offer.css';
// import Checkbox from '@mui/material/Checkbox';

export default function SelectOfferNew({selectOfferToCustomer, priceToParent}) {

    // const dummyData = data;
    // const [selectOffer, setSelectOffer] = useState(1);
    // const [wiperSelected, setWiperSelected] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalUnitPrice, setTotalUnitPrice] = useState(0);

    function calculateTotalPrice() {
        let total = 0;
        let unit_total = 0;
        for (let i = 0; i < selectOfferToCustomer.length; i++) {
            const price = selectOfferToCustomer[i].price_total;
            const unit = selectOfferToCustomer[i].price_subtotal;
            total += price;
            unit_total += unit;
        }
        setTotalPrice(total.toFixed(2));
        setTotalUnitPrice(unit_total.toFixed(2));
        priceToParent([{
            total: total.toFixed(2),
            subtotal: unit_total.toFixed(2)
        }])
    }

    useEffect(() => {
        calculateTotalPrice();
    }, []);

    return (          
        <div className='select-offer'>
            <div className="table-container">
                <table className='SO-table'>
                    {selectOfferToCustomer.map((element, rowIndex) => 
                        <tr key={rowIndex}>
                            <td className='so-info'>
                                <div className='info-div first-col'>
                                    {element.product}
                                </div>
                            </td>
                            <td className='so-info'>
                                <div className='info-div top-right'>
                                    <span>
                                        £ {element.price_unit.toFixed(2)}
                                    </span>
                                    {/* <span>
                                        £ {element.price_total.toFixed(2)}
                                    </span> */}
                                </div>
                            </td>
                        </tr>
                    )}
                    {/* <tr>
                        <td className='info'>
                            <div className="info-div first-col-wipers">
                                Claim new wipers
                            </div>
                        </td>
                        <td className='info'>
                            <div className="info-div wipers">
                                    <div>
                                        <div className='original-price'>£ 10</div>
                                        <div>£ 0</div>
                                    </div>
                                <Checkbox 
                                    checked={wiperSelected}
                                    onChange={() => setWiperSelected(!wiperSelected)}
                                    sx={{
                                        color: '#9a73dd',
                                        '&.Mui-checked': {
                                            color: '#9a73dd',
                                        }
                                    }}/>
                            </div>
                        </td>
                    </tr> */}
                </table>
            </div>
            <div className="total-container-out">
                <div className="total-container-in">
                    <div className="total-row">
                        <span className="total-bold">
                            Untaxed amount
                        </span>
                        <span>£ {totalUnitPrice}</span>
                    </div>
                    <div className="total-row">
                        <span className="total-bold">
                            Tax 20%
                        </span>
                        <span>£ {(totalPrice - totalUnitPrice).toFixed(2)}</span>
                    </div>
                    <div className="total-row total-last">
                        <span className="total-bold">
                            Total
                        </span>
                        <span>£ {totalPrice}</span>
                    </div>
                </div>
            </div>
            
        </div>
    )
} 