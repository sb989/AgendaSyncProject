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
  const [userURL, setUserURL] = React.useState('');

  let page;

  function getUserURL() {
    React.useEffect(() => {
      Socket.on('googleCalendar', (data) => {
        setUserURL(data.url);
        setEmail(data.email);
      });
    });
  }

  function selectPage() {
    if (authenticated && email !== '') {
      page = React.createElement(
        MainPage,
        {
          setAuthenticated,
          setName,
          setEmail,
          setProfilePic,
          authenticated,
          name,
          email,
          userURL,
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
  getUserURL();
  return (
    <div>
      {page}
    </div>
  );
}
