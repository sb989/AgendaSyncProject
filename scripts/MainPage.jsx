import * as React from 'react';
import GoogleButton from './GoogleButton';
import AddButton from './AddButton';
import UserCalendar from './UserCalendar';
import CalendarButton from './CalendarButton';
import AgendaButton from './AgendaButton';
import Socket from './Socket';
import PhoneNumberForm from './PhoneNumberForm';

export default function MainPage(params) {
  //   const { name } = params;
  const { email } = params;
  const { setAuthenticated } = params;
  const { setName } = params;
  const { setProfilePic } = params;
  const { setEmail } = params;
  const { authenticated } = params;

  const [selected, setSelected] = React.useState('');

  function setUpDefaultLook() {
    React.useEffect(() => {
      setSelected(React.createElement(UserCalendar, { "email":email }));
    },[]);
  }

  function getPhoneNumber() {
    React.useEffect(() => {
      Socket.on('getPhoneNumber', () => {
        // console.log('getPhoneNumber');
        setSelected(React.createElement(PhoneNumberForm, {
          setSelected,
          setUpDefaultLook,
          email,
        }));
      });
    }, []);
  }

  function removePhoneForm() {
    React.useEffect(() => {
      Socket.on('Server has phone number', () => {
        setSelected(React.createElement(UserCalendar, {  }));
      });
    });
  }

  setUpDefaultLook();
  getPhoneNumber();
  removePhoneForm();
  return (
    <div>
      <GoogleButton
        className="googleButton"
        setAuthenticated={setAuthenticated}
        setName={setName}
        setEmail={setEmail}
        setProfilePic={setProfilePic}
        authenticated={authenticated}
      />
      <br />
      {selected}
      <br />
      <CalendarButton
        setSelected={setSelected}
      />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

      <AddButton
        setSelected={setSelected}
        email={email}
      />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

      <AgendaButton
        setSelected={setSelected}
        email={email}
      />
    </div>

  );
}
