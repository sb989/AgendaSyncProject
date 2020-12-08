import * as React from 'react';
import DatePicker from 'react-datepicker';
import Socket from './Socket';
import 'react-datepicker/dist/react-datepicker.css';

export default function AddToDoList(params) {
  const [input, setInput] = React.useState('');
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  const [disableEndDate, setDisableEndDate] = React.useState(false);
  const { email } = params;

  function sendToDoList(e) {
    e.preventDefault();
    console.log(input);
    var endless = disableEndDate;
    Socket.emit('addToDoList', {
      email,
      description: input,
      startDate,
      endDate,
      endless,
    });
    document.getElementById("todoitem").value="";
    setStartDate(new Date());
    setEndDate(new Date());    
  }

  function newInp(curr) {
    setInput(curr.target.value);
  }

  function checkboxToggle(data)
  {
    var check = data.target.checked;
    var endDate = document.getElementById("todoEnd");
    setDisableEndDate(check);
    // if(check)
    // {
    //   endDate.className = "make-background-grey";
    // }

  }

  return (
    <form>
      <div className="container-fluid">
        <div className="row mb-2">
          <div className="input-group-prepend col-2 col-sm-3 col-md-3 col-lg-3 col-xl-1 mr-md-3 mr-xl-5 mb-2 mb-md-0 mb-lg-0">
            <span className="input-group-text" id="basic-addon1">ToDo</span>
          </div>
          <textarea
          type="text"
          id="todoitem"
          name="todoitem"
          onInput={newInp}
          className="form-control col-10 col-sm-9 col-md-8 ml-3 ml-md-0 ml-lg-0"
          maxlength="255"
          />
        </div>
        <div className="row mb-2">
          <div className="input-group-prepend col-2 col-sm-3 col-md-3 col-lg-1 mr-xl-5 mb-2 mb-md-0 mb-lg-0">
            <span className="input-group-text" id="basic-addon2">Start Date</span>
          </div>
          
          <DatePicker
            selected={startDate}
            onSelect={(d) => setStartDate(d)} // when day is clicked
            onChange={(d) => setStartDate(d)} // only when value has changed
            timeIntervals="10"
            showTimeSelect
            className="btn btn-light col-10 ml-3 ml-md-0 ml-lg-0"
          />
          
        </div>
        <div className="row mb-2">
          <div className="input-group-prepend col-12 mr-xl-5 mb-2 mb-md-0 mb-lg-0">
              <input type="checkbox" aria-label="endless" onChange={checkboxToggle}/>
              <small className="ml-2" > No End Date </small>
          </div>
        </div>
        <div className="row mb-2">
          <div className="input-group-prepend col-2 col-sm-3 col-md-3 col-lg-1 mr-xl-5 mb-2 mb-md-0 mb-lg-0">
            <span className="input-group-text" id="basic-addon3">End Date</span>
          </div>
          <DatePicker
            selected={endDate}
            onSelect={(d) => setEndDate(d)} // when day is clicked
            onChange={(d) => setEndDate(d)} // only when value has changed
            timeIntervals="10"
            showTimeSelect
            disabled={disableEndDate}
            className="btn btn-light col-10 ml-3 ml-md-0 ml-lg-0"
            id="todoEnd"
          />      
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
