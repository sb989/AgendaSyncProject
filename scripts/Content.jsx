import * as React from 'react';
import Socket from './Socket';
import LoginPage from './LoginPage';
import MainPage from './MainPage';
import GoogleButton from './GoogleButton';
export function Content() {
  const [authenticated, setAuthenticated] = React.useState(false);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [profilePic, setProfilePic] = React.useState(''); //Corresponds to line in app.py: flask_socketio.emit("profilePicture", {"picture": profile_picture})
  const [code, setCode] = React.useState('');

  let page;

  function getEmail() {
    React.useEffect(() => {
      Socket.on('email', (data) => {
        setEmail(data.email);
      });
    });
  }

  function loginButton(){
    if(authenticated)
    {
      return (
        <nav className="navbar navbar-light bg-light">
          <div className="container-fluid">
            <div className="row navrow p-3">
              <div className="navbar-brand" href="#">
                <img 
                  src="../static/agenda_sync_logo.png" 
                  className="agendaSyncLogo"
                  alt="Responsive image"> 
                </img>
              </div>
              <div className="col col-md col-xl pt-2 d-flex align-items-end justify-content-end">
                  <p className="d-none d-md-block mb-0">Welcome, {name}</p>
              </div>
              <div className="col-4 col-sm-2">
                <button 
                  type="button" 
                  className="btn" 
                  data-toggle="dropdown" 
                  aria-haspopup="true" 
                  aria-expanded="false"
                  >
                  <img className="profilePic" src={profilePic} alt="profilePic"></img>
                </button>
                <div className="dropdown-menu dropdown-menu-left">
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
          
          </div>
        </nav>
    );}
    else{
      return(
        <nav className="navbar fixed-top navbar-light bg-light">
        <div className="container-fluid">
          <div className="navbar-brand" href="#">
            <img 
              src="../static/agenda_sync_logo.png" 
              className="agendaSyncLogo"
              alt="Responsive image"> 
            </img>
          </div>
          <GoogleButton 
            setAuthenticated={setAuthenticated}
            setName={setName}
            setEmail={setEmail}
            authenticated={authenticated}
          />
          
        </div>
      </nav>
      
      );
    }
  }

  function getProfile(){
    React.useEffect(()=>{
      Socket.on('profile',(data)=>{
        setProfilePic(data.profilePic);
        setName(data.name);
      });
    })
  }

  function selectPage() {
    if (authenticated && email !== '') {
      page = React.createElement(
        MainPage,
        {
          setAuthenticated,
          setName,
          setEmail,
          profilePic,
          authenticated,
          name,
          email,
        },
      );// placeholder for actual calendar page
    } else {
      page = React.createElement(
        LoginPage,
        {
          setAuthenticated,
          setName,
          setEmail,
          setProfilePic,
          authenticated,
          setCode,
        },
      );
    }
  }
  selectPage();
  getEmail();
  getProfile();
  return (
    <div>
      {loginButton()}
      {page}
    </div>
  );
}
