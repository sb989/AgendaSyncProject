import * as React from 'react';

import Socket from './Socket';

export default function ToDoList(params) {
  const [todos, setTodos] = React.useState([]);
  const [startDates, setstartDates] = React.useState([]);
  const [endDates, setEndDates] = React.useState([]);
  const index = 0;
  const { email } = params;
  const { DateTime } = require("luxon");
  const isImageUrl = require('is-image-url');
  const maxDate = DateTime.fromISO("9999-12-31T23:59:59.999999");
  function sendMessage() {
    React.useEffect(() => {
      Socket.emit('send todo', {
        email,
      });
    }, []);
  }

  function getNewAddresses() {
    React.useEffect(() => {
      Socket.on('sending todo info', (data) => {
        setTodos(data.todos);
      });
    });
  }

  function PutMessage(props) {
    var todo = props.todo;
    var start =todo["start_todo"];
    start = DateTime.fromISO(start);
    var now = new Date();
    if (start>now)
    {
      console.log("too soon to show");
    }
    var splitMessage = todo["todo"].split(" ");
    var message;
    var images = [];
    var i =0;
    var len = splitMessage.length;
    for (;i<len;i++)
    {
      message=splitMessage[i];
      if(isImageUrl(message))
      {
        splitMessage[i] = React.createElement(
          "img",
          {
            "src":message,
            "alt":message,
            "className":"todopicture mt-2"
          },
        );
      }
      else if(i < len-1)
      {
        if(i>0 && typeof(splitMessage[i-1] == "object"))
        {
          splitMessage[i]=" "+message+" ";
        }
        else
        {
          splitMessage[i]= message+" ";
        }
        
      }
    }
    console.log(splitMessage);
    return (
      <div className="row mb-3 ">
        <div className="col-1"></div>
        <div className="col-8">
          {todoFormat(splitMessage,todo)}
        </div>
        <div className="col-2 d-flex align-items-center">
          <button className="btn btn-success" type="button" id={props.index} onClick={()=>deleteMessage(props.index)}>
            <span className="oi oi-check" title="check" aria-hidden="true"></span>
          </button>
        </div> 
      </div>
    );
  }

  function todoFormat(message, todo)
  {
    var due_date = todo["due_date"];
    due_date = DateTime.fromISO(due_date);
    var className = "";
    if(due_date.equals(maxDate))
    {
      due_date = <p className="mb-1"><span className="font-weight-bold">No Due Date</span></p>;
      className = "container border border-danger rounded pt-1"
    }
    else
    {
      due_date = <p className="mb-1"><span className="font-weight-bold">Due Date: </span> {due_date.toLocaleString(DateTime.DATETIME_MED)}</p>;
      className = "container border border-primary rounded pt-1"
    }

    return (
      <div className={className}>
        <div className="todo_description row mt-1 px-3 ">
        {
          message
        }
        </div>
        <div className="row px-3">
          {due_date}
        </div>
      </div>
    );
  }

  
  function deleteMessage(index)
  {
    var todosCopy = [...todos];
    var id = todos[index]["id"]
    todosCopy.splice(index,1);
    setTodos(todosCopy);
    Socket.emit("deleteTodo",{
      "id":id,
      "email":email
    });
  }

  sendMessage();
  getNewAddresses();

  return (
    <div className="">
      <h1 className="text-logocolor">
        ToDoList
      </h1>
      <div className="col-0 col-md-10 container">
          {
            todos.map((todo,index) => (
              <PutMessage todo={todo} index={index} />
            ))
          }
      </div>

      
      {/* <div className="col-0 col-md-2">
        <img alt="Wall-EBot" className="robot" src="https://cdn.dribbble.com/users/37530/screenshots/2937858/drib_blink_bot.gif" />
      </div> */}
    </div>
    

  );
}
