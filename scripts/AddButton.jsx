import * as React from 'react';
import AddForm from './AddForm';

export default function AddButton(params) {
  const { setSelected } = params;
  const { email } = params;
  function addForm(e) {
    e.preventDefault();
    setSelected(
      React.createElement(AddForm, { email }),
    );
  }
  return (
    <div className="col-4 col-xl-2 mr-xl-5">
      <button
        type="button"
        onClick={addForm}
        className="btn btn-landingPageOrange btn-fullsize"
      >
        <span className="oi oi-plus" title="plus" aria-hidden="true" />
      </button>
    </div>
  );
}
