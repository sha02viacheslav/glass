// import timeData from './data/emptyTSDummy.json';
import axios from "axios";
import { useEffect, useState } from "react";
const monthValuesRev = {"0":"Jan","1":"Feb","2":"Mar","3":"Apr","4":"May","5":"June","6":"July","7":"Aug","8":"Sept","9":"Oct","10":"Nov","11":"Dec"};
const monthValues = {"Jan":"01","Feb":"02","Mar":"03","Apr":"04","May":"05","June":"06","July":"07","Aug":"08","Sept":"09","Oct":"10","Nov":"11","Dec":"12"};

export default function CreateTimetable({timetableToClient}) {

    const currentDate = new Date();
    // getDate -> 1-31
    // getMonth -> 0-11
    // const [timetable, setTimetable] = useState([]);
    // const [bookings, setBookings] = useState([]);
    // const [futureDate, setFutureDate] = useState([]);
    const year = currentDate.getFullYear().toString();
    const month = monthValuesRev[currentDate.getMonth().toString()];
    const monthNum = monthValues[month];
    let day = currentDate.getDate().toString();

    function createTimetable() {
        // inititalize with today's entry
        if (day.length === 1) {
            const newValue = "0" + day;
            day = newValue;
        }
        let newTimetable = [
            [month, day, Math.floor(Math.random()*3), Math.floor(Math.random()*3), Math.floor(Math.random()*3), Math.floor(Math.random()*3), Math.floor(Math.random()*3), Math.floor(Math.random()*3), Math.floor(Math.random()*3)]
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
            newTimetable.push([nextMonth, nextDay, Math.floor(Math.random()*3), Math.floor(Math.random()*3), Math.floor(Math.random()*3), Math.floor(Math.random()*3), Math.floor(Math.random()*3), Math.floor(Math.random()*3), Math.floor(Math.random()*3)]);
            nextDate = [nextYear, nextMonth, nextDay];
        }
        // setFutureDate(nextDate);
        retrieveBookings(nextDate, newTimetable);
    }

    function retrieveBookings(nextDate, timetable) {
        // get past bookings
        const today = year.concat('-', monthNum).concat('-', day);
        let data = JSON.stringify({
            "jsonrpc": "2.0",
            "params": {
                "start_date": today,
                "end_date": nextDate[0].concat('-', monthValues[nextDate[1]]).concat('-', nextDate[2]),
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
            // console.log(JSON.stringify(response.data.result.data));
            // setBookings(response.data.result.data);
            fillTimeslots(timetable, response.data.result.data);
        })
        .catch(function (error) {
            console.log(error);
        })
    }

    function fillTimeslots(times, bookingData) {
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
        for (let i = 0; i < times.length; i++) {
            let row = times[i];
            for (let j = 0; j < bookings.length; j++) {
                const booking = bookings[j];
                const bookingMonth = booking[1];
                const bookingDay = booking[2];
                const bookingTime = Number(booking[3]);
                if (monthValues[row[0]] === bookingMonth) {
                    if (row[1] === bookingDay) {
                        // find what time the booking is and mark 
                        if (bookingTime <= 10) { 
                            row[2] += 1;
                        } 
                        if (bookingTime > 10 && bookingTime <= 12) { 
                            row[3] += 1;
                        } 
                        if (bookingTime > 12 && bookingTime <= 14) { 
                            row[4] += 1;
                        } 
                        if (bookingTime > 14 && bookingTime <= 16) {
                            row[5] += 1;
                        } 
                        if (bookingTime > 16 && bookingTime <= 18) {
                            row[6] += 1;
                        } 
                        if (bookingTime > 18 && bookingTime <= 20) {
                            row[7] += 1;
                        } 
                        if (bookingTime > 20) {
                            row[8] += 1;
                        } 
                    }
                } 
            }         
        }
        // set timeslot status based on number of slots filled: 0 -> empty, 1-2 -> half, 3+ -> full
        for (let i = 0; i < times.length; i++) {
            let row = times[i];  
            for (let j = 2; j < row.length; j++) {
                const element = row[j];
                if (element === 0) {
                    row[j] = 'Empty';
                } else if (element === 1 || element == 2) {
                    row[j] = 'Half';
                } else if (element >= 3) {
                    row[j] = 'Full';
                }
            }          
        }
        // console.log(times); 
        // setTimetable(times);
        timetableToClient(times);
    }

    useEffect(() => {
        createTimetable();
    }, []);  

    return (
        <div>

        </div>
    )
}
