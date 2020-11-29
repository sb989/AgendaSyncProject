import * as React from 'react';
import ToDoList from './ToDoList';

export default function AgendaButton(params) {
  const { setSelected } = params;
  const { email } = params;
  function addForm(e) {
    e.preventDefault();
    setSelected(React.createElement(ToDoList, { email }));
  }
  return (
    <button type="button" onClick={addForm} className="col-2">
      <img src="https://cdn1.iconfinder.com/data/icons/rounded-set-6/48/todo-list-512.png" width="100" height="100" alt="" />
    </button>
  );
}
