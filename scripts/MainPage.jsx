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
  const { profilePic } = params;
  const { setEmail } = params;
  const { authenticated } = params;
  const { name } = params;
  const [selected, setSelected] = React.useState('');

  function setUpDefaultLook() {
    React.useEffect(() => {
      setSelected(React.createElement(UserCalendar, { "email":email }));
    },[]);
  }

  function askForProfilePic(){
    React.useEffect(()=>{
      Socket.emit("sendProfile",{
        email
      });
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
  askForProfilePic();
  setUpDefaultLook();
  getPhoneNumber();
  removePhoneForm();
  return (
    <div className="m-3">
        <div className="container-fluid ">
          <div className="row p-3">
            <img 
              src="../static/agenda_sync_logo.png" 
              className="agendaSyncLogo"
              alt="Responsive image"> 
            </img>
            
            <div className="col col-md col-xl pt-2 d-flex align-items-end justify-content-end">
              <p className="d-none d-md-block mb-0">Welcome, {name}</p>
            </div>
            
            <div className="col-4 col-sm-2">
              <button 
                type="button" 
                className="btn dropdown-toggle" 
                data-toggle="dropdown" 
                aria-haspopup="true" 
                aria-expanded="false"
                >
                  <img className="profilePic" src={profilePic} alt="profilePic"></img>
              </button>
              <div className="dropdown-menu dropdown-menu-right">
                <a className="dropdown-item px-0" href="#">
                  <GoogleButton 
                    setAuthenticated={setAuthenticated}
                    setName={setName}
                    setEmail={setEmail}
                    authenticated={authenticated}
                  />
                </a>
              </div>
            </div>
            
          </div>       
          <div className="d-block d-md-none">
            <p >Welcome, {name}</p>
          </div>
        </div>     
      {selected}
        <div className="container mt-3">
          <div className="row justify-content-center">
            <AddButton
              setSelected={setSelected}
              email={email}
            />
            <CalendarButton
              setSelected={setSelected}
              email={email}
            />
            <AgendaButton
              setSelected={setSelected}
              email={email}
            />
          </div>
        </div>
    </div>

  );
}
