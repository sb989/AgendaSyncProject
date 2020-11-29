import * as React from 'react';
import GoogleButton from './GoogleButton';
import htmlContent from './LandingPage.html';


export default function LoginPage(params) {
  const { setAuthenticated } = params;
  const { setName } = params;
  const { setProfilePic } = params;
  const { setEmail } = params;
  const { authenticated } = params;
  const { setCode } = params;
  
  return (
    
    <div className="loginBox">
      <div dangerouslySetInnerHTML={ {__html: htmlContent} } />
      <h1 className="loginTitle">
        AgendaSync
      </h1>
      <img className="logo" src="../static/agenda.png" alt="agenda" />
      <br />
      <GoogleButton
        setAuthenticated={setAuthenticated}
        setName={setName}
        setEmail={setEmail}
        setProfilePic={setProfilePic}
        authenticated={authenticated}
        setCode={setCode}
      />
    </div>
  );
}
