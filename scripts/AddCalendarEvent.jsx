import * as React from 'react';
import DatePicker from 'react-datepicker';
import Socket from './Socket';
import 'react-datepicker/dist/react-datepicker.css';

export default function AddCalendarEvent(params) {
  const [date, setStartDate] = React.useState(new Date());
  const [input, setInput] = React.useState('');
  const { email } = params;
  function setDate(d) {
    setStartDate((dt) => dt = d);
  }

  function sendCalendarEvent(e) {
    e.preventDefault();
    // console.log(input);
    const d = date.toISOString();
    Socket.emit('addCalendarEvent', {
      date: d,
      title: input,
      email,
    });
    document.getElementById("calendarEventTitle").value="";
    setStartDate(new Date());

  }

  function newInp(curr) {
    setInput(curr.target.value);
  }
  return (
    <form>
      <div className="input-group">
        <div className="input-group-prepend">
          <span className="input-group-text" id="basic-addon1">Title</span>
        </div>
        <input
          type="text"
          className="form-control"
          id="calendarEventTitle"
          name="calendarEventTitle"
          onInput={newInp}
        />
        <div className="input-group-prepend">
          <span className="input-group-text" id="basic-addon2">Date</span>
        </div>
        <DatePicker
        selected={date}
        onSelect={setDate} // when day is clicked
        onChange={setDate} // only when value has changed
        timeIntervals="1"
        showTimeSelect
        />
        <button className="btn btn-primary" type="submit" onClick={sendCalendarEvent}>
          Submit
        </button>
      </div>
    </form>
  );
}
