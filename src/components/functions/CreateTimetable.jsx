// import timeData from './data/emptyTSDummy.json';
import axios from "axios";
import { useEffect, useState } from "react";

const monthValuesRev = {"0":"Jan","1":"Feb","2":"Mar","3":"Apr","4":"May","5":"June","6":"July","7":"Aug","8":"Sept","9":"Oct","10":"Nov","11":"Dec"};

export default function CreateTimetable() {

    const currentDate = new Date();
    // getDate -> 1-31
    // getMonth -> 0-11
    const [timetable, setTimetable] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [futureDate, setFutureDate] = useState([]);
    const year = currentDate.getFullYear().toString();
    const month = monthValuesRev[currentDate.getMonth().toString()];
    let day = currentDate.getDate().toString();

    function createTimetable() {
        // inititalize with today's entry
        if (day.length === 1) {
            const newValue = "0" + day;
            day = newValue;
        }
        let newTimetable = [
            [month, day, 8, 10, 12, 14, 16, 18, 20]
        ];
        let nextDate = [];
        // set correct dates for following 21 days from current date
        for (let i = 1; i < 21; i++) {
            let tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + i); 
            let nextDay = '';
            nextDay = tomorrow.getDate().toString();
            // add 0 to front of single digit numbers
            if (nextDay.length === 1) {
                const newValue = "0" + nextDay;
                nextDay = newValue;
            }
            const nextMonth = monthValuesRev[tomorrow.getMonth().toString()];
            const nextYear = tomorrow.getFullYear().toString();
            newTimetable.push([nextMonth, nextDay, 8, 10, 12, 14, 16, 18, 20]);
            nextDate = [nextYear, nextMonth, nextDay];
        }
        setTimetable(newTimetable);
        setFutureDate(nextDate);
        retrieveBookings(nextDate, newTimetable);
    }

    function retrieveBookings(nextDate, timetable) {
        // get past bookings
        const today = year.concat('-', month).concat('-', day);
        let data = JSON.stringify({
            "jsonrpc": "2.0",
            "params": {
                "start_date": today,
                "end_date": nextDate[0].concat('-', nextDate[1]).concat('-', nextDate[2]),
                "limit": "all",
                "offset": 0
            }
        });
        let config = {
            method: 'post',
            url: 'https://fixglass-staging-2-7305738.dev.odoo.com/api/v1/react/order/get_calendar',
            headers: {
                'Content-Type': 'application/json',
                'api-key': 'e2aa3aea-baaf-4d45-aed5-44be3fc34e83'
            },
            data: data
        };
        axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data.result.data));
            setBookings(response.data.result.data);
            fillTimeslots(timetable, response.data.result.data);
        })
        .catch(function (error) {
            console.log(error);
        })
    }

    function fillTimeslots(timetable, bookingData) {
        // format bookings data into usable form
        let bookings = [];
        for (let i = 0; i < bookingData.length; i++) {
            const booking = bookingData[i].booking_start_date;
            const bookingYear = booking.slice(0, 4);
            const bookingMonth = booking.slice(5, 7);
            const bookingDay = booking.slice(8, 10);
            const bookingStart = booking.slice(11, 13);
            bookings.push([bookingYear, bookingMonth, bookingDay, bookingStart]);
        }
        // 0: "2023" 1: "03" 2: "02" 3: "11"
        // find indexes of booked slots
        for (let i = 0; i < timetable.length; i++) {
            const row = timetable[i];
            for (let j = 0; j < bookings.length; j++) {
                const booking = bookings[j];
                let bookingMonth = '';
                if (row[0] === bookingMonth) {

                }
            }
            for (let element = 0; element < row.length; element++) {
                if (Number.isInteger(element)) {
                    // avoid month and day entries in each row
                    
                }
            }            
        }
    }

    useEffect(() => {
        createTimetable();
    }, []);

    return (
        <div>

        </div>
    )
}
