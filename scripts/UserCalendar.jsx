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
    //console.log(date);
    var month = date.getMonth();
    var day = date.getDate();
    if (currentMonth == '')
    {
      setCurrentMonth(data["activeStartDate"]);
    }
    if (calendarEvent[month] == undefined || calendarEvent[month][day] == undefined)
      return returnString;
    var eventsForDay = calendarEvent[month][day];
    // console.log(day);
    // console.log(eventsForDay);
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
        console.log(49,calendarEvent);
        var month = parseInt(data["addMonth"],10);
        var events = data["addEvents"][month];
        var deleteMonth = data["deleteMonth"];
        console.log(typeof(month));
        console.log(calendarEvent[month]);
        if(calendarEvent[month] != undefined)
        {
          console.log("dont update!");
          return;
        }
          
        console.log("add");
        let tempCalEvent = JSON.parse(JSON.stringify(calendarEvent));
        tempCalEvent[month] = events;
        delete tempCalEvent[deleteMonth];
        setCalendarEvent(tempCalEvent);
        console.log(data);
      });
      return () => {
        Socket.removeEventListener('updateMonth');
      };
    },[calendarEvent]);
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
    var change = false;
    var events;
    React.useEffect(()=>{
      Socket.on("calendarInfo",(data)=>{
        events = data["events"];
        change = true;
        setCalendarEvent(events);  
        //console.log(events);      
      },[]);
      
    });
  }
  //console.log("105",calendarEvent);
  receiveCalendar();
  updateCalendarMonth();
  if(calendarEvent !="")
    console.log("113",calendarEvent);

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