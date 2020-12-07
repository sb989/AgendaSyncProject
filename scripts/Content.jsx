import * as React from 'react';
import Socket from './Socket';
import LoginPage from './LoginPage';
import MainPage from './MainPage';

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
      {page}
    </div>
  );
}
