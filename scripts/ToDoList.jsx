import * as React from 'react';

import Socket from './Socket';

export default function ToDoList(params) {
  const [todos, setTodos] = React.useState([]);
  const [startDates, setstartDates] = React.useState([]);
  const [endDates, setEndDates] = React.useState([]);
  const index = 0;
  const { email } = params;
  const { DateTime } = require('luxon');
  const isImageUrl = require('is-image-url');
  const maxDate = DateTime.fromISO('9999-12-31T23:59:59.999999');
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
    const { todo } = props;
    let start = todo.start_todo;
    start = DateTime.fromISO(start);
    const now = new Date();
    if (start > now) {
      // console.log('too soon to show');
    }
    const splitMessage = todo.todo.split(' ');
    let message;
    const images = [];
    let i = 0;
    const len = splitMessage.length;
    for (;i < len; i++) {
      message = splitMessage[i];
      if (isImageUrl(message)) {
        splitMessage[i] = React.createElement(
          'img',
          {
            src: message,
            alt: message,
            className: 'todopicture mt-2',
          },
        );
      } else if (i < len - 1) {
        if (i > 0 && typeof (splitMessage[i - 1] === 'object')) {
          splitMessage[i] = ` ${message} `;
        } else {
          splitMessage[i] = `${message} `;
        }
      }
    }
    // console.log(splitMessage);
    return (
      <div className="row mb-3 ">
        <div className="col-1" />
        <div className="col-8">
          {todoFormat(splitMessage, todo)}
        </div>
        <div className="col-2 d-flex align-items-center">
          <button className="btn btn-success" type="button" id={props.index} onClick={() => deleteMessage(props.index)}>
            <span className="oi oi-check" title="check" aria-hidden="true" />
          </button>
        </div>
      </div>
    );
  }

  function todoFormat(message, todo) {
    let  dueDate  = todo["due_date"];
    dueDate = DateTime.fromISO(dueDate);
    let className = '';
    if (dueDate.equals(maxDate)) {
      dueDate = <p className="mb-1"><span className="font-weight-bold">No Due Date</span></p>;
      className = 'container border border-danger rounded pt-1';
    } else {
      dueDate = (
        <p className="mb-1">
          <span className="font-weight-bold">Due Date: </span>
          {' '}
          {dueDate.toLocaleString(DateTime.DATETIME_MED)}
        </p>
      );
      className = 'container border border-primary rounded pt-1';
    }

    return (
      <div className={className}>
        <div className="todo_description row mt-1 px-3 ">
          {
          message
        }
        </div>
        <div className="row px-3">
          {dueDate}
        </div>
      </div>
    );
  }

  function deleteMessage(index) {
    const todosCopy = [...todos];
    const { id } = todos[index];
    todosCopy.splice(index, 1);
    setTodos(todosCopy);
    Socket.emit('deleteTodo', {
      id,
      email,
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
            todos.map((todo, index) => (
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
