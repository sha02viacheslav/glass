import { useEffect, useState } from 'react';
import imageMapResize from 'image-map-resizer'; 
import {Button, Dialog, DialogActions, DialogTitle, ToggleButton, ToggleButtonGroup } from '@mui/material';
import styles from '../../css/window-selection.module.css';
import vanBarnTinted from '../../images/window-selection/VAN_Barn/VAN Barn door 1.png';
import vanBarn from '../../images/window-selection/VAN_Barn/VAN Barn door 2.png';
import vanTailgaterTinted from '../../images/window-selection/VAN_Tailgater/BLAC VAN TAGLIATELE.png';
import vanTailgater from '../../images/window-selection/VAN_Tailgater/VAN Tailgater 3.png';
import front from '../../images/window-selection/VAN_Barn/front.png';
import r_rear from '../../images/window-selection/VAN_Barn/r_rear.png';
import l_rear from '../../images/window-selection/VAN_Barn/l_rear.png';
import r_rear_t from '../../images/window-selection/VAN_Barn/r_rear_t.png';
import l_rear_t from '../../images/window-selection/VAN_Barn/l_rear_t.png';
import rear from '../../images/window-selection/VAN_Tailgater/rear.png';
import rear_t from '../../images/window-selection/VAN_Tailgater/rear_t.png';
import r_1 from '../../images/window-selection/VAN_Barn/r_1.png';
import r_2 from '../../images/window-selection/VAN_Barn/r_2.png';
import r_3 from '../../images/window-selection/VAN_Barn/r_3.png';
import r_4 from '../../images/window-selection/VAN_Barn/r_4.png';
import l_1 from '../../images/window-selection/VAN_Barn/l_1.png';
import l_2 from '../../images/window-selection/VAN_Barn/l_2.png';
import l_3 from '../../images/window-selection/VAN_Barn/l_3.png';
import l_4 from '../../images/window-selection/VAN_Barn/l_4.png';
import l_3_t from '../../images/window-selection/VAN_Barn/l_3_t.png';
import l_4_t from '../../images/window-selection/VAN_Barn/l_4_t.png';
import r_3_t from '../../images/window-selection/VAN_Barn/r_3_t.png';
import r_4_t from '../../images/window-selection/VAN_Barn/r_4_t.png';
import l_5 from '../../images/window-selection/VAN_Barn/l_5.png';
import r_5 from '../../images/window-selection/VAN_Barn/r_5.png';
import l_5_t from '../../images/window-selection/VAN_Barn/l_5_t.png';
import r_5_t from '../../images/window-selection/VAN_Barn/r_5_t.png';

