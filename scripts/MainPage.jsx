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
        setSelected(React.createElement(UserCalendar, {  "email":email }));
      });
    });
  }

  setUpDefaultLook();
  getPhoneNumber();
  removePhoneForm();
  return (
    <div>
      <div className="container-fluid">
        <div className="row">
          <img src="../static/agenda_sync_logo.png" className="col-2"></img>
          <div className="col-8"></div>
          <div className="col-2">
            <div className="googleButton">
              <GoogleButton 
                setAuthenticated={setAuthenticated}
                setName={setName}
                setEmail={setEmail}
                setProfilePic={setProfilePic}
                authenticated={authenticated}
              />
            </div>
          </div>
        </div>       
      </div>
      
      <br />
      {selected}
      <br />
      <div className="container">
        <div className="row">
          <CalendarButton
            setSelected={setSelected}
            email={email}
          />
          <div className="col-3"></div>
          <AddButton
            setSelected={setSelected}
            email={email}
          />
          <div className="col-3"></div>
      

          <AgendaButton
            setSelected={setSelected}
            email={email}
          />
        </div>
        
      </div>
      
    </div>

  );
}
