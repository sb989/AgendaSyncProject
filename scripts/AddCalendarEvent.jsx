import * as React from 'react';
import Socket from './Socket';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
export default function AddCalendarEvent(params)
{
    const [date,setStartDate] = React.useState(new Date());
    const [input,setInput] = React.useState("");

    function setDate(d)
    {
       
        setStartDate(dt=>dt=d);
    }
    
    
    function sendCalendarEvent(e)
    {
        e.preventDefault();
        console.log(input);
        var d = date.toISOString();
        Socket.emit("addCalendarEvent",{
            "date":d,
            "title":input
        });
    }
    
    function newInp(curr) 
    {
        setInput(curr.target.value);
    }
    return(
        <form>
            Title
            <input 
            type="text"
            id="calendarEventTitle"
            name="calendarEventTitle"
            onInput={newInp}
            /><br/>
            Date
            <DatePicker
                selected={date}
                onSelect={setDate} //when day is clicked
                onChange={setDate} //only when value has changed
                timeIntervals="1"
                showTimeSelect
            />
            <button type="submit" onClick={sendCalendarEvent} >
                Submit
            </button>
            
        </form>
        );
}