export default function Vans({brokenWindowsToCustomer, brokenWindowsToComponent}) {

    // display popup
    const [popup, setPopup] = useState(false);
    // determine if back windows are tinted
    const [tinted, setTinted] = useState(false);
    const [tintedValue, setTintedValue] = useState('no');
    // determine if body is tailgater or barn door
    const [bodyValue, setBodyValue] = useState(JSON.parse(sessionStorage.getItem('vanBodyType')) || 'tail');
    const [isBarnDoor, setIsBarnDoor] = useState(false);
    const [bodyPopupConfirm, setBodyPopupConfirm] = useState(JSON.parse(sessionStorage.getItem('askedVanBody')) || false);
    const [bodyPopup, setBodyPopup] = useState(false);
    // toggle first time popup appears, popup should show just once
    const [popupConfirm, setPopupConfirm] = useState(JSON.parse(sessionStorage.getItem('askedTinted')) || false);
    // array of possible window selections for Coupe
    const [brokenWindows, setBrokenWindows] = useState([
        {name: 'Windscreen', window: 'front', broken: false, source: front, hasTinted: false},
        {name: 'Left barn door', window: 'l_rear', broken: false, source: l_rear, hasTinted: true, tintedSource: l_rear_t},
        {name: 'Right barn door', window: 'r_rear', broken: false, source: r_rear, hasTinted: true, tintedSource: r_rear_t},
        {name: 'Backlight', window: 'rear', broken: false, source: rear, hasTinted: true, tintedSource: rear_t},
        {name: 'Left front quarter', window: 'l_1', broken: false, source: l_1, hasTinted: false},
        {name: 'Left front drop', window: 'l_2', broken: false, source: l_2, hasTinted: false},
        {name: 'Left rear door', window: 'l_3', broken: false, source: l_3, hasTinted: true, tintedSource: l_3_t},
        {name: 'Left middle quarter', window: 'l_4', broken: false, source: l_4, hasTinted: true, tintedSource: l_4_t},
        {name: 'Left rear quarter', window: 'l_5', broken: false, source: l_5, hasTinted: true, tintedSource: l_5_t},
        {name: 'Right front quarter', window: 'r_1', broken: false, source: r_1, hasTinted: false},
        {name: 'Right front drop', window: 'r_2', broken: false, source: r_2, hasTinted: false},
        {name: 'Right rear door', window: 'r_3', broken: false, source: r_3, hasTinted: true, tintedSource: r_3_t},
        {name: 'Right middle quarter', window: 'r_4', broken: false, source: r_4, hasTinted: true, tintedSource: r_4_t},
        {name: 'Right rear quarter', window: 'r_5', broken: false, source: r_5, hasTinted: true, tintedSource: r_5_t}
    ]);
    // special array for sending selected broken windows to customer page
    const [selectedWindows, setSelectedWindows] = useState([]);

    // handle window selection
    function selectWindow(windowClicked) {
        let index = 0;
        if ((windowClicked === 'r_rear' || windowClicked === 'l_rear') && !isBarnDoor) {
            index = brokenWindows.findIndex(element => element.window === 'rear');
        } else {
            index = brokenWindows.findIndex(element => element.window === windowClicked);
        }
        // display popup if a window which can be tinted is clicked for the first time
        if (!popupConfirm && brokenWindows[index].hasTinted) {
            setPopup(true);
            return; // don't allow back window selecting if popup is still active
        } else if (!bodyPopupConfirm && brokenWindows[index].window === 'rear') {
            setBodyPopup(true);
            return;
        }
        // add to array which is sent to customer page
        if (brokenWindows[index].broken) {
            const index2 = selectedWindows.findIndex(element => element === brokenWindows[index].name);
            const index3 = selectedWindows.findIndex(element => element === brokenWindows[index].name.concat(' tinted'));
            // find if it was selected as a tinted glass or not and remove from array
            if (index2 >= 0) {
                selectedWindows.splice(index2, 1);
            }
            if (index3 >= 0) {
                selectedWindows.splice(index3, 1);
            } 
        } else {
            if (tinted && brokenWindows[index].hasTinted) {
                selectedWindows.push(brokenWindows[index].name + ' tinted');
            } else {
                selectedWindows.push(brokenWindows[index].name);
            }
        }
        setSelectedWindows(windows => {
            return windows.slice();
        })
        // change main array
        brokenWindows[index].broken = !brokenWindows[index].broken;
        setBrokenWindows(windows => {
            return windows.slice();
        }) 
    }

    useEffect(() => {
        brokenWindowsToCustomer(selectedWindows);
    }, [selectedWindows]);

    function handlePopup(answer) {
        // popup for tinted windows
        setTinted(answer);
        setPopup(false);
        setPopupConfirm(true);
        if (answer) {
            tintedButtonHandle('yes');
        } else {
            tintedButtonHandle('no');
        }
        sessionStorage.setItem('askedTinted', JSON.stringify(true));
    }

    // handle tinted toggle button
    function tintedButtonHandle(newValue) {
        if (newValue === 'no') {
            setTinted(false);
            // update tinted windows in brokenWindows array as not tinted
            for (let i = 0; i < selectedWindows.length; i++) {
                selectedWindows[i] = selectedWindows[i].replace(' tinted', '');
            }
            // update tinted windows in selectedWindows array as not tinted
            setSelectedWindows(selectedWindows.slice());
        } else {
            setTinted(true);
            // update not tinted windows in brokenWindows array as tinted
            for (let i = 0; i < selectedWindows.length; i++) {
                const index = brokenWindows.findIndex(element => element.name === selectedWindows[i]);
                if (brokenWindows[index].hasTinted === true) {
                    selectedWindows[i] = selectedWindows[i].concat(' tinted');
                }
            }
            // update tinted windows in selectedWindows array as tinted
            setSelectedWindows(selectedWindows.slice());
        }
        setTintedValue(newValue);
        setPopupConfirm(true);
        setBrokenWindows(brokenWindows.slice());
    }

    // switch between barn door and tailgater
    function bodyChange(bodySelected) {
        setIsBarnDoor(bodySelected);
        if (bodySelected) {
            setBodyValue('barn');
            if (brokenWindows[3].broken) {
                // disable tailgater backwindow
                brokenWindows[3].broken = false;
                // find if any of the back windows are selected and remove them from array sent to customer if so
                const index2 = selectedWindows.findIndex(element => element === 'Backlight');
                const index3 = selectedWindows.findIndex(element => element === 'Backlight tinted');
                if (index2 >= 0) {
                    selectedWindows.splice(index2, 1);
                }
                if (index3 >= 0) {
                    selectedWindows.splice(index3, 1);
                } 
            }
            sessionStorage.setItem('vanBodyType', JSON.stringify('barn'));
        } else {
            setBodyValue('tail');
            if (brokenWindows[1].broken) {
                brokenWindows[1].broken = false;
                // find if any of the back windows are selected and remove them from array sent to customer if so
                const index2 = selectedWindows.findIndex(element => element === 'Left barn door');
                const index3 = selectedWindows.findIndex(element => element === 'Left barn door tinted');
                if (index2 >= 0) {
                    selectedWindows.splice(index2, 1);
                }
                if (index3 >= 0) {
                    selectedWindows.splice(index3, 1);
                } 
            }
            if (brokenWindows[2].broken) {
                brokenWindows[2].broken = false;
                // find if any of the back windows are selected and remove them from array sent to customer if so
                const index2 = selectedWindows.findIndex(element => element === 'Right barn door');
                const index3 = selectedWindows.findIndex(element => element === 'Right barn door tinted');
                if (index2 >= 0) {
                    selectedWindows.splice(index2, 1);
                }
                if (index3 >= 0) {
                    selectedWindows.splice(index3, 1);
                } 
            }
            sessionStorage.setItem('vanBodyType', JSON.stringify('tail'));
        }
        setSelectedWindows(windows => {
            return windows.slice();
        })
    }

    // handle popup for bodytype
    function handleBodyPopup(answer) {
        setIsBarnDoor(answer);
        setBodyPopup(false);
        setBodyPopupConfirm(true);
        if (answer) {
            bodyChange('barn');
        } else {
            bodyChange('tail');
        }
        sessionStorage.setItem('askedVanBody', JSON.stringify(true));
    }

    function checkIfPreviouslySelected(selection) {
        // currently not working with tinted windows
        if (selection.includes(' tinted')) {
            tintedButtonHandle('yes');
        }
        const index = brokenWindows.findIndex(element => element.name === selection.replace(' tinted', ''));
        if (index >= 0) {
            brokenWindows[index].broken = true;
        } else {
            return;
        }
    }
    
    useEffect(() => {
        // necessary to maintain proper image map scaling
        imageMapResize();
        // preselect windows if previously selected
        if (brokenWindowsToComponent.length > 0) {
            brokenWindowsToComponent.forEach(element => checkIfPreviouslySelected(element));
            setSelectedWindows(brokenWindowsToComponent);        
        }
        if (bodyValue === 'barn') {
            setIsBarnDoor(true);
        } else {
            setIsBarnDoor(false);
        }
    }, [brokenWindowsToComponent]);

    return (
        <div className={styles.container}>
            {/* display popup */}
            <div>
                <Dialog
                    open={popup}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Are your back windows tinted?"}
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={() => handlePopup(true)}>Yes</Button>
                        <Button onClick={() => handlePopup(false)}>No</Button>
                    </DialogActions>
                </Dialog>
            </div>
            {/* body type popup */}
            <div>
                <Dialog
                    open={bodyPopup}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Do you have one or two rear windows?"}
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={() => handleBodyPopup(false)}>One</Button>
                        <Button onClick={() => handleBodyPopup(true)}>Two</Button>
                    </DialogActions>
                </Dialog>
            </div>
                
            {/* display either car with tinted windows or normal */}
            <img className={(!tinted && !isBarnDoor) ? styles.baseImage : styles.baseImageInactive} src={vanTailgater} alt="" />
            <img className={(tinted && !isBarnDoor) ? styles.baseImage : styles.baseImageInactive} src={vanTailgaterTinted} alt="" />


            <img className={(!tinted && isBarnDoor) ? styles.baseImage : styles.baseImageInactive} src={vanBarn} alt="" />
            <img className={(tinted && isBarnDoor) ? styles.baseImage : styles.baseImageInactive} src={vanBarnTinted} alt="" />

            {/* broken glass displays */}
            {brokenWindows.filter(element => element.broken === true).map(element => 
                <img 
                    key={element.window} className={styles.brokenGlass} 
                    src={(tinted && element.hasTinted) ? element.tintedSource : element.source} alt="" />
            )}

            {/* transparent layer on top of all car-related images to maintain image map */}
            <img className={styles.selectionLayer} src={vanBarn} alt="" usemap="#image-map" />

            {/* tinted window toggle */}
            <div>
                <span className="fs-18 text-blue toggle-tinted">Tinted windows: </span>
                <ToggleButtonGroup
                    color='secondary'
                    value={tintedValue}
                    exclusive
                    aria-label='Platform'>
                        <ToggleButton sx={{ width: 120 }} size='small' value='yes' onClick={() => tintedButtonHandle('yes')}>Yes</ToggleButton>
                        <ToggleButton sx={{ width: 120 }} size='small' value='no' onClick={() => tintedButtonHandle('no')}>No</ToggleButton>
                </ToggleButtonGroup>
            </div>
            <div>
                <span className="fs-18 text-blue toggle-van">Body type: </span>
                <ToggleButtonGroup
                    color='secondary'
                    value={bodyValue}
                    exclusive
                    aria-label='Platform'>
                        <ToggleButton sx={{ width: 120 }} size='small' value='barn' onClick={() => bodyChange(true)}>Barn door</ToggleButton>
                        <ToggleButton sx={{ width: 120 }} size='small' value='tail' onClick={() => bodyChange(false)}>Tailgater</ToggleButton>
\                </ToggleButtonGroup>
            </div>

            {/* buttons for broken windows */}
            <div className="btns my-4">
                {brokenWindows.map(element => 
                    <a 
                        className={element.broken ? 'btn btn-gray-active' : 'btn btn-gray'}
                        onClick={() => selectWindow(element.window)}
                        >{(tinted && element.hasTinted) ? (element.name + ' tinted') : element.name}</a>)}
            </div> 

            <map name="image-map">
                <area onClick={() => selectWindow("front")} coords="806,610,793,446,846,393,1003,372,1153,395,1205,444,1196,605,1000,584" shape="poly" />
                <area onClick={() => selectWindow("r_rear")} coords="1017,1753,1016,1717,1210,1712,1222,1742,1122,1751" shape="poly" />
                <area onClick={() => selectWindow("l_rear")} coords="987,1758,982,1719,792,1712,779,1742,848,1754" shape="poly" />
                {/* {!isBarnDoor && <area onClick={() => selectWindow("rear")} alt="rear" title="rear" coords="779,1740,788,1715,1212,1715,1224,1742,991,1756" shape="poly" />} */}
                <area onClick={() => selectWindow("r_1")} coords="1238,459,1242,553,1217,542" shape="poly" />
                <area onClick={() => selectWindow("r_2")} coords="1245,568,1252,762,1190,773,1203,663,1220,554" shape="poly" />
                <area onClick={() => selectWindow("r_3")} coords="1196,790,1254,780,1261,1159,1201,1168" shape="poly" />
                <area onClick={() => selectWindow("r_4")} coords="1203,1189,1259,1177,1265,1540,1212,1547" shape="poly" />
                <area onClick={() => selectWindow("r_5")} coords="1213,1563,1265,1558,1263,1678,1212,1650" shape="poly" />
                <area onClick={() => selectWindow("l_1")} coords="762,448,753,548,779,541" shape="poly" />
                <area onClick={() => selectWindow("l_2")} coords="756,566,779,559,807,732,802,778,747,760" shape="poly" />
                <area onClick={() => selectWindow("l_3")} coords="746,783,807,790,799,1170,735,1158" shape="poly" />
                <area onClick={() => selectWindow("l_4")} coords="737,1178,799,1185,792,1545,732,1542" shape="poly" />
                <area onClick={() => selectWindow("l_5")} coords="739,1553,793,1562,786,1650,737,1675" shape="poly" />
            </map>
        </div>
    )
}