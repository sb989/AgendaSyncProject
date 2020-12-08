import * as React from 'react';
import AddCalendarEvent from './AddCalendarEvent';
import AddToDoList from './AddToDoList';

export default function AddForm(params) {
  const { email } = params;
  const todoList = React.createElement(AddToDoList, { email });
  const calendarEvent = React.createElement(AddCalendarEvent, { email });
  const [form, setForm] = React.useState(todoList);
  const [test,setTest] = React.useState("");
  //   const selectedForm = todoList;


  function formPicker(e) {
    const val = e.target.value;
    if (val === 'todolist') {

      setForm(todoList);
    } else {
      setForm(calendarEvent);
    }
  }

  function setUpDefault()
  {
    var todoRadio = document.getElementById("todolist")
    console.log(todoRadio);
    if(todoRadio != undefined || todoRadio != null)
    {
      todoRadio.checked = true;
    }

  }
  React.useEffect(()=>{
    setUpDefault();
  },[])
  return (
    <div className="container-fluid">
      <h1 className="text-logocolor">Add Event</h1>
      <div className ="row">
        <div className="col-0 col-md-3"></div>
        <div className="col col-md-9">
          <form>
            <div className="btn-group btn-group-toggle" data-toggle="buttons">
              <label className="btn btn-primary ">
                <input type="radio" id="todolist" name="Add" value="todolist" onChange={formPicker} />
                ToDoList
              </label>
              <label className="btn btn-primary ">
                <input type="radio" id="calendarevent" name="Add" value="calendarevent" onChange={formPicker} />
                Calendar Event
              </label>
            </div>
          </form>
          {form}
        </div>
        <div className="col-2"></div>
      </div>
      
      

    </div>
  );
}
