import * as React from 'react';
import GoogleLogin, { GoogleLogout } from 'react-google-login';

import ReactDOM from 'react-dom';
import Socket from './Socket';

export default function GoogleButton(params) {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  // console.log(clientId);
  function success(response) {
    const { code } = response;
    
    if (code !== undefined) {
      Socket.emit('login with code', {
        code,
      });
    } else {
      const { email } = response.profileObj;
      params.setEmail(email);
     
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
    
    let mounted = true;
    if(mounted)
    {
      params.setAuthenticated(false);
    }
    return () => mounted = false;
    
    
  }

  if (!params.authenticated) {
    return (
      <GoogleLogin
        className="googleLoginButton"
        clientId="25700182333-kan1soef90krqdbho3mogdbr35k4fpd6.apps.googleusercontent.com"
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
    clientId="25700182333-kan1soef90krqdbho3mogdbr35k4fpd6.apps.googleusercontent.com"
    buttonText="Logout"
    render={renderProps => (
      <button className="btn btn-ligh col" onClick={renderProps.onClick} disabled={renderProps.disabled}>Logout</button>
    )}
    onLogoutSuccess={logout}
    onFailure={failure}

    />

    
  );
}
