import * as React from 'react';
import DatePicker from 'react-datepicker';
import Socket from './Socket';
import 'react-datepicker/dist/react-datepicker.css';

export default function AddToDoList(params) {
  const [input, setInput] = React.useState('');
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  const { email } = params;

  function sendToDoList(e) {
    e.preventDefault();
    console.log(input);
    Socket.emit('addToDoList', {
      email,
      description: input,
      startDate,
      endDate,
    });
    document.getElementById("todoitem").value="";
    setStartDate(new Date());
    setEndDate(new Date());
  }

  function newInp(curr) {
    setInput(curr.target.value);
  }

  return (
    <form>
      Description
      <input
        type="text"
        id="todoitem"
        name="todoitem"
        onInput={newInp}
      />
      <br />
      Start Date
      <DatePicker
        selected={startDate}
        onSelect={(d) => setStartDate(d)} // when day is clicked
        onChange={(d) => setStartDate(d)} // only when value has changed
        timeIntervals="1"
        showTimeSelect
      />
      <br />
      End Date
      <DatePicker
        selected={endDate}
        onSelect={(d) => setEndDate(d)} // when day is clicked
        onChange={(d) => setEndDate(d)} // only when value has changed
        timeIntervals="1"
        showTimeSelect
      />
      <br />
      <button type="submit" onClick={sendToDoList}>
        Submit
      </button>
    </form>
  );
}
