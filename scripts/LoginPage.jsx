import * as React from 'react';
import GoogleButton from './GoogleButton';
export default function LoginPage(params)
{
    
    const setAuthenticated = params.setAuthenticated;    
    const setName = params.setName;
    const setProfilePic = params.setProfilePic;
    const setEmail = params.setEmail;
    const authenticated = params.authenticated;
    return (
        <div>
            <h1 className="loginTitle">
                AgendaSync
            </h1>
            <img src="../static/agenda.png" alt="agenda">
            </img>
            <GoogleButton
                className="googleButton"
                setAuthenticated={setAuthenticated}
                setName = {setName}
                setEmail = {setEmail}
                setProfilePic = {setProfilePic}
                authenticated = {authenticated}
            />
        </div>
    );
}