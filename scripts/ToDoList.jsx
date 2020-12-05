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

  function sendMessage() {
    React.useEffect(() => {
      Socket.emit('send todo', {
        email,
      });
    }, []);
  }

  function getNewAddresses() {
    // console.log('getNewAddresses');
    React.useEffect(() => {
      Socket.on('sending todo info', (data) => {
        // console.log(data);
        setTodos(data.todos);
        // setstartDates(data.start_todos);
        // setEndDates(data.due_dates);
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
            "className":"todopicture"
          },
        );
      }
      else if(i < len-1)
      {
        splitMessage[i]= message+" ";
      }
    }
    console.log(splitMessage);
    return (
      <div className="row mb-3 px-3">
        <div className="col-8">
          <div className="container border rounded">
            <div className="row">
              {
                splitMessage
              }
            </div>
            <div className="row">
              {' Due Date: '}
              {todo["due_date"]}
            </div>
          </div>
        </div>
        <div className="col-2">
          <button className="btn" type="button" id={props.index} onClick={()=>deleteMessage(props.index)}>
          <span className="oi oi-check" title="check" aria-hidden="true"></span>
          </button>
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
    <div>
      <h1>
        ToDoList
      </h1>
      <div className="container">
          {
            todos.map((todo,index) => (
              <PutMessage todo={todo} index={index} />
            ))
          }
      </div>

      <img alt="Wall-EBot" className="robot" src="https://cdn.dribbble.com/users/37530/screenshots/2937858/drib_blink_bot.gif" />
    </div>

  );
}
