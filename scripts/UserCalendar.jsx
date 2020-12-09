import * as React from 'react';
import Calendar from 'react-calendar';
import { v4 as uuidv4 } from 'uuid';
import EditCalendarEvent from './EditCalendarEvent';
import Socket from './Socket';

export default function UserCalendar(params) {
  const [value, setValue] = React.useState(new Date());
  const [calendarEvent, setCalendarEvent] = React.useState('');
  const [currentMonth, setCurrentMonth] = React.useState('');
  const { DateTime } = require('luxon');
  const { email } = params;
  const [popUpContents, setpopUpContents] = React.useState('');
  const [modalTitle, setModalTitle] = React.useState('');

  function selectEventsForTile(data) { // parses calendar info to display on calendar gui
    const { date } = data;
    const returnString = '';
    const month = date.getMonth();
    const day = date.getDate();
    if (currentMonth === '') {
      setCurrentMonth(data.activeStartDate);
    }
    if (calendarEvent[month] === undefined || calendarEvent[month][day] === undefined) {
      return returnString;
    }
    const eventsForDay = calendarEvent[month][day];
    let event;
    const events = [];
    // console.log(eventsForDay);
    if (eventsForDay.length === 0) return events;
    for (event of eventsForDay) {
      let { start } = event;
      let { end } = event;
      const { summary } = event;
      start = DateTime.fromISO(start);
      end = DateTime.fromISO(end);
      const startTime = start.toLocaleString(DateTime.TIME_SIMPLE);
      const endTime = end.toLocaleString(DateTime.TIME_SIMPLE);
      const abbreventInfo = `${startTime}: ${summary.slice(0, 20)}`;
      const key = uuidv4();
      const element = React.createElement('span', { className: 'event', key }, abbreventInfo);

      events.push(element);
    }
    return events;
  }

  function updateCalendarMonth() {
    // receives calendar info for a new month and learns what month to delete
    React.useEffect(() => {
      Socket.on('updateMonth', (data) => {
        if (calendarEvent === '') return;
        // console.log('data', data);
        const month = parseInt(data.addMonth, 10);
        const events = data.addEvents[month];
        const { deleteMonth } = data;
        // if(calendarEvent[month] != undefined)
        // {
        //   // console.log("dont update!");
        //   return;
        // }

        // console.log('add');
        // console.log(month);
        // console.log('delete');
        // console.log(deleteMonth);
        // console.log(calendarEvent);
        const tempCalEvent = JSON.parse(JSON.stringify(calendarEvent));
        tempCalEvent[month] = events;
        delete tempCalEvent[deleteMonth];
        setCalendarEvent(tempCalEvent);
      });
      return () => {
        Socket.removeEventListener('updateMonth');
      };
    }, [calendarEvent]);
  }

  function updateAllLoadedMonths() { // receives info to update all months currently loaded
    let events;
    React.useEffect(() => {
      Socket.on('updateAllMonths', (data) => {
        events = data.events;
        // console.log(events);
        setCalendarEvent(events);
      });
      return () => {
        Socket.removeEventListener('updateAllMonths');
      };
    });
  }

  function changeMonth(data) {
    const prevMonth = currentMonth.toISOString();
    const month = data.activeStartDate;
    // console.log('changemonth');
    const monthAsString = month.toISOString();
    Socket.emit('currentMonth', {
      currMonth: monthAsString,
      prevMonth,
      email,
      padding: 2,
    });
    setCurrentMonth(month);
  }

  function receiveCalendar() {
    let events;
    React.useEffect(() => {
      let mounted = true;
      Socket.on('calendarInfo', (data) => {
        events = data.events;
        // console.log(events);
        if (mounted) {
          setCalendarEvent(events);
        }
      }, []);
      return () => mounted = false;
    });
  }

  function askForInitialCalendarInfo() {
    const month = new Date();
    const padding = 2;
    let startMonth = new Date(
      month.getFullYear(),
      month.getMonth() - padding,
      1, 0, 0, 0, 0,
    );
    let endMonth = new Date(
      startMonth.getFullYear(),
      month.getMonth() + padding
      + 1, 0, 23, 59, 59, 999,
    );
    startMonth = startMonth.toISOString();
    endMonth = endMonth.toISOString();
    // console.log('email', email);

    React.useEffect(() => {
      // console.log('email', email);
      Socket.emit('allMonths',
        {
          email,
          startMonth,
          endMonth,
        });
    }, []);
  }

  function onClick(date) {
    setValue(date);
    const month = date.getMonth();
    const day = date.getDate();
    const eventsForDay = calendarEvent[month][day];
    const contents = eventsForDay.map((event, index) => (
      React.createElement(PopupCalendarEvent, {
        event, index, day, month,
      })
    ));
    setpopUpContents(contents);
    date = DateTime.fromJSDate(date);
    const title = date.toLocaleString(DateTime.DATE_HUGE);
    setModalTitle(title);
    $('#exampleModal').modal('toggle');
  }

  function PopupCalendarEvent(params) {
    const { event } = params;
    const { index } = params;
    const { day } = params;
    const { month } = params;
    const { summary } = event;
    let { start } = event;
    let { end } = event;
    start = DateTime.fromISO(start);
    end = DateTime.fromISO(end);
    start = start.toLocaleString(DateTime.DATETIME_FULL);
    end = end.toLocaleString(DateTime.DATETIME_FULL);
    return (
      <div>
        <div className="row">
          <div className="col-10 container border rounded pt-1 px-4 mb-3">
            <div className="row">
              Summary:
              {' '}
              {summary}
            </div>
            <div className="row">
              Start Date:
              {' '}
              {start}
            </div>
            <div className="row">
              End Date:
              {' '}
              {end}
            </div>
          </div>
          <div className="col-2">
            <button className="btn btn-secondary" type="button" onClick={() => editEvent(event, index, day, month)}>
              <span className="oi oi-pencil" title="pencil" aria-hidden="true" />
            </button>
          </div>

        </div>
      </div>

    );
  }

  function editEvent(event, index, day, month) {
    setModalTitle('Edit Event');
    const edit = React.createElement(EditCalendarEvent, {
      event,
      email,
      index,
      day,
      month,
    });
    setpopUpContents(edit);
  }

  function calendarUpdated() {
    React.useEffect(() => {
      if (calendarEvent === '') return;
      Socket.on('calendarUpdated', (data) => {
        let { start } = data;
        const { end } = data;
        const { summary } = data;
        const { index } = data;
        const { eventId } = data;
        const { month } = data;
        const { day } = data;
        start = DateTime.fromISO(start);

        const tempCalEvent = JSON.parse(JSON.stringify(calendarEvent));
        tempCalEvent[month][day].splice(index, 1);
        const event = {
          start: data.start,
          end,
          summary,
          id: eventId,
        };
        tempCalEvent[start.month - 1][start.day].push(event);
        setCalendarEvent(tempCalEvent);
      });
    }, [calendarEvent]);
  }

  askForInitialCalendarInfo();
  receiveCalendar();
  updateCalendarMonth();
  updateAllLoadedMonths();
  calendarUpdated();
  return (
  <div className="container-fluid">
    <Calendar
      className="col px-0"
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
            <div className="modal-footer" />
          </div>
        </div>
      </div>

    </div>
  );
}
