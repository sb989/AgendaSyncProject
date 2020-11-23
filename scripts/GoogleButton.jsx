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
      Socket.emit('login with email',
        {
          email,
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
        clientId={clientId}
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
      clientId={clientId}
      buttonText="Logout"
      onLogoutSuccess={logout}
      onFailure={failure}
    />
  );
}
