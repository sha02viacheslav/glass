import { useEffect, useState } from 'react';
import '../css/select-offer.css';
import Checkbox from '@mui/material/Checkbox';
import data from './data/selectOfferNewDummy.json';

export default function SelectOfferNew({selectOfferToCustomer, isRetrieved, paymentOptionToParent}) {

    // const selectOfferToCustomer = selectOfferToCustomer;
    const dummyData = data;
    const [totalPrice, setTotalPrice] = useState(0);
    const [savePrice, setSavePrice] = useState(0);
    const [selectOffer, setSelectOffer] = useState(1);
    const [wiperSelected, setWiperSelected] = useState(false);

    function setPaymentOption(pOption){
        paymentOptionToParent(pOption);
        setSelectOffer(pOption);
    }

    // useEffect(() => {
    //     console.log(offerDetails);
    //     if (offerDetails.lenght === 0) {
    //         setOfferDetails([{
    //                 price_subtotal: 0,
    //                 price_total: 0
    //         }])
    //         console.log('did it');
    //     }
    // }, []);

    return (          
        <div className='select-offer'>
            <h3 className="text-24 text-blue SO-header">Quotation</h3>   
            <div className="table-container">
                <table className='SO-table'>
                    {selectOfferToCustomer.map((element, rowIndex) => 
                        <tr key={rowIndex}>
                            <td className='info'>
                                <div className='info-div first-col'>
                                    {element.product}
                                </div>
                            </td>
                            <td className='info'>
                                <div className='info-div top-right'>
                                    <span className="original-price">
                                        £ {element.price_unit.toFixed(2)}
                                    </span>
                                    <span>
                                        £ {element.price_total.toFixed(2)}
                                    </span>
                                </div>
                            </td>
                        </tr>
                    )}
                    <tr>
                        <td className='info'>
                            <div className="info-div first-col-wipers">
                                Claim new wipers
                            </div>
                        </td>
                        <td className='info'>
                            <div className="info-div wipers">
                                    <div>
                                        <div className='original-price'>£ {dummyData.wipers.toFixed(2)}</div>
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
                    </tr>
                </table>
            </div>
            <div className="total-container-out">
                <div className="total-container-in">
                    <div className="total-row">
                        <span className="total-bold">
                            Untaxed amount
                        </span>
                        <span>£ {selectOfferToCustomer[0].price_subtotal}</span>
                    </div>
                    <div className="total-row">
                        <span className="total-bold">
                            Tax x%
                        </span>
                        <span>£ {selectOfferToCustomer[0].price_total - selectOfferToCustomer[0].price_subtotal}</span>
                    </div>
                    <div className="total-row total-last">
                        <span className="total-bold">
                            Total
                        </span>
                        <span>£ {selectOfferToCustomer[0].price_total}</span>
                    </div>
                </div>
            </div>
            <div className='PM-container'>
                <div className='PM'>
                    <div>Payment</div>
                    <div>Options</div>
                </div>
                <button className={selectOffer === "4 Month Plan" ? 'PM-btn-active' : 'PM-btn'} onClick={() => setPaymentOption("4 Month Plan")}>
                    <span className="fs-14">4 month</span>
                    <div className='PM-price'>£{(selectOfferToCustomer[0].price_total / 4).toFixed(2)}</div>
                </button>
                <button className={selectOffer === "Insurance" ? 'PM-btn-active' : 'PM-btn'} onClick={() => setPaymentOption("Insurance")}>
                    <span className="fs-14">Insurance</span>
                    <div className='PM-price'>£ Excess</div>
                </button>
                <button className={selectOffer === "Single Payment" ? 'PM-btn-active' : 'PM-btn'} onClick={() => setPaymentOption("Single Payment")}>
                    <span className="fs-14">Single pay</span>
                    <div className='PM-price'>£{selectOfferToCustomer[0].price_total}</div>
                </button>
            </div>
            <div className="PM-text-container">
                {selectOffer === 1 && <div className="PM-text">
                    Amet minim mollit non deserunt ullamco est sit est aliqua dolor 
                    do amet sint. Velit officia consequat e duis enim velit mollit. Exercitation veniam  onequat sunt nostrud amet
                </div>}
                {selectOffer === 2 && <div className="PM-text">
                    Impetus fabellas democritum quo ei. Doctus legimus feugait ei sit. Ea mea ludus interesset disputationi. Ut amet docendi mentitum eam, sumo
                </div>}
                {selectOffer === 3 && <div className="PM-text">
                    Ex neglegentur vituperatoribus sit. Sed viris quidam erroribus et, an velit mollis scaevola his. Case cibo 
                    inermis ne mea, has vocent partiendo eu. Ius ex diam nostrud tractatos, sit 
                </div>}
            </div>
        </div>
    )
} 