import * as React from 'react';
import Socket from './Socket';
import LoginPage from './LoginPage';
import MainPage from './MainPage';

export function Content() {
  const [authenticated, setAuthenticated] = React.useState(false);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [profilePic, setProfilePic] = React.useState('');
  const [code, setCode] = React.useState('');
  const [userURL, setUserURL] = React.useState('');

  let page;

  function getUserURL() {
    React.useEffect(() => {
      Socket.on('email', (data) => {
        setEmail(data.email);
      });
    });
  }

  function getProfilePic(){
    React.useEffect(()=>{
      Socket.on('profilePic',(data)=>{
        setProfilePic(data.profilePic);
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
  getUserURL();
  getProfilePic();
  return (
    <div>
      {page}
    </div>
  );
}
