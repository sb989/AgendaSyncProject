import * as React from 'react';
import Calendar from 'react-calendar';
import { v4 as uuidv4 } from 'uuid';
import EditCalendarEvent from './EditCalendarEvent';
import Socket from './Socket';


export default function UserCalendar(params) {
  const [value, setValue] = React.useState(new Date());
  const [calendarEvent,setCalendarEvent] = React.useState("");
  const [currentMonth,setCurrentMonth] = React.useState('');
  const { DateTime } = require("luxon");
  const { email } = params;
  const [popUpContents,setpopUpContents] = React.useState("");
  const [modalTitle,setModalTitle] = React.useState("");
  
  function selectEventsForTile(data)//parses calendar info to display on calendar gui
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
    var events = [];
    for (event of eventsForDay)
    {
      var start = event["start"];
      var end = event["end"];
      var summary = event["summary"];
      start = DateTime.fromISO(start);
      end = DateTime.fromISO(end);
      var startTime = start.toLocaleString(DateTime.TIME_SIMPLE);
      var endTime = end.toLocaleString(DateTime.TIME_SIMPLE);
      var abbreventInfo = startTime + ": "+summary.slice(0,20)
      var key = uuidv4();
      var element = React.createElement("span",{"className":"event","key":key},abbreventInfo);

      events.push(element);
    }
    return events;
  }

  function updateCalendarMonth()//receives calendar info for a new month and learns what month to delete
  {
    React.useEffect(()=>{
      Socket.on('updateMonth',(data)=>{
        if(calendarEvent == "")
          return;
        console.log("data",data);
        var month = parseInt(data["addMonth"],10);
        var events = data["addEvents"][month];
        var deleteMonth = data["deleteMonth"];
        if(calendarEvent[month] != undefined)
        {
          // console.log("dont update!");
          return;
        }
          
        console.log("add");
        console.log(calendarEvent);
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
  
  function updateAllLoadedMonths()//receives info to update all months currently loaded
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
        "email":email,
        "padding":2
    });
    setCurrentMonth(month);
  }

  function receiveCalendar()
  {
    var events;
    React.useEffect(()=>{
      let mounted = true;
      Socket.on("calendarInfo",(data)=>{
        events = data["events"];
        console.log(events)
        if(mounted)
        {
          setCalendarEvent(events);
        }
      },[]);
      return () => mounted = false;
    });
  }

  function askForInitialCalendarInfo()
  {
    var month = new Date();
    var padding = 2;
    var startMonth = new Date(month.getFullYear(),month.getMonth()-padding,1,0,0,0,0);//
    var endMonth = new Date(startMonth.getFullYear(), month.getMonth() + padding +1, 0,23,59,59,999); 
    startMonth = startMonth.toISOString();
    endMonth = endMonth.toISOString();
    console.log("email",email);

    React.useEffect(()=>{
      console.log("email",email);
      Socket.emit('allMonths',
        {
          email,
          startMonth,
          endMonth,
        });
    },[]);
  }
  
  function onClick(date)
  {
    setValue(date);
    var month = date.getMonth();
    var day = date.getDate();
    var eventsForDay = calendarEvent[month][day];
    console.log(eventsForDay);
    var contents = eventsForDay.map((event)=>(
      React.createElement(PopupCalendarEvent,{"event":event},)
    ));
    setpopUpContents(contents);
    date = DateTime.fromJSDate(date);
    var title = date.toLocaleString(DateTime.DATE_HUGE);
    setModalTitle(title);
    $("#exampleModal").modal("toggle");
  }

  function PopupCalendarEvent(params)
  {
    var event = params.event;
    var summary = event["summary"];
    var start = event["start"];
    var end = event["end"];
    start = DateTime.fromISO(start);
    end = DateTime.fromISO(end);
    start = start.toLocaleString(DateTime.DATETIME_FULL);
    end = end.toLocaleString(DateTime.DATETIME_FULL);
    return (
      <div>
        <div className="row">
          <div className="col-10 container border rounded pt-1 px-4 mb-3">
            <div className="row">
              Summary: {summary}
            </div>
            <div className="row">
              Start Date: {start}
            </div>
            <div className="row">
              End Date: {end}
            </div>
          </div>
          <div className="col-2">
            <button className="btn btn-secondary" type="button" onClick={()=>editEvent(event)}>
                <span className="oi oi-pencil" title="pencil" aria-hidden="true"></span>
            </button>
          </div>
          
        </div>
      </div>
      
    );
  }

  function editEvent(event)
  {
    setModalTitle("Edit Event");
    var edit = React.createElement(EditCalendarEvent,{"event":event},);
    setpopUpContents(edit);
  }
  


  askForInitialCalendarInfo()
  receiveCalendar();
  updateCalendarMonth();
  updateAllLoadedMonths();
  return (
  <div className="container-fluid">
    <Calendar
      className="col"
      onChange={onClick}
      value={value}
      tileContent={selectEventsForTile}
      minDetail="month"
      onActiveStartDateChange={changeMonth}
    />
      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">{modalTitle}</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="container">
                {popUpContents}
              </div>
            </div>
            <div className="modal-footer">
            </div>
          </div>
        </div>
      </div>

      
  </div>
  );
}