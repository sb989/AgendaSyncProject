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
    <button type="button" onClick={addForm} className="col-2">
      <img src="https://images.assetsdelivery.com/compings_v2/feelisgood/feelisgood1709/feelisgood170902152.jpg" width="100" height="100" alt="" />
    </button>
  );
}
