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
    <div>
      <form>
        <input type="radio" id="todolist" name="Add" value="todolist" onChange={formPicker} />
        ToDoList
        <input type="radio" id="calendarevent" name="Add" value="calendarevent" onChange={formPicker} />
        Calendar Event
        <br />
      </form>
      {form}

    </div>
  );
}
