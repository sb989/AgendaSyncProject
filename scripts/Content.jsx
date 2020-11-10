import * as React from 'react';
import Socket from './Socket';
import LoginPage from './LoginPage';
// import Placeholder from './Placeholder';
import UserCalendar from './UserCalendar';
export function Content() {

    const [authenticated,setAuthenticated] = React.useState(false);
    const [name,setName] = React.useState("");
    const [email,setEmail] = React.useState("");
    const [profilePic,setProfilePic] = React.useState("");
    const [code,setCode] = React.useState("");
    const [userURL, setUserURL] = React.useState("");
    
    let page;
    
    function getUserURL() {
        React.useEffect(() => 
        {
            Socket.on('googleCalendar', (data) => {
                setUserURL(data['url']);
            });
            
        });
    }
    
    function selectPage()
    {
        if(authenticated)
        {
            page = React.createElement(
                UserCalendar,
                {
                    setAuthenticated,
                    setName,
                    setEmail,
                    setProfilePic,
                    authenticated,
                    name,
                    email,
                    userURL
                }
                );//placeholder for actual calendar page
        }
        
        else
        {
            page = React.createElement(
                LoginPage,
                {
                    setAuthenticated,
                    setName,
                    setEmail,
                    setProfilePic,
                    authenticated,
                    setCode
                }
                );
        }
    }
    selectPage()
    getUserURL();
    return (
        <div>
            {page}
        </div>
    );
}
