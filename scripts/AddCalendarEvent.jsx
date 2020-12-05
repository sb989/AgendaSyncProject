import * as React from 'react';
import DatePicker from 'react-datepicker';
import Socket from './Socket';
import 'react-datepicker/dist/react-datepicker.css';

export default function AddCalendarEvent(params) {
  const [date, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());

  const [input, setInput] = React.useState('');
  const { email } = params;
  function setDate(d) {
    setStartDate((dt) => dt = d);
  }

  function sendCalendarEvent(e) {
    e.preventDefault();
    // console.log(input);
    const start = date.toISOString();
    const end = endDate.toISOString();
    Socket.emit('addCalendarEvent', {
      start,
      title: input,
      email,
      end,
    });
    document.getElementById("calendarEventTitle").value="";
    setStartDate(new Date());

  }

  function newInp(curr) {
    setInput(curr.target.value);
  }
  return (
    <form>
      <div className=" container">
        <div className="row mb-2">
          <div className="input-group-prepend col-3 col-sm-2   mr-sm-3 mr-md-5 mr-xl-4 mb-2 mb-md-0 mb-lg-0">
            <span className="input-group-text" id="basic-addon1">Title</span>
          </div>
          <input
            type="text"
            className="form-control col ml-3 ml-sm-0"
            id="calendarEventTitle"
            name="calendarEventTitle"
            onInput={newInp}
          />
        </div>
        <div className="row mb-2">
          <div className="input-group-prepend col-3 col-sm-2  mr-sm-3 mr-md-5 mr-xl-4 mb-2 mb-md-0 mb-lg-0">
            <span className="input-group-text" id="basic-addon2">Start Date</span>
          </div>
          <div className="ml-3 ml-sm-0">
            <DatePicker
            selected={date}
            onSelect={setStartDate} // when day is clicked
            onChange={setStartDate} // only when value has changed
            timeIntervals="1"
            showTimeSelect
            />
          </div>
          
        </div>
        <div className="row mb-2">
          <div className="input-group-prepend col-3 col-sm-2  mr-sm-3 mr-md-5 mr-xl-4 mb-2 mb-md-0 mb-lg-0">
            <span className="input-group-text" id="basic-addon2">Start Date</span>
          </div>
          <div className="ml-3 ml-sm-0">
            <DatePicker
            selected={endDate}
            onSelect={setEndDate} // when day is clicked
            onChange={setEndDate} // only when value has changed
            timeIntervals="1"
            showTimeSelect
            />
          </div>
          
        </div>
        <div className="row">
          <button className="btn btn-primary" type="submit" onClick={sendCalendarEvent}>
            Submit
          </button>
        </div>
      </div>
    </form>
  );
}
