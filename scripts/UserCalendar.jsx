import * as React from 'react';
import Calendar from 'react-calendar';
import Socket from './Socket';
export default function UserCalendar(params) {
  const [value, onChange] = React.useState(new Date());
  const [calendarEvent,setCalendarEvent] = React.useState("");
  const [currentMonth,setCurrentMonth] = React.useState('');
  const { DateTime } = require("luxon");
  const { email } = params;

  function selectEventsForTile(data)
  {
    var date = data["date"];
    var returnString = "";
    var month = date.getMonth();
    var day = date.getDate();
    if (currentMonth == '')
    {
      setCurrentMonth(data["activeStartDate"]);
    }
    if (calendarEvent[month] == undefined || calendarEvent[month][day] == undefined)
      return returnString;
    var eventsForDay = calendarEvent[month][day];
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

  function updateCalendarMonth()
  {
    React.useEffect(()=>{
      Socket.on('updateMonth',(data)=>{
        if(calendarEvent == "")
          return;
        var month = parseInt(data["addMonth"],10);
        var events = data["addEvents"][month];
        var deleteMonth = data["deleteMonth"];
        if(calendarEvent[month] != undefined)
        {
          // console.log("dont update!");
          return;
        }
          
        console.log("add");
        let tempCalEvent = JSON.parse(JSON.stringify(calendarEvent));
        tempCalEvent[month] = events;
        delete tempCalEvent[deleteMonth];
        setCalendarEvent(tempCalEvent);
      });
      return () => {
        Socket.removeEventListener('updateMonth');
      };
    },[calendarEvent]);
  }
  
  function updateAllLoadedMonths()
  {
    var events;
    React.useEffect(()=>{
      Socket.on('updateAllMonths',(data)=>{
        events = data["events"];
        console.log(events);
        setCalendarEvent(events); 
      });
      return () => {
        Socket.removeEventListener('updateAllMonths');
      };
    });
  }
  
  function changeMonth(data)
  {
    var prevMonth = currentMonth.toISOString();
    var month = data["activeStartDate"];
    console.log("changemonth");
    var monthAsString = month.toISOString();
  
    Socket.emit("currentMonth",{
      "currMonth":monthAsString,
      "prevMonth":prevMonth,
      "email":email
    });
    setCurrentMonth(month);
  }

  function receiveCalendar()
  {
    var events;
    React.useEffect(()=>{
      Socket.on("calendarInfo",(data)=>{
        events = data["events"];
        console.log(events)
        setCalendarEvent(events);  
      },[]);
      
    });
  }
  receiveCalendar();
  updateCalendarMonth();
  updateAllLoadedMonths();
  return (
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