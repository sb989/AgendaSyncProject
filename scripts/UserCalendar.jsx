import * as React from 'react';
import Calendar from 'react-calendar';
import Socket from './Socket';
export default function UserCalendar(params) {
  const { userURL } = params;
  const [value, onChange] = React.useState(new Date());
  const [calendarEvent,setCalendarEvent] = React.useState({});
  const [currentMonth,setCurrentMonth] = React.useState('');
  
  function addCalendarMonth()
  {
    React.useEffect(()=>{
      Socket.on('addMonth',(data)=>{
        var month = data["month"];
        var events = data["events"];
        setCalendarEvent(ce=>{
          ce[month] = events;
          });
      });
    });
  }
  
  function deleteCalendarMonth()
  {
    React.useEffect(()=>{
      Socket.on('deleteMonth',(data)=>{
        var month = data["month"];
        setCalendarEvent(ce=>{
          ce.delete(month);
          });
      });
    });
  }
  
  function changeMonth(data)
  {
    var month = data["activeStartDate"].toISOString();
    console.log(month);
    setCurrentMonth(month);
    Socket.emit("currentMonth",{
      "month":month
    });
  }

  function receiveCalendar()
  {
    React.useEffect(()=>{
      Socket.on("calendarInfo",(data)=>{
        var events = data["events"];
        setCalendarEvent(events);
        
        console.log(events);
      },[]);
    });
  }
 
  receiveCalendar();
  return (
  //<iframe title="calendar" src={userURL} style={{ border: '0' }} width="800" height="600" frameBorder="0" scrolling="no" />
  <div>
    <Calendar
      onChange={onChange}
      value={value}
      tileContent="apple"
      minDetail="month"
      onActiveStartDateChange={changeMonth}
    />
  </div>
  );
}