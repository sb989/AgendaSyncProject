import * as React from 'react';
import GoogleLogin, { GoogleLogout } from 'react-google-login';

import ReactDOM from 'react-dom';
import Socket from './Socket';

export default function GoogleButton(params) {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  // console.log(clientId);
  function success(response) {
    const { code } = response;
    var month = new Date();
    var startMonth = new Date(month.getFullYear(),month.getMonth()-1,1,0,0,0,0);//
    var endMonth = new Date(startMonth.getFullYear(), month.getMonth() + 2, 0,23,59,59,999); 

    console.log(startMonth);
    console.log(endMonth);
    startMonth = startMonth.toISOString();
    console.log(startMonth);
    
    endMonth = endMonth.toISOString();
    console.log(endMonth);
    if (code !== undefined) {
      Socket.emit('login with code', {
        code,
        startMonth,
        endMonth,
      });
    } else {
      const { email } = response.profileObj;
      params.setEmail(email);
      Socket.emit('login with email',
        {
          email,
          startMonth,
          endMonth,
        });// after login; every page refresh rerturns profile instead
    }
    params.setAuthenticated(true);
    params.setCode(code);
  }

  function failure() {
    params.setAuthenticated(false);
  }

  function logout() {
    const name = '';
    const email = '';
    // const accessToken = '';
    const profilePic = '';
    // console.log('logout');
    Socket.emit('logout', {
      name,
      email,
      profilePic,
    });
    params.setEmail('');
    params.setAuthenticated(false);
  }

  if (!params.authenticated) {
    return (
      <GoogleLogin
        className="googleLoginButton"
        clientId="30624731772-clsbuhec4ag6bukbqpsuf1qppc3g3n5r.apps.googleusercontent.com"
        buttonText="Log in with Google"
        onSuccess={success}
        onFailure={failure}
        isSignedIn
        cookiePolicy="single_host_origin"
        responseType="code"
        accessType="offline"
        prompt="consent"
        scope="https://www.googleapis.com/auth/calendar"
      />
    );
  }

  return (
    <GoogleLogout
      className="googleLogoutButton"
      isSignedIn={false}
      clientId="30624731772-clsbuhec4ag6bukbqpsuf1qppc3g3n5r.apps.googleusercontent.com"
      buttonText="Logout"
      onLogoutSuccess={logout}
      onFailure={failure}
    />
  );
}
