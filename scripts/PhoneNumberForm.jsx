import * as React from 'react';
import Socket from './Socket';
// import UserCalendar from './UserCalendar';

export default function PhoneNumberForm(params) {
  const [phone, setPhone] = React.useState('');
  const [input, setInput] = React.useState('');
  const { email } = params;
  function newInp(curr) {
    setInput(curr.target.value);
  }

  function sendPhoneNumber(e) {
    e.preventDefault();
    // console.log(input);
    // console.log(email);
    Socket.emit('receivePhoneNumber', {
      phone: input,
      email,
    });
  }

  return (
    <form className="container">
      <div className="row">
        <p className="col-12 col-lg-5 px-0">Enter country code followed by 10 digit phone number</p>
        <input
          type="text"
          id="phoneNumber"
          name="phoneNumber"
          onInput={newInp}
          className="col-12 col-md-5 col-lg-2"
          maxLength="11"
        />
        <button className="btn btn-secondary ml-2" type="submit" onClick={sendPhoneNumber}>
          Submit
        </button>
      </div>
    </form>
      
      

  );
}
