// import timeData from './data/emptyTSDummy.json';
import { useEffect, useState } from "react";

const monthValuesRev = {"0":"Jan","1":"Feb","2":"Mar","3":"Apr","4":"May","5":"June","6":"July","7":"Aug","8":"Sept","9":"Oct","10":"Nov","11":"Dec"};

export default function CreateTimetable() {

    const currentDate = new Date();
    // getDate -> 1-31
    // getMonth -> 0-11
    const [timetable, setTimetable] = useState([]);

    function createTimetable() {
        let newTimetable = [];
        // set correct dates for following 21 days from current date
        for (let i = 1; i < 21; i++) {
            let tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + i);  
            const day = tomorrow.getDate();
            const month = monthValuesRev[tomorrow.getMonth().toString()];
            
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
