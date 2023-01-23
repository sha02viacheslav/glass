import { useEffect, useState, MouseEvent } from 'react';
import imageMapResize from 'image-map-resizer'; 
import {Button, Dialog, DialogActions, DialogTitle, ToggleButton, ToggleButtonGroup } from '@mui/material';
import styles from '../../css/window-selection.module.css';
import threeDoorTinted from '../../images/window-selection/3DoorHatch/3-Door Hatch 1.png';
import threeDoor from '../../images/window-selection/3DoorHatch/3-Door Hatch 3.png';
import front from '../../images/window-selection/3DoorHatch/front.png';
import rear from '../../images/window-selection/3DoorHatch/rear.png';
import r_1 from '../../images/window-selection/3DoorHatch/r_1.png';
import r_2 from '../../images/window-selection/3DoorHatch/r_2.png';
import r_3 from '../../images/window-selection/3DoorHatch/r_3.png';
import l_1 from '../../images/window-selection/3DoorHatch/l_1.png';
import l_2 from '../../images/window-selection/3DoorHatch/l_2.png';
import l_3 from '../../images/window-selection/3DoorHatch/l_3.png';
import rear_t from '../../images/window-selection/3DoorHatch/rear_t.png';
import l_3_t from '../../images/window-selection/3DoorHatch/l_3_t.png';
import r_3_t from '../../images/window-selection/3DoorHatch/r_3_t.png';

export default function ThreeDoorHatch({brokenWindowsToCustomer, brokenWindowsToComponent}) {

    // display popup
    const [popup, setPopup] = useState(false);
    // determine if back windows are tinted
    const [tinted, setTinted] = useState(false);
    const [tintedValue, setTintedValue] = useState('no');
    // toggle first time popup appears, popup should show just once
    const [popupConfirm, setPopupConfirm] = useState(JSON.parse(sessionStorage.getItem('askedTinted')) || false);
    // array of possible window selections for Coupe
    const [brokenWindows, setBrokenWindows] = useState([
        {name: 'Windscreen', window: 'front', broken: false, source: front, hasTinted: false},
        {name: 'Backlight', window: 'rear', broken: false, source: rear, hasTinted: true, tintedSource: rear_t},
        {name: 'Left front quarter', window: 'l_1', broken: false, source: l_1, hasTinted: false},
        {name: 'Left front drop', window: 'l_2', broken: false, source: l_2, hasTinted: false},
        {name: 'Left rear quarter', window: 'l_3', broken: false, source: l_3, hasTinted: true, tintedSource: l_3_t},
        {name: 'Right front quarter', window: 'r_1', broken: false, source: r_1, hasTinted: false},
        {name: 'Right front drop', window: 'r_2', broken: false, source: r_2, hasTinted: false},
        {name: 'Right rear quarter', window: 'r_3', broken: false, source: r_3, hasTinted: true, tintedSource: r_3_t},
    ]);
    // special array for sending selected broken windows to customer page
    const [selectedWindows, setSelectedWindows] = useState([]);

    // handle window selection
    function selectWindow(windowClicked) {
        const index = brokenWindows.findIndex(element => element.window === windowClicked);
        // display popup if a window which can be tinted is clicked for the first time
        if (!popupConfirm && brokenWindows[index].hasTinted) {
            setPopup(true);
            return; // don't allow back window selecting if popup is still active
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
        setTinted(answer);
        setPopup(false);
        setPopupConfirm(true);
        if (answer) {
            setTintedValue('yes');
        } else {
            setTintedValue('no');
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
    }, []);

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
                
            {/* display either car with tinted windows or normal */}
            <img className={!tinted ? styles.baseImage : styles.baseImageInactive} src={threeDoor} alt="" />
            <img className={tinted ? styles.baseImage : styles.baseImageInactive} src={threeDoorTinted} alt="" />

            {/* broken glass displays */}
            {brokenWindows.filter(element => element.broken === true).map(element => 
                <img 
                    key={element.window} className={styles.brokenGlass} 
                    src={(tinted && element.hasTinted) ? element.tintedSource : element.source} alt="" />
            )}

            {/* transparent layer on top of all car-related images to maintain image map */}
            <img className={styles.selectionLayer} src={threeDoor} alt="" usemap="#image-map" />

            {/* tinted window toggle */}
            <div>
                <span className="fs-18 text-blue">Tinted windows: </span>
                <ToggleButtonGroup
                    sx={{ ml: '10px' }}
                    color='secondary'
                    value={tintedValue}
                    exclusive
                    aria-label='Platform'>
                        <ToggleButton sx={{ width: 70 }} size='small' value='yes' onClick={() => tintedButtonHandle('yes')}>Yes</ToggleButton>
                        <ToggleButton sx={{ width: 70 }} size='small' value='no' onClick={() => tintedButtonHandle('no')}>No</ToggleButton>
                </ToggleButtonGroup>
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
                <area onClick={() => selectWindow("front")} coords="730,638,806,930,1196,926,1268,640,1245,610,1109,562,998,552,894,561,762,603" shape="poly" />
                <area onClick={() => selectWindow("rear")} coords="758,1551,779,1535,850,1588,1150,1590,1212,1535,1243,1551,1236,1595,1173,1653,1005,1668,816,1645,767,1604" shape="poly" />
                <area onClick={() => selectWindow("r_1")}  coords="1282,738,1288,817,1250,875" shape="poly" />
                <area onClick={() => selectWindow("r_2")}  coords="1282,855,1280,1282,1199,1295,1206,1044,1240,903" shape="poly" />
                <area onClick={() => selectWindow("r_3")}  coords="1203,1311,1280,1298,1224,1503,1203,1425" shape="poly" />
                <area onClick={() => selectWindow("l_1")}  coords="712,736,712,819,749,871" shape="poly" />
                <area onClick={() => selectWindow("l_2")}  coords="716,853,756,903,790,1053,795,1293,714,1279" shape="poly" />
                <area onClick={() => selectWindow("l_3")}  coords="716,1299,799,1311,776,1507" shape="poly" />
            </map>
        </div>
    )
}