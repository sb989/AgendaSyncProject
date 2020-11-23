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
    <form>
      Enter country code followed by 10 digit phone number
      <input
        type="text"
        id="phoneNumber"
        name="phoneNumber"
        onInput={newInp}
      />
      <button type="submit" onClick={sendPhoneNumber}>
        Submit
      </button>
    </form>

  );
}
