import '../css/license-plate.css';
import flag from './icons/uk-flag.png';

export default function LicensePlate({licenseNumber, model, handleVehInputChange, placeholderVal}) {

    return (
        <div className="center">
            <div className="license-plate">
                <div className="left-container">
                    <div className="yellow-box">
                        <div className="blue-box">
                            <img className='flag' src={flag} alt="" />
                            <div className='gb'>UK</div>
                        </div>
                        <input autoFocus className='license-input' type="text" value={licenseNumber} placeholder={placeholderVal} onChange={handleVehInputChange}/>
                    </div>
                    <p className="fw-500 mb-0 ms-2"> 
                        <img src={process.env.PUBLIC_URL + "/img/car-sv.svg"} className="img-fluid me-2" alt="" /> 
                        {model}
                    </p>
                </div>
                <div className="right-container">
                    <button className='edit-btn'>
                        EDIT
                    </button>
                </div>
            </div>            
        </div>
    )
}