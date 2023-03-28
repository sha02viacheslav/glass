import '../../css/time-select-new.css'
import React, { useEffect, useState } from 'react'
import { Button, Menu, TextField } from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker'
import moment from 'moment'
import { useCreateTimetable } from '@glass/hooks/useCreateTimetable'
import arrowIcon from '../icons/down-arrow.png'
import stripes from '../icons/stripes_s.png'

const timeHeaders = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']
const passedSlots = [10, 12, 14, 16, 18, 20, 22]
const fullMonthValues = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export type TimeSelectionNewProps = {
  timeSlotToParent: (value: string) => void
  liveBooking: boolean
  slot: string
}

export const TimeSelectionNew: React.FC<TimeSelectionNewProps> = ({ timeSlotToParent, liveBooking, slot }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedSlot, setSelectedSlot] = useState('')
  const [slotChanged, setSlotChanged] = useState(false)
  const [timeData, setTimeData] = useState<string[][]>([])
  const [slots, setSlots] = useState<string[][]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pages, setPages] = useState<number[]>([])
  const [pastIds, setPastIds] = useState<string[]>([])
  const today = selectedDate.getDate()
  const currentMonth = fullMonthValues[selectedDate.getMonth()]
  // const today = 9; // dummy data version
  const currentHour = new Date().getHours()
  const currentYear = new Date().getFullYear()
  const [isMobile, setIsMobile] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  useCreateTimetable(getTimeData)

  function handleMenuClick(event: React.MouseEvent<HTMLButtonElement>) {
    setMenuOpen(!menuOpen)
    setAnchorEl(event.currentTarget)
  }

  function handleMenuClose(newDate: Date) {
    setMenuOpen(false)
    setAnchorEl(null)
    setSelectedDate(newDate)
  }

  function getTimeData(data: string[][]) {
    setTimeData(data)
  }

  // function to select a given time slot
  const selectSlot = (monthSelected: string, daySelected: string, timeSelected: number) => {
    const currentSelection = document.getElementById(selectedSlot)
    const idTag = monthSelected.concat(daySelected).concat(timeSelected.toString())
    const newSelection = document.getElementById(idTag)
    if (currentSelection != null) {
      // remove active classname from previously selected timeslot
      currentSelection.classList.remove('ts-td-active')
    }
    // if statement to avoid errors
    if (newSelection != null) {
      // check if timeslot has passed
      const timeCheck = passedSlots[Number(timeSelected)] - currentHour
      if (timeCheck <= 0 && slots[0].includes(daySelected)) {
        return
      }
      newSelection.classList.add('ts-td-active')
    }
    // save the data
    let odooDay = daySelected
    if (odooDay.length === 1) {
      odooDay = '0' + odooDay
    }
    // for sending slot info to odoo, slot starting time
    const odooSlot = moment(`${monthSelected} ${odooDay}, ${currentYear} ${8 + timeSelected * 2}:00:00`).format(
      'YYYY-MM-DD hh:mm:ss',
    )
    setSelectedSlot(idTag)
    setSlotChanged(true)
    if (!liveBooking) {
      // send data to parent page to enable next btn
      timeSlotToParent(odooSlot)
    }
  }

  // function only runs in live booking tab
  function confirmSelection() {
    // save the slot selection and push to past slots
    sessionStorage.setItem('selectedSlot', JSON.stringify(selectedSlot))
    const pastSlots: string[] = JSON.parse(sessionStorage.getItem('pastSlots') || '[]')
    pastSlots.push(selectedSlot)
    sessionStorage.setItem('pastSlots', JSON.stringify(pastSlots))
    // send data to parent page to enable next btn
    timeSlotToParent(selectedSlot)
  }

  const changePage = (navValue: string) => {
    if (navValue === 'next' && pages.includes(currentPage + 1)) {
      setCurrentPage(currentPage + 1)
    } else if (navValue === 'prev' && pages.includes(currentPage - 1)) {
      setCurrentPage(currentPage - 1)
    }
  }

  // navigating calendar pages and disable passed slots
  useEffect(() => {
    if (isMobile) {
      setSlots(timeData.slice(3 * currentPage - 3, 3 * currentPage))
    } else {
      setSlots(timeData.slice(7 * currentPage - 7, 7 * currentPage))
    }
  }, [currentPage, timeData])

  useEffect(() => {
    // decipher odoo data into usable timeslot id
    // odoo:"2023-01-12 12:00:00"
    // id:"Jan122"
    let selectionId = ''
    if (slot != '') {
      const dateTime = slot.split(' ')
      const dateSplit = dateTime[0].split('-')
      const timeSplit = dateTime[1].substring(0, 5)
      const timeIndex = timeHeaders.indexOf(timeSplit)
      const timeCheck = Number(dateTime[1].substring(0, 2))
      if (timeCheck - currentHour > 0 || Number(dateSplit[2]) !== today) {
        // only set prev selected slot if it has not passed
        selectionId = moment(dateTime[0]).format('MMMDD').concat(timeIndex.toString())
        setSelectedSlot(selectionId)
        timeSlotToParent(selectionId)
      }
    }
    // find which slots have passed
    const past: string[] = []
    if (timeData.length > 0) {
      for (let i = 0; i < timeData[0].slice(2).length; i++) {
        const idTag = timeData[0][0].concat(timeData[0][1]).concat(i.toString())
        const timeCheck = passedSlots[i] - currentHour
        if (timeCheck <= 0) {
          past.push(idTag)
        }
      }
    }
    setPastIds(past)
    // determine if table is viewed in mobile view and set cols in display accordingly
    const pageCount = []
    if (window.innerWidth <= 800) {
      setIsMobile(true)
      setSlots(timeData.slice(0, 3))
      // determine the total number of pages possible to display
      for (let i = 0; i < timeData.length / 3; i++) {
        pageCount.push(i + 1)
      }
    } else {
      setSlots(timeData.slice(0, 7))
      for (let i = 0; i < timeData.length / 7; i++) {
        pageCount.push(i + 1)
      }
    }
    setPages([...new Set(pageCount)])
  }, [timeData])

  return (
    <div>
      <div className='time-select-main'>
        <h1>Set date and time</h1>
        <div className='date-pick-container'>
          {/* <span className='time-select-month'>December</span> */}
          <Button
            id='basic-button'
            sx={{
              width: 'fit-content',
              height: 40,
              color: '#484848',
              fontSize: 23,
              textTransform: 'none',
              mb: 3,
              '&:hover': { backgroundColor: '#9a73dd1c' },
            }}
            aria-controls={menuOpen ? 'basic-menu' : undefined}
            aria-haspopup='true'
            aria-expanded={menuOpen ? 'true' : undefined}
            onClick={handleMenuClick}
          >
            <span className='time-select-month'>{currentMonth}</span>
            <img className='date-picker-icon' src={arrowIcon} alt='' />
          </Button>
          <div className='date-nav-container'>
            <button className='date-nav-btn' onClick={() => changePage('prev')}>
              <img className='nav-right' src={arrowIcon} alt='' />
            </button>
            <button className='date-nav-btn' onClick={() => changePage('next')}>
              <img className='nav-left' src={arrowIcon} alt='' />
            </button>
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
                if (newValue) handleMenuClose(newValue)
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Menu>
        {timeData.length > 0 && (
          <table className='ts-table' id='calendar'>
            {/* map time headers on left side */}
            <tbody>
              <tr>
                {timeHeaders.map((element) => (
                  <td key={element}>
                    <div className='ts-time'>{element}</div>
                  </td>
                ))}
              </tr>
              {/* map slots and dates */}
              {slots.map((element, index) => (
                <tr key={index}>
                  {/* first row maps dates */}
                  <td className='ts-date-container'>
                    <div className='ts-date-month'>{element[0]}</div>
                    <div className={Number(element[1]) != today ? 'ts-date-day' : 'ts-date-today'}>{element[1]}</div>
                  </td>
                  {/* subsequent rows map timeslots */}
                  {element.slice(2).map((occupy, time) => (
                    <td
                      id={element[0] + element[1] + time.toString()}
                      onClick={() => selectSlot(element[0], element[1], time)}
                      key={time}
                      className={
                        element[0] + element[1] + time.toString() === selectedSlot
                          ? 'ts-' + occupy + ' ts-td-active'
                          : 'ts-' + occupy
                      }
                    >
                      {pastIds.includes(element[0] + element[1] + time.toString()) ? (
                        <div className='ts-passed'>Aaaaa</div>
                      ) : occupy != 'Half' ? (
                        occupy
                      ) : (
                        <img src={stripes} alt='' />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className='ts-legend-container'>
          <div className='ts-legend-icon ts-past'>-</div>
          <span className='ts-legend-text'>Timeslot passed</span>
          <div className='ts-legend-icon ts-full'>-</div>
          <span className='ts-legend-text'>Fully booked</span>
          <img className='ts-legend-icon' src={stripes} alt='' />
          <span className='ts-legend-text'>Half booked</span>
          <div className='ts-legend-icon ts-free'>-</div>
          <span className='ts-legend-text'>Free</span>
          {liveBooking && (
            <div className='ts-confirm-btn-container'>
              <button
                id='pay-book-confirm'
                className={slotChanged ? 'ts-confirm-btn' : 'ts-confirm-btn-disable'}
                onClick={confirmSelection}
              >
                Confirm
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TimeSelectionNew
