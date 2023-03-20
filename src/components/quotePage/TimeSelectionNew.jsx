import '../../css/time-select-new.css';
import stripes from '../icons/stripes.png';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { Button, Menu } from '@mui/material';
import { useEffect, useState } from 'react';
import arrowIcon from '../icons/down-arrow.png';
// import temp_timeData from './data/newTSDummy.json';
// import axios from 'axios';
import CreateTimetable from '../functions/CreateTimetable';

const timeheaders = ['08:00', '10:00', '12:00', '14:00','16:00','18:00','20:00','22:00'];
const passedSlots = [10, 12, 14, 16, 18, 20, 22];
const monthValues = {"Jan":"01","Feb":"02","Mar":"03","Apr":"04","May":"05","June":"06","July":"07","Aug":"08","Sept":"09","Oct":"10","Nov":"11","Dec":"12"};
const monthValuesRev = {"01":"Jan","02":"Feb","03":"Mar","04":"Apr","05":"May","06":"June","07":"July","08":"Aug","09":"Sept","10":"Oct","11":"Nov","12":"Dec"};

export default function TimeSelection({timeSlotToParent, timeEndToParent, liveBooking, slot}) {

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedSlot, setSelectedSlot] = useState('');
    const [slotChanged, setSlotChanged] = useState(false);
    const currentTime = selectedDate.getHours();
    const [timeData, setTimeData] = useState([]);
    const [slots, setSlots] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pages, setPages] = useState([]);
    const [pastIds, setPastIds] = useState([]);
    const today = selectedDate.getDate();
    // const today = 9; // dummy data version
    const currentHour = new Date().getHours();
    const currentYear = new Date().getFullYear();
    const [isMobile, setIsMobile] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    function handleMenuClick(event) {
        setMenuOpen(!menuOpen);
        setAnchorEl(event.currentTarget)
    }

    function handleMenuClose(newDate) {
        setMenuOpen(false);
        setAnchorEl(null);
        setSelectedDate(newDate);
    }

    function getTimeData(data) {
        setTimeData(data);
    }

    // function to select a given time slot
    function selectSlot(monthSelected, daySelected, timeSelected) {
        let currentSelection = document.getElementById(selectedSlot);
        let idTag = monthSelected.concat(daySelected).concat(timeSelected);
        let newSelection = document.getElementById(idTag);
        if (currentSelection != null) {
            // remove active classname from previously selected timeslot
            currentSelection.classList.remove('ts-td-active');
        } 
        // if statement to avoid errors
        if (newSelection != null) {
            // check if timeslot has passed
            const timeCheck = passedSlots[Number(timeSelected)] - currentHour;
            if ((timeCheck <= 0) && slots[0].includes(daySelected)) {
                return;
            }
            newSelection.classList.add('ts-td-active');
        }
        // save the data
        let odooDay = daySelected;
        if (odooDay.length === 1) {
            odooDay = '0' + odooDay;
        }
        // for sending slot info to odoo, slot starting time
        let odooSlot = currentYear.toString().concat('-',monthValues[monthSelected]).concat('-',odooDay);
        // send slot end time
        let odooEnd = odooSlot.concat(' ',timeheaders[timeSelected + 1]).concat('',':00');
        odooSlot = odooSlot.concat(' ',timeheaders[timeSelected]).concat('',':00');
        setSelectedSlot(idTag); 
        setSlotChanged(true);   
        if (!liveBooking) {
            // send data to parent page to enable next btn
            timeSlotToParent(odooSlot);  
            timeEndToParent(odooEnd);
        }
    }

    // function only runs in live booking tab
    function confirmSelection() {
        // save the slot selection and push to past slots
        sessionStorage.setItem('selectedSlot', JSON.stringify(selectedSlot));  
        let pastSlots = JSON.parse(sessionStorage.getItem('pastSlots')) || [];
        pastSlots.push(selectedSlot.date.concat(' ', selectedSlot.time));
        sessionStorage.setItem('pastSlots', JSON.stringify(pastSlots));  
        // send data to parent page to enable next btn
        timeSlotToParent(selectedSlot.date.concat(' ', selectedSlot.time));  
    }

    function changePage(navValue) {
        if (navValue === 'next'  && pages.includes(currentPage + 1)) {
            setCurrentPage(currentPage + 1);
        } else if (navValue === 'prev'  && pages.includes(currentPage - 1)) {
            setCurrentPage(currentPage - 1);
        }
    }

    // navigating calendar pages and disable passed slots
    useEffect(() => {
        if (isMobile) {
            setSlots(timeData.slice(3*currentPage-3, 3*currentPage));
        } else {
            setSlots(timeData.slice(7*currentPage-7, 7*currentPage));
        }
    }, [currentPage, timeData]);

    useEffect(() => {
        // decipher odoo data into useable timeslot id
        // odoo:"2023-01-12 12:00:00"
        // id:"Jan122"
        let selectionId = '';
        if (slot != '') {
            const dbId = slot;
            const dateTime = dbId.split(' ');
            let dateSplit = dateTime[0].split('-');
            const timeSplit = dateTime[1].substring(0, 5);
            const timeIndex = timeheaders.indexOf(timeSplit);
            const timeCheck = Number(dateTime[1].substring(0, 2));
            if ((timeCheck - currentHour <= 0) && (Number(dateSplit[2]) === today)) {
                // if the slot has passed dont set it
                return;
            } else {
                selectionId = monthValuesRev[dateSplit[1]].concat(dateSplit[2]).concat(timeIndex);
                setSelectedSlot(selectionId);
                timeSlotToParent(selectionId);
            }
        }
        // find which slots have passed
        let past = [];
        if (timeData.length > 0) {
            for (let i = 0; i < timeData[0].slice(2).length; i++) {
                let idTag = timeData[0][0].concat(timeData[0][1]).concat(i.toString());
                const timeCheck = passedSlots[i] - currentHour; 
                if (timeCheck <= 0) {
                    past.push(idTag);  
                }
            }
        }
        setPastIds(past); 
        // determine if table is viewed in mobile view and set cols in display accordingly
        let pageCount = [];
        if (window.innerWidth <= 800) {
            setIsMobile(true);
            setSlots(timeData.slice(0,3));
            // determine the total number of pages possible to display
            for (let i = 0; i < timeData.length/3; i++) {
                pageCount.push(i + 1);           
            }
        } else {
            setSlots(timeData.slice(0,7));
            for (let i = 0; i < timeData.length/7; i++) {
                pageCount.push(i + 1);           
            }
        }
        setPages([...new Set(pageCount)]);
    }, [timeData]);

    return (
        <div>
            <CreateTimetable 
                timetableToClient={getTimeData}
            />
            <div className='time-select-main'>
                <h1>Set date and time</h1>
                    <div className='date-pick-container'>
                        {/* <span className='time-select-month'>December</span> */}
                        <Button 
                            id='basic-button'
                            sx={{width: 'fit-content', height: 40, color: '#484848', fontSize: 23, textTransform: 'none', mb: 3, '&:hover':{backgroundColor: '#9a73dd1c'}}}
                            aria-controls={menuOpen ? 'basic-menu' : undefined}
                            aria-haspopup='true'
                            aria-expanded={menuOpen ? 'true' : undefined}
                            onClick={handleMenuClick}>
                                <span className='time-select-month'>December</span>
                                <img className='date-picker-icon' src={arrowIcon} alt="" />
                        </Button>
                        {/* <button className='today-btn'>
                            Today
                        </button> */}
                        {/* navigation arrows */}
                        <div className="date-nav-container">
                            <button className='date-nav-btn' onClick={() => changePage('prev')}><img className='nav-right' src={arrowIcon} alt="" /></button>
                            <button className='date-nav-btn' onClick={() => changePage('next')}><img className='nav-left' src={arrowIcon} alt="" /></button>
                        </div>
                    </div>
                    <Menu
                        id='basic-menu'
                        anchorEl={anchorEl}
                        open={menuOpen}
                        onClose={() => handleMenuClose(selectedDate)}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                        >
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <StaticDatePicker
                                displayStaticWrapperAs='desktop'
                                openTo='day'
                                minDate={new Date()}
                                value={selectedDate}
                                onChange={(newValue) => {
                                    handleMenuClose(newValue);
                                }} />
                        </LocalizationProvider>
                    </Menu>
                {timeData.length > 0 && <table className='ts-table' id='calendar'>
                    {/* map time headers on left side */}
                    <tr>
                        {timeheaders.map(element => 
                            <td key={element}>
                                <div className="ts-time">
                                    {element}
                                </div>
                            </td>
                        )}
                    </tr>
                    {/* map slots and dates */}
                    {slots.map((element, index) => 
                        <tr key={index}>
                            {/* first row maps dates */}
                            <td className='ts-date-container'>
                                <div className='ts-date-month'>{element[0]}</div>
                                <div className={Number(element[1]) != today ? 
                                    'ts-date-day' : 'ts-date-today'}>
                                        {element[1]}
                                </div>
                            </td>
                            {/* subsequent rows map timeslots */}
                            {element.slice(2).map((occup, time) => 
                                <td 
                                    id={element[0] + element[1] + time.toString()}
                                    onClick = {() => selectSlot(element[0], element[1], time)}
                                    key={time}
                                    className={ (element[0] + element[1] + time.toString()) === selectedSlot ? 'ts-' + occup + ' ts-td-active' : 'ts-' + occup}>
                                        { pastIds.includes(element[0] + element[1] + time.toString()) ? 
                                        <div className='ts-passed'>-</div> : 
                                        (occup != 'Half' ? occup : <img src={stripes} alt="" />)  }
                                </td>
                            )}
                        </tr>
                    )}
                </table>}
                    
                <div className="ts-legend-container">
                    <div className="ts-legend-icon ts-past">-</div>
                    <span className="ts-legend-text">Timeslot passed</span>
                    <div className="ts-legend-icon ts-full">-</div>
                    <span className="ts-legend-text">Fully booked</span>
                    <img className='ts-legend-icon' src={stripes} alt="" />
                    <span className="ts-legend-text">Half booked</span>
                    <div className="ts-legend-icon ts-free">-</div>
                    <span className="ts-legend-text">Free</span>
                    {liveBooking && <div className='ts-confirm-btn-container'>
                        <button 
                            id='pay-book-confirm'
                            className={slotChanged ? 'ts-confirm-btn' : 'ts-confirm-btn-disable'}
                            onClick={confirmSelection}>
                                Confirm
                        </button>
                    </div>}
                </div>
            </div>
        </div>
    )
}