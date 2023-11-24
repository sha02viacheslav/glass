import React, { useEffect, useState } from 'react'
import { Button, Menu, TextField } from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker'
import moment from 'moment'
import arrowIcon from '@glass/assets/icons/down-arrow.png'
import stripes from '@glass/assets/icons/stripes_s.png'
import {
  BOOKING_DATE_FORMAT,
  CALENDAR_DAYS,
  CALENDAR_LENGTH,
  CALENDAR_TIME_INTERVAL,
  CALENDAR_TIME_SLOTS,
  SLOT_LABELS,
} from '@glass/constants'
import { BookingOccupy } from '@glass/enums'
import { useCreateTimetable } from '@glass/hooks/useCreateTimetable'
import './time-select-new.css'
import { TimeRow, TimeSlot } from '@glass/models'
import { formatSlotId } from '@glass/utils/format-slot-id/format-slot-id.util'

const timeHeaders = ['08:00', '12:00', '16:00', '20:00']
const passedSlots = [12, 16, 20]
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

export type TimeSelectionProps = {
  timeSlotToParent?: (value: TimeSlot) => void
  onChangeSlotId?: (value: string) => void
  liveBooking: boolean
  bookingStartDate: string | undefined
}

export const TimeSelection: React.FC<TimeSelectionProps> = ({
  timeSlotToParent,
  onChangeSlotId,
  liveBooking,
  bookingStartDate,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedSlot, setSelectedSlot] = useState('')
  const [slotChanged, setSlotChanged] = useState(false)
  const [timeData, setTimeData] = useState<TimeRow[]>([])
  const [slots, setSlots] = useState<TimeRow[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pages, setPages] = useState<number[]>([])
  const [pastIds, setPastIds] = useState<string[]>([])
  const currentMonth = fullMonthValues[selectedDate.getMonth()]
  const currentHour = new Date().getHours()
  const currentYear = new Date().getFullYear()
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

  function getTimeData(data: TimeRow[]) {
    setTimeData(data)
  }

  // function to select a given time slot
  const selectSlot = (monthSelected: string, daySelected: string, timeSelected: number, occupy: BookingOccupy) => {
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
      if (timeCheck <= 0 && moment().format('DD') == daySelected) {
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
    const startDate = moment(
      `${monthSelected} ${odooDay}, ${currentYear} ${8 + timeSelected * CALENDAR_TIME_INTERVAL}:00:00`,
    ).format(BOOKING_DATE_FORMAT)
    setSelectedSlot(idTag)
    setSlotChanged(true)
    if (!liveBooking) {
      // send data to parent page to enable next btn
      if (timeSlotToParent) {
        timeSlotToParent({
          booking_date: moment(startDate).format('YYYY-MM-DD'),
          time_slot: `${moment(startDate).format('HH')}_${moment(startDate)
            .add(CALENDAR_TIME_INTERVAL, 'hours')
            .format('HH')}`,
          isFull: occupy === BookingOccupy.FULL,
        })
      }
    }
  }

  // function only runs in live booking tab
  const confirmSelection = () => {
    // save the slot selection and push to past slots
    sessionStorage.setItem('selectedSlot', JSON.stringify(selectedSlot))
    const pastSlots: string[] = JSON.parse(sessionStorage.getItem('pastSlots') || '[]')
    pastSlots.push(selectedSlot)
    sessionStorage.setItem('pastSlots', JSON.stringify(pastSlots))
    // send data to parent page to enable next btn
    if (onChangeSlotId) onChangeSlotId(selectedSlot)
  }

  const changePage = (navValue: string) => {
    if (navValue === 'next' && pages.includes(currentPage + 1)) {
      setCurrentPage(currentPage + 1)
      setSelectedDate((prev) => moment(prev).add(3, 'days').toDate())
    } else if (navValue === 'prev' && pages.includes(currentPage - 1)) {
      setCurrentPage(currentPage - 1)
      setSelectedDate((prev) => moment(prev).subtract(3, 'days').toDate())
    }
  }

  useEffect(() => {
    setCurrentPage(Math.floor(moment(selectedDate).startOf('date').diff(moment().startOf('date'), 'days') / 3 + 1))
  }, [selectedDate])

  // navigating calendar pages and disable passed slots
  useEffect(() => {
    setSlots(timeData.slice(CALENDAR_DAYS * currentPage - CALENDAR_DAYS, CALENDAR_DAYS * currentPage))
  }, [currentPage, timeData])

  useEffect(() => {
    if (!!bookingStartDate) {
      if (moment(bookingStartDate).add(CALENDAR_TIME_INTERVAL, 'hours').isAfter(moment())) {
        // only set prev selected slot if it has not passed
        setSelectedSlot(formatSlotId(bookingStartDate))
      }
    }
    // find which slots have passed
    const past: string[] = []
    if (timeData.length > 0) {
      for (let i = 0; i < CALENDAR_TIME_SLOTS; i++) {
        const idTag = moment(timeData[0].date).format('MMMDD').concat(i.toString())
        const timeCheck = passedSlots[i] - currentHour
        if (timeCheck <= 0) {
          past.push(idTag)
        }
      }
    }
    setPastIds(past)
    // determine if table is viewed in mobile view and set cols in display accordingly
    const pageCount = []
    setSlots(timeData.slice(0, CALENDAR_DAYS))
    for (let i = 0; i < timeData.length / CALENDAR_DAYS; i++) {
      pageCount.push(i + 1)
    }
    setPages([...new Set(pageCount)])
  }, [timeData])

  return (
    <div className='bg-grey'>
      <div className='fnt-28 fnt-md-34 text-primary p-3'>Set Date And Time</div>
      <div className='time-select-main'>
        <div className='date-pick-container'>
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
              maxDate={moment()
                .add(CALENDAR_LENGTH - 1, 'days')
                .toDate()}
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
                    <div className='d-flex align-items-center justify-content-center'>
                      <div
                        className={
                          moment(element.date).format('YYYY-MM-DD') != moment().format('YYYY-MM-DD')
                            ? 'ts-date-day text-primary'
                            : 'ts-date-today text-primary'
                        }
                      >
                        {moment(element.date).format('DD')}
                      </div>
                      <div className='text-primary ms-2'>{moment(element.date).format('ddd')}</div>
                    </div>
                  </td>
                  {/* subsequent rows map timeslots */}
                  {element.schedules.map((schedule, time) => (
                    <td
                      id={moment(element.date).format('MMMDD') + time.toString()}
                      onClick={() =>
                        selectSlot(
                          moment(element.date).format('MMM'),
                          moment(element.date).format('DD'),
                          time,
                          schedule.occupy as BookingOccupy,
                        )
                      }
                      key={time}
                      className={
                        `ts-${schedule.occupy}` +
                        (moment(element.date).format('MMMDD') + time.toString() === selectedSlot
                          ? ' ts-td-active'
                          : '') +
                        (pastIds.includes(moment(element.date).format('MMMDD') + time.toString()) ? ' ts-passed' : '')
                      }
                    >
                      {SLOT_LABELS[time]}
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
          <span className='ts-legend-text'>Almost Full</span>
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
