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
      <div className="container">
        <div className="row mb-2">
          <div className="input-group-prepend col-2 col-sm-3 col-md-3 col-lg-2 mr-3 mr-md-4 mr-lg-5 mr-xl-3 mb-2 mb-md-0 mb-lg-0">
            <span className="input-group-text" id="basic-addon1">Description</span>
          </div>
          <input
          type="text"
          id="todoitem"
          name="todoitem"
          onInput={newInp}
          className="form-control col ml-3 ml-md-0 ml-lg-0"
          />
        </div>
        <div className="row mb-2">
          <div className="input-group-prepend col-2 col-sm-3 col-md-3 col-lg-2 mr-3 mr-md-4 mr-lg-5 mr-xl-3 mb-2 mb-md-0 mb-lg-0">
            <span className="input-group-text" id="basic-addon2">Start Date</span>
          </div>
          <div className="ml-3 ml-md-0 ml-lg-0">
            <DatePicker
            selected={startDate}
            onSelect={(d) => setStartDate(d)} // when day is clicked
            onChange={(d) => setStartDate(d)} // only when value has changed
            timeIntervals="1"
            showTimeSelect
            />
          </div>
        </div>
        <div className="row mb-2">
          <div className="input-group-prepend col-2 col-sm-3 col-md-3 col-lg-2 mr-3 mr-md-4 mr-lg-5 mr-xl-3 mb-2 mb-md-0 mb-lg-0">
            <span className="input-group-text" id="basic-addon3">End Date</span>
          </div>
          <div className="ml-3 ml-md-0 ml-lg-0">
            <DatePicker
            selected={endDate}
            onSelect={(d) => setEndDate(d)} // when day is clicked
            onChange={(d) => setEndDate(d)} // only when value has changed
            timeIntervals="1"
            showTimeSelect
            />
          </div>
          
        </div>
        <div className="row">
          <button className="btn btn-primary ml-3" type="submit" onClick={sendToDoList}>
            Submit
          </button>
        </div>
        
      </div>
    </form>
  );
}
