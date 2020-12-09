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
    <div className="col-4 col-xl-2 ml-xl-5">
      <button
        type="button"
        onClick={addForm}
        className="btn btn-landingPageYellow btn-fullsize"
      >
        <span className="oi oi-list" title="list" aria-hidden="true" />
      </button>
    </div>
  );
}
