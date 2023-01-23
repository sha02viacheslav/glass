import '../css/time-select.css';
import stripes from './icons/stripes.png';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { Button, Menu } from '@mui/material';
import { useEffect, useState } from 'react';
import arrowIcon from './icons/down-arrow.png';
import timeData from '../data/timeSelectionDummy.json';

export default function TimeSelection({isEdit, timeSelectToParent, dateToParent, timeSlotToParent}) {

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedSlot, setSelectedSlot] = useState(JSON.parse(sessionStorage.getItem('selectedSlot')) || '');
    const currentTime = selectedDate.getHours();
    const [isPayBook, setIsPayBook] = useState(false);

    const slots = timeData;

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

    // function to select a given time slot
    function selectSlot(dateIndex, timeSlot) {
        const month = selectedDate.getMonth() + 1; 
        const date = month.toString().concat(' ', slots.dates[dateIndex]);
        const newSelection = date.concat(', ', timeSlot);
        setSelectedSlot(newSelection);

        // also save the location to pastSlots in useState
        let allSlots = JSON.parse(sessionStorage.getItem('pastSlots')) || [];
        allSlots.push(newSelection);
        sessionStorage.setItem('selectedSlot', JSON.stringify(newSelection));
        sessionStorage.setItem('pastSlots', JSON.stringify(allSlots));
        sessionStorage.setItem('selectedDate', JSON.stringify(date));
        sessionStorage.setItem('selectedTime', JSON.stringify(timeSlot));

        // send between components to show immediate effects
        dateToParent(date);
        timeSlotToParent(timeSlot);
        setIsPayBook(true);
        timeSelectToParent(newSelection);

        // only incase the component is in the pay&book tab
        if (isEdit) {
            document.getElementById('pay-book-confirm').disabled = false;
        }
    }

    useEffect(() => {
        if (window.innerWidth <= 800) {
            setIsMobile(true);
        } 
        if (isEdit) {
            document.getElementById('pay-book-confirm').disabled = true;
        }
    }, []);

    return (
        <div className="center">
            <div className='time-select'>
                {/* <div className="row m-2">
                    <div className="col-md-12 mt-2">
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateTimePicker
                                    margin={2}
                                    label="Select Booking Date&Time"
                                    minDate={new Date()}
                                    maxDate={new Date().setDate(new Date().getDate() + 7)}
                                    minutesStep={5}
                                    minTime={new Date(0, 0, 0, 8)}
                                    maxTime={new Date(0, 0, 0, 18, 45)}
                                    value={selectedDate}
                                    onChange={setSelectedDate}
                                    renderInput={(params) => <TextField margin='normal' {...params} />}
                                />
                            </LocalizationProvider>
                    </div>
                </div> */}
                    <h3 className="text-24 text-blue mb-4 time-select-header">Set date and time</h3>
                    <div className='date-picker'>
                        {/* <span className='time-select-month'>December</span> */}
                        <Button 
                            id='basic-button'
                            sx={{width: 170, height: 40, color: '#484848', fontSize: 23, textTransform: 'none', mb: 3, '&:hover':{backgroundColor: '#9a73dd1c'}}}
                            aria-controls={menuOpen ? 'basic-menu' : undefined}
                            aria-haspopup='true'
                            aria-expanded={menuOpen ? 'true' : undefined}
                            onClick={handleMenuClick}>
                                <span className='time-select-month'>December</span>
                                <img className='date-picker-icon' src={arrowIcon} alt="" />
                        </Button>
                        <button className='today-btn'>
                            Today
                        </button>
                        <div className="date-nav-container">
                            <button className='nav-btn'><img className='nav-right' src={arrowIcon} alt="" /></button>
                            <button className='nav-btn'><img className='nav-left' src={arrowIcon} alt="" /></button>
                        </div>
                    </div>
                    {/* navigation arrows */}


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
                {!isMobile && <table className='time-select-table'>
                    {/* display dates */}
                    <tr>
                        <th className='time-select-clock'><span className='time-select-value-first'>08:00</span></th>
                        <th className='date-entry'>
                            <span className='time-select-dates'>{slots.dates[0]}</span>
                            <div className='time-select-today'>Today</div>
                        </th>
                        {slots.dates.slice(1).map((element, index) => 
                            <th key={index} className={index === 5 ? 'date-last' : 'date-entry'}>
                                <span className='time-select-dates'>{element}</span>
                                <div className='time-select-today-invisible'>Today</div>
                            </th>
                        )}
                    </tr>
                    {/* display 7 time slots */} 
                    {/* 8-10 */}
                    <tr>
                        <th className='time-select-clock'><span className='time-select-value'>10:00</span></th>
                        <th className='time-select-entry' onClick={() => selectSlot(0, '8-10')}>
                            {currentTime >= 10 && <div className="slot-disabled">passed</div> }
                            {(!(selectedSlot.includes('8-10') && selectedSlot.includes(slots.dates[0]))
                                    && slots.first[0] === 'Full' && currentTime < 10) && <div className="slot-full">-</div>}
                            {(!(selectedSlot.includes('8-10') && selectedSlot.includes(slots.dates[0]))
                                    && (slots.first[0] === '3 slots' || slots.first[0] === '4 slots')  && currentTime < 10) 
                                && <div className="slot-empty">-</div>}
                            {(!(selectedSlot.includes('8-10') && selectedSlot.includes(slots.dates[0]))
                                    && (slots.first[0] === '2 slots' || slots.first[0] === 'Last slot available') && currentTime < 10) 
                                && <div className='slot-half'>
                                    <img className='stripes' src={stripes} alt="" /></div>}
                            {((selectedSlot.includes('8-10') && selectedSlot.includes(slots.dates[0])) && !(currentTime >= 10)) && 
                                <div className="slot-booked">-</div> }
                        </th>
                        {slots.first.slice(1).map((element, index) => 
                            <th key={index} className={index === 5 ? 'entry-last' :'time-select-entry'} 
                                onClick={() => selectSlot(index + 1, '8-10')}>
                                {(!(selectedSlot.includes('8-10') && selectedSlot.includes(slots.dates[index + 1]))
                                    && element === 'Full') && <div className="slot-full">-</div>}
                                {(!(selectedSlot.includes('8-10') && selectedSlot.includes(slots.dates[index + 1]))
                                    && (element === '3 slots' || element === '4 slots')) && <div className="slot-empty">-</div>}
                                {(!(selectedSlot.includes('8-10') && selectedSlot.includes(slots.dates[index + 1]))
                                    && (element === '2 slots' || element === 'Last slot available')) && <div className='slot-half'>
                                    <img className='stripes' src={stripes} alt="" /></div>}
                                {(selectedSlot.includes('8-10') && selectedSlot.includes(slots.dates[index + 1])) && 
                                    <div className="slot-booked">-</div> }
                            </th>
                        )}
                    </tr>
                    {/* 10-12 */}
                    <tr>
                        <th className='time-select-clock'><span className='time-select-value'>12:00</span></th>
                        <th className='time-select-entry' onClick={() => selectSlot(0, '10-12')}>
                            {currentTime >= 12 && <div className="slot-disabled">passed</div> }
                            {(!(selectedSlot.includes('10-12') && selectedSlot.includes(slots.dates[0]))
                                    && slots.second[0] === 'Full' && currentTime < 12) && <div className="slot-full">-</div>}
                            {(!(selectedSlot.includes('10-12') && selectedSlot.includes(slots.dates[0]))
                                    && (slots.second[0] === '3 slots' || slots.second[0] === '4 slots')  && currentTime < 12) 
                                && <div className="slot-empty">-</div>}
                            {(!(selectedSlot.includes('10-12') && selectedSlot.includes(slots.dates[0]))
                                    && (slots.second[0] === '2 slots' || slots.second[0] === 'Last slot available') && currentTime < 12) 
                                && <div className='slot-half'>
                                    <img className='stripes' src={stripes} alt="" /></div>}
                            {((selectedSlot.includes('10-12') && selectedSlot.includes(slots.dates[0])) && !(currentTime >= 12)) && 
                                <div className="slot-booked">-</div> }
                        </th>
                        {slots.second.slice(1).map((element, index) => 
                            <th key={index} className={index === 5 ? 'entry-last' :'time-select-entry'} 
                                onClick={() => selectSlot(index + 1, '10-12')}>
                                {(!(selectedSlot.includes('10-12') && selectedSlot.includes(slots.dates[index + 1]))
                                    && element === 'Full') && <div className="slot-full">-</div>}
                                {(!(selectedSlot.includes('10-12') && selectedSlot.includes(slots.dates[index + 1]))
                                    && (element === '3 slots' || element === '4 slots')) && <div className="slot-empty">-</div>}
                                {(!(selectedSlot.includes('10-12') && selectedSlot.includes(slots.dates[index + 1]))
                                    && (element === '2 slots' || element === 'Last slot available')) && <div className='slot-half'>
                                    <img className='stripes' src={stripes} alt="" /></div>}
                                {(selectedSlot.includes('10-12') && selectedSlot.includes(slots.dates[index + 1])) && 
                                    <div className="slot-booked">-</div> }
                            </th>
                        )}
                    </tr>
                    {/* 12-14 */}
                    <tr>
                        <th className='time-select-clock'><span className='time-select-value'>14:00</span></th>
                        <th className='time-select-entry' onClick={() => selectSlot(0, '12-14')}>
                            {currentTime >= 14 && <div className="slot-disabled">passed</div> }
                            {(!(selectedSlot.includes('12-14') && selectedSlot.includes(slots.dates[0]))
                                    && slots.third[0] === 'Full' && currentTime < 14) && <div className="slot-full">-</div>}
                            {(!(selectedSlot.includes('12-14') && selectedSlot.includes(slots.dates[0]))
                                    && (slots.third[0] === '3 slots' || slots.third[0] === '4 slots')  && currentTime < 14) 
                                && <div className="slot-empty">-</div>}
                            {(!(selectedSlot.includes('12-14') && selectedSlot.includes(slots.dates[0]))
                                    && (slots.third[0] === '2 slots' || slots.third[0] === 'Last slot available') && currentTime < 14) 
                                && <div className='slot-half'>
                                    <img className='stripes' src={stripes} alt="" /></div>}
                            {((selectedSlot.includes('12-14') && selectedSlot.includes(slots.dates[0])) && !(currentTime >= 14)) && 
                                <div className="slot-booked">-</div> }
                        </th>
                        {slots.third.slice(1).map((element, index) => 
                            <th key={index} className={index === 5 ? 'entry-last' :'time-select-entry'} 
                                onClick={() => selectSlot(index + 1, '12-14')}>
                                {(!(selectedSlot.includes('12-14') && selectedSlot.includes(slots.dates[index + 1]))
                                    && element === 'Full') && <div className="slot-full">-</div>}
                                {(!(selectedSlot.includes('12-14') && selectedSlot.includes(slots.dates[index + 1]))
                                    && (element === '3 slots' || element === '4 slots')) && <div className="slot-empty">-</div>}
                                {(!(selectedSlot.includes('12-14') && selectedSlot.includes(slots.dates[index + 1]))
                                    && (element === '2 slots' || element === 'Last slot available')) && <div className='slot-half'>
                                    <img className='stripes' src={stripes} alt="" /></div>}
                                {(selectedSlot.includes('12-14') && selectedSlot.includes(slots.dates[index + 1])) && 
                                    <div className="slot-booked">-</div> }
                            </th>
                        )}
                    </tr>
                    {/* 14-16 */}
                    <tr>
                        <th className='time-select-clock'><span className='time-select-value'>16:00</span></th>
                        <th className='time-select-entry' onClick={() => selectSlot(0, '14-16')}>
                            {currentTime >= 16 && <div className="slot-disabled">passed</div> }
                            {(!(selectedSlot.includes('14-16') && selectedSlot.includes(slots.dates[0]))
                                    && slots.fourth[0] === 'Full' && currentTime < 16) && <div className="slot-full">-</div>}
                            {(!(selectedSlot.includes('14-16') && selectedSlot.includes(slots.dates[0]))
                                    && (slots.fourth[0] === '3 slots' || slots.fourth[0] === '4 slots')  && currentTime < 16) 
                                && <div className="slot-empty">-</div>}
                            {(!(selectedSlot.includes('14-16') && selectedSlot.includes(slots.dates[0]))
                                    && (slots.fourth[0] === '2 slots' || slots.fourth[0] === 'Last slot available') && currentTime < 16) 
                                && <div className='slot-half'>
                                    <img className='stripes' src={stripes} alt="" /></div>}
                            {((selectedSlot.includes('14-16') && selectedSlot.includes(slots.dates[0])) && !(currentTime >= 16)) && 
                                <div className="slot-booked">-</div> }
                        </th>
                        {slots.fourth.slice(1).map((element, index) => 
                            <th key={index} className={index === 5 ? 'entry-last' :'time-select-entry'} 
                                onClick={() => selectSlot(index + 1, '14-16')}>
                                {(!(selectedSlot.includes('14-16') && selectedSlot.includes(slots.dates[index + 1]))
                                    && element === 'Full') && <div className="slot-full">-</div>}
                                {(!(selectedSlot.includes('14-16') && selectedSlot.includes(slots.dates[index + 1]))
                                    && (element === '3 slots' || element === '4 slots')) && <div className="slot-empty">-</div>}
                                {(!(selectedSlot.includes('14-16') && selectedSlot.includes(slots.dates[index + 1]))
                                    && (element === '2 slots' || element === 'Last slot available')) && <div className='slot-half'>
                                    <img className='stripes' src={stripes} alt="" /></div>}
                                {(selectedSlot.includes('14-16') && selectedSlot.includes(slots.dates[index + 1])) && 
                                    <div className="slot-booked">-</div> }
                            </th>
                        )}
                    </tr>
                    {/* 16-18 */}
                    <tr>
                        <th className='time-select-clock'><span className='time-select-value'>18:00</span></th>
                        <th className='time-select-entry' onClick={() => selectSlot(0, '16-18')}>
                            {currentTime >= 18 && <div className="slot-disabled">passed</div> }
                            {(!(selectedSlot.includes('16-18') && selectedSlot.includes(slots.dates[0]))
                                    && slots.fifth[0] === 'Full' && currentTime < 18) && <div className="slot-full">-</div>}
                            {(!(selectedSlot.includes('16-18') && selectedSlot.includes(slots.dates[0]))
                                    && (slots.fifth[0] === '3 slots' || slots.fifth[0] === '4 slots')  && currentTime < 18) 
                                && <div className="slot-empty">-</div>}
                            {(!(selectedSlot.includes('16-18') && selectedSlot.includes(slots.dates[0]))
                                    && (slots.fifth[0] === '2 slots' || slots.fifth[0] === 'Last slot available') && currentTime < 18) 
                                && <div className='slot-half'>
                                    <img className='stripes' src={stripes} alt="" /></div>}
                            {((selectedSlot.includes('16-18') && selectedSlot.includes(slots.dates[0])) && !(currentTime >= 18)) && 
                                <div className="slot-booked">-</div> }
                        </th>
                        {slots.fifth.slice(1).map((element, index) => 
                            <th key={index} className={index === 5 ? 'entry-last' :'time-select-entry'} 
                                onClick={() => selectSlot(index + 1, '16-18')}>
                                {(!(selectedSlot.includes('16-18') && selectedSlot.includes(slots.dates[index + 1]))
                                    && element === 'Full') && <div className="slot-full">-</div>}
                                {(!(selectedSlot.includes('16-18') && selectedSlot.includes(slots.dates[index + 1]))
                                    && (element === '3 slots' || element === '4 slots')) && <div className="slot-empty">-</div>}
                                {(!(selectedSlot.includes('16-18') && selectedSlot.includes(slots.dates[index + 1]))
                                    && (element === '2 slots' || element === 'Last slot available')) && <div className='slot-half'>
                                    <img className='stripes' src={stripes} alt="" /></div>}
                                {(selectedSlot.includes('16-18') && selectedSlot.includes(slots.dates[index + 1])) && 
                                    <div className="slot-booked">-</div> }
                            </th>
                        )}
                    </tr>
                    {/* 18-20 */}
                    <tr>
                        <th className='time-select-clock'><span className='time-select-value'>20:00</span></th>
                        <th className='time-select-entry' onClick={() => selectSlot(0, '18-20')}>
                            {currentTime >= 20 && <div className="slot-disabled">passed</div> }
                            {(!(selectedSlot.includes('18-20') && selectedSlot.includes(slots.dates[0]))
                                    && slots.sixth[0] === 'Full' && currentTime < 20) && <div className="slot-full">-</div>}
                            {(!(selectedSlot.includes('18-20') && selectedSlot.includes(slots.dates[0]))
                                    && (slots.sixth[0] === '3 slots' || slots.sixth[0] === '4 slots')  && currentTime < 20) 
                                && <div className="slot-empty">-</div>}
                            {(!(selectedSlot.includes('18-20') && selectedSlot.includes(slots.dates[0]))
                                    && (slots.sixth[0] === '2 slots' || slots.sixth[0] === 'Last slot available') && currentTime < 20) 
                                && <div className='slot-half'>
                                    <img className='stripes' src={stripes} alt="" /></div>}
                            {((selectedSlot.includes('18-20') && selectedSlot.includes(slots.dates[0])) && !(currentTime >= 20)) && 
                                <div className="slot-booked">-</div> }
                        </th>
                        {slots.sixth.slice(1).map((element, index) => 
                            <th key={index} className={index === 5 ? 'entry-last' :'time-select-entry'} 
                                onClick={() => selectSlot(index + 1, '18-20')}>
                                {(!(selectedSlot.includes('18-20') && selectedSlot.includes(slots.dates[index + 1]))
                                    && element === 'Full') && <div className="slot-full">-</div>}
                                {(!(selectedSlot.includes('18-20') && selectedSlot.includes(slots.dates[index + 1]))
                                    && (element === '3 slots' || element === '4 slots')) && <div className="slot-empty">-</div>}
                                {(!(selectedSlot.includes('18-20') && selectedSlot.includes(slots.dates[index + 1]))
                                    && (element === '2 slots' || element === 'Last slot available')) && <div className='slot-half'>
                                    <img className='stripes' src={stripes} alt="" /></div>}
                                {(selectedSlot.includes('18-20') && selectedSlot.includes(slots.dates[index + 1])) && 
                                    <div className="slot-booked">-</div> }
                            </th>
                        )}
                    </tr>
                    {/* 20-22 */}
                    <tr>
                        <th className='time-select-clock'><span className='time-select-value'>22:00</span></th>
                        <th className='time-select-entry' onClick={() => selectSlot(0, '20-22')}>
                            {currentTime >= 22 && <div className="slot-disabled">passed</div> }
                            {(!(selectedSlot.includes('20-22') && selectedSlot.includes(slots.dates[0]))
                                    && slots.sixth[0] === 'Full' && currentTime < 22) && <div className="slot-full">-</div>}
                            {(!(selectedSlot.includes('20-22') && selectedSlot.includes(slots.dates[0]))
                                    && (slots.sixth[0] === '3 slots' || slots.sixth[0] === '4 slots')  && currentTime < 22) 
                                && <div className="slot-empty">-</div>}
                            {(!(selectedSlot.includes('20-22') && selectedSlot.includes(slots.dates[0]))
                                    && (slots.sixth[0] === '2 slots' || slots.sixth[0] === 'Last slot available') && currentTime < 22) 
                                && <div className='slot-half'>
                                    <img className='stripes' src={stripes} alt="" /></div>}
                            {((selectedSlot.includes('20-22') && selectedSlot.includes(slots.dates[0])) && !(currentTime >= 22)) && 
                                <div className="slot-booked">-</div> }
                        </th>
                        {slots.sixth.slice(1).map((element, index) => 
                            <th key={index} className={index === 5 ? 'entry-last' :'time-select-entry'} 
                                onClick={() => selectSlot(index + 1, '20-22')}>
                                {(!(selectedSlot.includes('20-22') && selectedSlot.includes(slots.dates[index + 1]))
                                    && element === 'Full') && <div className="slot-full">-</div>}
                                {(!(selectedSlot.includes('20-22') && selectedSlot.includes(slots.dates[index + 1]))
                                    && (element === '3 slots' || element === '4 slots')) && <div className="slot-empty">-</div>}
                                {(!(selectedSlot.includes('20-22') && selectedSlot.includes(slots.dates[index + 1]))
                                    && (element === '2 slots' || element === 'Last slot available')) && <div className='slot-half'>
                                    <img className='stripes' src={stripes} alt="" /></div>}
                                {(selectedSlot.includes('20-22') && selectedSlot.includes(slots.dates[index + 1])) && 
                                    <div className="slot-booked">-</div> }
                            </th>
                        )}
                    </tr>
                </table>}
                {/* mobile version */}
                {isMobile && <table>
                    {/* display dates */}
                    <tr>
                        <th className='time-select-clock'><span className='time-select-value-first'>08:00</span></th>
                        <th className='date-entry'>
                            <span className='time-select-dates'>{slots.dates[0]}</span>
                            <div className='time-select-today'>Today</div>
                        </th>
                        {slots.dates.slice(1, 3).map((element, index) => 
                            <th key={index} className={index === 1 ? 'date-last' : 'date-entry'}>
                                <span className='time-select-dates'>{element}</span>
                                <div className='time-select-today-invisible'>Today</div>
                            </th>
                        )}
                    </tr>
                    {/* display three time slots */}
                    {/* 8-10 */}
                    <tr>
                        <th className='time-select-clock'><span className='time-select-value'>10:00</span></th>
                        <th className='time-select-entry' onClick={() => selectSlot(0, '8-10')}>
                            {currentTime >= 10 && <div className="slot-disabled">passed</div> }
                            {(!(selectedSlot.includes('8-10') && selectedSlot.includes(slots.dates[0]))
                                    && slots.first[0] === 'Full' && currentTime < 10) && <div className="slot-full">-</div>}
                            {(!(selectedSlot.includes('8-10') && selectedSlot.includes(slots.dates[0]))
                                    && (slots.first[0] === '3 slots' || slots.first[0] === '4 slots')  && currentTime < 10) 
                                && <div className="slot-empty">-</div>}
                            {(!(selectedSlot.includes('8-10') && selectedSlot.includes(slots.dates[0]))
                                    && (slots.first[0] === '2 slots' || slots.first[0] === 'Last slot available') && currentTime < 10) 
                                && <div className='slot-half'>
                                    <img className='stripes' src={stripes} alt="" /></div>}
                            {((selectedSlot.includes('8-10') && selectedSlot.includes(slots.dates[0])) && !(currentTime >= 10)) && 
                                <div className="slot-booked">-</div> }
                        </th>
                        {slots.first.slice(1, 3).map((element, index) => 
                            <th key={index} className={index === 1 ? 'entry-last' :'time-select-entry'} 
                                onClick={() => selectSlot(index + 1, '8-10')}>
                                {(!(selectedSlot.includes('8-10') && selectedSlot.includes(slots.dates[index + 1]))
                                    && element === 'Full') && <div className="slot-full">-</div>}
                                {(!(selectedSlot.includes('8-10') && selectedSlot.includes(slots.dates[index + 1]))
                                    && (element === '3 slots' || element === '4 slots')) && <div className="slot-empty">-</div>}
                                {(!(selectedSlot.includes('8-10') && selectedSlot.includes(slots.dates[index + 1]))
                                    && (element === '2 slots' || element === 'Last slot available')) && <div className='slot-half'>
                                    <img className='stripes' src={stripes} alt="" /></div>}
                                {(selectedSlot.includes('8-10') && selectedSlot.includes(slots.dates[index + 1])) && 
                                    <div className="slot-booked">-</div> }
                            </th>
                        )}
                    </tr>
                    {/* 10-12 */}
                    <tr>
                        <th className='time-select-clock'><span className='time-select-value'>12:00</span></th>
                        <th className='time-select-entry' onClick={() => selectSlot(0, '10-12')}>
                            {currentTime >= 12 && <div className="slot-disabled">passed</div> }
                            {(!(selectedSlot.includes('10-12') && selectedSlot.includes(slots.dates[0]))
                                    && slots.second[0] === 'Full' && currentTime < 12) && <div className="slot-full">-</div>}
                            {(!(selectedSlot.includes('10-12') && selectedSlot.includes(slots.dates[0]))
                                    && (slots.second[0] === '3 slots' || slots.second[0] === '4 slots')  && currentTime < 12) 
                                && <div className="slot-empty">-</div>}
                            {(!(selectedSlot.includes('10-12') && selectedSlot.includes(slots.dates[0]))
                                    && (slots.second[0] === '2 slots' || slots.second[0] === 'Last slot available') && currentTime < 12) 
                                && <div className='slot-half'>
                                    <img className='stripes' src={stripes} alt="" /></div>}
                            {((selectedSlot.includes('10-12') && selectedSlot.includes(slots.dates[0])) && !(currentTime >= 12)) && 
                                <div className="slot-booked">-</div> }
                        </th>
                        {slots.second.slice(1,3).map((element, index) => 
                            <th key={index} className={index === 1 ? 'entry-last' :'time-select-entry'} 
                                onClick={() => selectSlot(index + 1, '10-12')}>
                                {(!(selectedSlot.includes('10-12') && selectedSlot.includes(slots.dates[index + 1]))
                                    && element === 'Full') && <div className="slot-full">-</div>}
                                {(!(selectedSlot.includes('10-12') && selectedSlot.includes(slots.dates[index + 1]))
                                    && (element === '3 slots' || element === '4 slots')) && <div className="slot-empty">-</div>}
                                {(!(selectedSlot.includes('10-12') && selectedSlot.includes(slots.dates[index + 1]))
                                    && (element === '2 slots' || element === 'Last slot available')) && <div className='slot-half'>
                                    <img className='stripes' src={stripes} alt="" /></div>}
                                {(selectedSlot.includes('10-12') && selectedSlot.includes(slots.dates[index + 1])) && 
                                    <div className="slot-booked">-</div> }
                            </th>
                        )}
                    </tr>
                    {/* 12-14 */}
                    <tr>
                        <th className='time-select-clock'><span className='time-select-value'>14:00</span></th>
                        <th className='time-select-entry' onClick={() => selectSlot(0, '12-14')}>
                            {currentTime >= 14 && <div className="slot-disabled">passed</div> }
                            {(!(selectedSlot.includes('12-14') && selectedSlot.includes(slots.dates[0]))
                                    && slots.third[0] === 'Full' && currentTime < 14) && <div className="slot-full">-</div>}
                            {(!(selectedSlot.includes('12-14') && selectedSlot.includes(slots.dates[0]))
                                    && (slots.third[0] === '3 slots' || slots.third[0] === '4 slots')  && currentTime < 14) 
                                && <div className="slot-empty">-</div>}
                            {(!(selectedSlot.includes('12-14') && selectedSlot.includes(slots.dates[0]))
                                    && (slots.third[0] === '2 slots' || slots.third[0] === 'Last slot available') && currentTime < 14) 
                                && <div className='slot-half'>
                                    <img className='stripes' src={stripes} alt="" /></div>}
                            {((selectedSlot.includes('12-14') && selectedSlot.includes(slots.dates[0])) && !(currentTime >= 14)) && 
                                <div className="slot-booked">-</div> }
                        </th>
                        {slots.third.slice(1,3).map((element, index) => 
                            <th key={index} className={index === 1 ? 'entry-last' :'time-select-entry'} 
                                onClick={() => selectSlot(index + 1, '12-14')}>
                                {(!(selectedSlot.includes('12-14') && selectedSlot.includes(slots.dates[index + 1]))
                                    && element === 'Full') && <div className="slot-full">-</div>}
                                {(!(selectedSlot.includes('12-14') && selectedSlot.includes(slots.dates[index + 1]))
                                    && (element === '3 slots' || element === '4 slots')) && <div className="slot-empty">-</div>}
                                {(!(selectedSlot.includes('12-14') && selectedSlot.includes(slots.dates[index + 1]))
                                    && (element === '2 slots' || element === 'Last slot available')) && <div className='slot-half'>
                                    <img className='stripes' src={stripes} alt="" /></div>}
                                {(selectedSlot.includes('12-14') && selectedSlot.includes(slots.dates[index + 1])) && 
                                    <div className="slot-booked">-</div> }
                            </th>
                        )}
                    </tr>
                    {/* 14-16 */}
                    <tr>
                        <th className='time-select-clock'><span className='time-select-value'>16:00</span></th>
                        <th className='time-select-entry' onClick={() => selectSlot(0, '14-16')}>
                            {currentTime >= 16 && <div className="slot-disabled">passed</div> }
                            {(!(selectedSlot.includes('14-16') && selectedSlot.includes(slots.dates[0]))
                                    && slots.fourth[0] === 'Full' && currentTime < 16) && <div className="slot-full">-</div>}
                            {(!(selectedSlot.includes('14-16') && selectedSlot.includes(slots.dates[0]))
                                    && (slots.fourth[0] === '3 slots' || slots.fourth[0] === '4 slots')  && currentTime < 16) 
                                && <div className="slot-empty">-</div>}
                            {(!(selectedSlot.includes('14-16') && selectedSlot.includes(slots.dates[0]))
                                    && (slots.fourth[0] === '2 slots' || slots.fourth[0] === 'Last slot available') && currentTime < 16) 
                                && <div className='slot-half'>
                                    <img className='stripes' src={stripes} alt="" /></div>}
                            {((selectedSlot.includes('14-16') && selectedSlot.includes(slots.dates[0])) && !(currentTime >= 16)) && 
                                <div className="slot-booked">-</div> }
                        </th>
                        {slots.fourth.slice(1,3).map((element, index) => 
                            <th key={index} className={index === 1 ? 'entry-last' :'time-select-entry'} 
                                onClick={() => selectSlot(index + 1, '14-16')}>
                                {(!(selectedSlot.includes('14-16') && selectedSlot.includes(slots.dates[index + 1]))
                                    && element === 'Full') && <div className="slot-full">-</div>}
                                {(!(selectedSlot.includes('14-16') && selectedSlot.includes(slots.dates[index + 1]))
                                    && (element === '3 slots' || element === '4 slots')) && <div className="slot-empty">-</div>}
                                {(!(selectedSlot.includes('14-16') && selectedSlot.includes(slots.dates[index + 1]))
                                    && (element === '2 slots' || element === 'Last slot available')) && <div className='slot-half'>
                                    <img className='stripes' src={stripes} alt="" /></div>}
                                {(selectedSlot.includes('14-16') && selectedSlot.includes(slots.dates[index + 1])) && 
                                    <div className="slot-booked">-</div> }
                            </th>
                        )}
                    </tr>
                    {/* 16-18 */}
                    <tr>
                        <th className='time-select-clock'><span className='time-select-value'>18:00</span></th>
                        <th className='time-select-entry' onClick={() => selectSlot(0, '16-18')}>
                            {currentTime >= 18 && <div className="slot-disabled">passed</div> }
                            {(!(selectedSlot.includes('16-18') && selectedSlot.includes(slots.dates[0]))
                                    && slots.fifth[0] === 'Full' && currentTime < 18) && <div className="slot-full">-</div>}
                            {(!(selectedSlot.includes('16-18') && selectedSlot.includes(slots.dates[0]))
                                    && (slots.fifth[0] === '3 slots' || slots.fifth[0] === '4 slots')  && currentTime < 18) 
                                && <div className="slot-empty">-</div>}
                            {(!(selectedSlot.includes('16-18') && selectedSlot.includes(slots.dates[0]))
                                    && (slots.fifth[0] === '2 slots' || slots.fifth[0] === 'Last slot available') && currentTime < 18) 
                                && <div className='slot-half'>
                                    <img className='stripes' src={stripes} alt="" /></div>}
                            {((selectedSlot.includes('16-18') && selectedSlot.includes(slots.dates[0])) && !(currentTime >= 18)) && 
                                <div className="slot-booked">-</div> }
                        </th>
                        {slots.fifth.slice(1,3).map((element, index) => 
                            <th key={index} className={index === 1 ? 'entry-last' :'time-select-entry'} 
                                onClick={() => selectSlot(index + 1, '16-18')}>
                                {(!(selectedSlot.includes('16-18') && selectedSlot.includes(slots.dates[index + 1]))
                                    && element === 'Full') && <div className="slot-full">-</div>}
                                {(!(selectedSlot.includes('16-18') && selectedSlot.includes(slots.dates[index + 1]))
                                    && (element === '3 slots' || element === '4 slots')) && <div className="slot-empty">-</div>}
                                {(!(selectedSlot.includes('16-18') && selectedSlot.includes(slots.dates[index + 1]))
                                    && (element === '2 slots' || element === 'Last slot available')) && <div className='slot-half'>
                                    <img className='stripes' src={stripes} alt="" /></div>}
                                {(selectedSlot.includes('16-18') && selectedSlot.includes(slots.dates[index + 1])) && 
                                    <div className="slot-booked">-</div> }
                            </th>
                        )}
                    </tr>
                    {/* 18-20 */}
                    <tr>
                        <th className='time-select-clock'><span className='time-select-value'>20:00</span></th>
                        <th className='time-select-entry' onClick={() => selectSlot(0, '18-20')}>
                            {currentTime >= 20 && <div className="slot-disabled">passed</div> }
                            {(!(selectedSlot.includes('18-20') && selectedSlot.includes(slots.dates[0]))
                                    && slots.sixth[0] === 'Full' && currentTime < 20) && <div className="slot-full">-</div>}
                            {(!(selectedSlot.includes('18-20') && selectedSlot.includes(slots.dates[0]))
                                    && (slots.sixth[0] === '3 slots' || slots.sixth[0] === '4 slots')  && currentTime < 20) 
                                && <div className="slot-empty">-</div>}
                            {(!(selectedSlot.includes('18-20') && selectedSlot.includes(slots.dates[0]))
                                    && (slots.sixth[0] === '2 slots' || slots.sixth[0] === 'Last slot available') && currentTime < 20) 
                                && <div className='slot-half'>
                                    <img className='stripes' src={stripes} alt="" /></div>}
                            {((selectedSlot.includes('18-20') && selectedSlot.includes(slots.dates[0])) && !(currentTime >= 20)) && 
                                <div className="slot-booked">-</div> }
                        </th>
                        {slots.sixth.slice(1,3).map((element, index) => 
                            <th key={index} className={index === 1 ? 'entry-last' :'time-select-entry'} 
                                onClick={() => selectSlot(index + 1, '18-20')}>
                                {(!(selectedSlot.includes('18-20') && selectedSlot.includes(slots.dates[index + 1]))
                                    && element === 'Full') && <div className="slot-full">-</div>}
                                {(!(selectedSlot.includes('18-20') && selectedSlot.includes(slots.dates[index + 1]))
                                    && (element === '3 slots' || element === '4 slots')) && <div className="slot-empty">-</div>}
                                {(!(selectedSlot.includes('18-20') && selectedSlot.includes(slots.dates[index + 1]))
                                    && (element === '2 slots' || element === 'Last slot available')) && <div className='slot-half'>
                                    <img className='stripes' src={stripes} alt="" /></div>}
                                {(selectedSlot.includes('18-20') && selectedSlot.includes(slots.dates[index + 1])) && 
                                    <div className="slot-booked">-</div> }
                            </th>
                        )}
                    </tr>
                    {/* 20-22 */}
                    <tr>
                        <th className='time-select-clock'><span className='time-select-value'>22:00</span></th>
                        <th className='time-select-entry' onClick={() => selectSlot(0, '20-22')}>
                            {currentTime >= 22 && <div className="slot-disabled">passed</div> }
                            {(!(selectedSlot.includes('20-22') && selectedSlot.includes(slots.dates[0]))
                                    && slots.sixth[0] === 'Full' && currentTime < 22) && <div className="slot-full">-</div>}
                            {(!(selectedSlot.includes('20-22') && selectedSlot.includes(slots.dates[0]))
                                    && (slots.sixth[0] === '3 slots' || slots.sixth[0] === '4 slots')  && currentTime < 22) 
                                && <div className="slot-empty">-</div>}
                            {(!(selectedSlot.includes('20-22') && selectedSlot.includes(slots.dates[0]))
                                    && (slots.sixth[0] === '2 slots' || slots.sixth[0] === 'Last slot available') && currentTime < 22) 
                                && <div className='slot-half'>
                                    <img className='stripes' src={stripes} alt="" /></div>}
                            {((selectedSlot.includes('20-22') && selectedSlot.includes(slots.dates[0])) && !(currentTime >= 22)) && 
                                <div className="slot-booked">-</div> }
                        </th>
                        {slots.sixth.slice(1,3).map((element, index) => 
                            <th key={index} className={index === 1 ? 'entry-last' :'time-select-entry'} 
                                onClick={() => selectSlot(index + 1, '20-22')}>
                                {(!(selectedSlot.includes('20-22') && selectedSlot.includes(slots.dates[index + 1]))
                                    && element === 'Full') && <div className="slot-full">-</div>}
                                {(!(selectedSlot.includes('20-22') && selectedSlot.includes(slots.dates[index + 1]))
                                    && (element === '3 slots' || element === '4 slots')) && <div className="slot-empty">-</div>}
                                {(!(selectedSlot.includes('20-22') && selectedSlot.includes(slots.dates[index + 1]))
                                    && (element === '2 slots' || element === 'Last slot available')) && <div className='slot-half'>
                                    <img className='stripes' src={stripes} alt="" /></div>}
                                {(selectedSlot.includes('20-22') && selectedSlot.includes(slots.dates[index + 1])) && 
                                    <div className="slot-booked">-</div> }
                            </th>
                        )}
                    </tr>
                </table>}
                <div className="legend-container">
                    <div className="legend-icon past">-</div>
                    <span className="legend-text">Timeslot passed</span>
                    <div className="legend-icon full">-</div>
                    <span className="legend-text">Fully booked</span>
                    <img className='legend-icon' src={stripes} alt="" />
                    <span className="legend-text">Half booked</span>
                    <div className="legend-icon free">-</div>
                    <span className="legend-text">Free</span>
                    {isEdit && 
                        <div className='confirm-btn-container'>
                            <button 
                                id='pay-book-confirm'
                                className={isPayBook ? 'confirm-btn' : 'confirm-btn-disable'}
                                onClick={() => timeSelectToParent()}
                                >Confirm</button>
                        </div>
                    }
                </div>
                <div className='time-select-empty'> </div>
            </div>
        </div>
    )
}