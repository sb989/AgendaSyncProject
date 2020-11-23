import * as React from 'react';
import Calendar from 'react-calendar';
import Socket from './Socket';
export default function UserCalendar(params) {
  const { userURL } = params;
  const [value, onChange] = React.useState(new Date());
  const [calendarEvent,setCalendarEvent] = React.useState({});
  const [currentMonth,setCurrentMonth] = React.useState('');
  const { DateTime } = require("luxon");
  function selectEventsForTile(data)
  {
    var date = data["date"];
    var returnString = "";
    //console.log(date);
    var month = date.getMonth();
    var day = date.getDate();
    if (calendarEvent[month] == undefined || calendarEvent[month][day] == undefined)
      return returnString;
    var eventsForDay = calendarEvent[month][day];
    console.log(day);
    console.log(eventsForDay);
    var event;
    for (event of eventsForDay)
    {
      var start = event["start"];
      var end = event["end"];
      var summary = event["summary"];
      start = DateTime.fromISO(start);
      end = DateTime.fromISO(end);
      var startTime = start.toLocaleString(DateTime.TIME_SIMPLE);
      var endTime = end.toLocaleString(DateTime.TIME_SIMPLE);
      var duration = startTime + "-" + endTime;
      returnString += duration + ": "+summary;
    }
    return returnString;
  }

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
    },[]);
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
    },[]);
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
  addCalendarMonth();
  deleteCalendarMonth();
  return (
  //<iframe title="calendar" src={userURL} style={{ border: '0' }} width="800" height="600" frameBorder="0" scrolling="no" />
  <div>
    <Calendar
      onChange={onChange}
      value={value}
      tileContent={selectEventsForTile}
      minDetail="month"
      onActiveStartDateChange={changeMonth}
    />
  </div>
  );
}