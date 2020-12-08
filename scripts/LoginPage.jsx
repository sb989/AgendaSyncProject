import * as React from 'react';
import GoogleButton from './GoogleButton';


export default function LoginPage(params) {
  const { setAuthenticated } = params;
  const { setName } = params;
  const { setProfilePic } = params;
  const { setEmail } = params;
  const { authenticated } = params;
  const { setCode } = params;
  
  return (
    <div>
    <div className ="landingPage">
     <div className="splash">
            <div className="panel">
                <video autoPlay loop className="splash-video" poster="https://images.unsplash.com/photo-1488998427799-e3362cec87c3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80">
                    <source src="/assets/videos/splash.webm" type="video/webm"/>
                    <source src="/assets/videos/splash.mp4" type="video/mp4"/>
                </video>
                <img className="splash-panel-image logo" src="https://dewey.tailorbrands.com/production/brand_version_mockup_image/304/4167981304_a6db7ea3-9908-4d0b-b315-1ed7c9167b14.png?cb=1605992586"/>
                <div href="#section1" className="splash-panel-image subtitle">
                We’ve got you in sync!
                </div>
                <div className="splash-panel-image-tag-line"></div>
            </div>
        </div>

     
        <div className="agenda">
            <div className="agenda-panels panel-header">
                <svg className="icon fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 62.12 80.36"><path d="M5,50.65L28.26,64.07a6.23,6.23,0,0,0,5.62,0L57.11,50.65a6.24,6.24,0,0,0,2.81-4.87V19a6.24,6.24,0,0,0-2.81-4.87L33.88,0.67a6.24,6.24,0,0,0-5.62,0L5,14.08A6.23,6.23,0,0,0,2.2,19V45.78A6.24,6.24,0,0,0,5,50.65Zm50.51-4.9a2.22,2.22,0,0,1-.61,1.09L33.27,59.34V33.5L55.52,20.66v25.1ZM30.43,4.49a1.82,1.82,0,0,1,.64-0.09,2.08,2.08,0,0,1,.61.08L53.21,16.91,31.06,29.7,8.92,16.91Zm-1.56,29V59.34L7.24,46.86a2.23,2.23,0,0,1-.64-1.08V20.66ZM51.81,68.22a140.39,140.39,0,0,0-20.75-1.36,140.39,140.39,0,0,0-20.75,1.36C3,69.38,0,70.94,0,73.61S3,77.84,10.31,79a140.38,140.38,0,0,0,20.75,1.36A140.38,140.38,0,0,0,51.81,79c7.32-1.16,10.31-2.72,10.31-5.39S59.14,69.38,51.81,68.22ZM31.06,76c-12.93,0-21.34-1.26-25-2.35,3.66-1.09,12.07-2.35,25-2.35s21.34,1.26,25,2.35C52.4,74.69,44,76,31.06,76Z"/></svg>
            </div>
            <div className="panel agenda-panels brand-halo">
                <p className="brand-halo-text pane-text">We're more than just an agenda application. <br className="hide-xs"/>We reinvented the traditional task app. <strong>We are AgendaSync!</strong></p>
                <img src="https://icons-for-free.com/iconfiles/png/512/note+notepad+icon-1320183464225485738.png" className="brand-halo-left-image"/>

            </div>
            <div className="panel agenda-panels computing-power">
                <img className="panel-image-overlay" src="https://images.unsplash.com/photo-1577394732330-38cef75bc388?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"/>
                <div className="panel-overlay">
                    <div className="computing-power-text-pane center-pane">
                        <p className="computing-power-text pane-text">We integrate more than just a  <strong>Google</strong><br/> calendar.</p>
                    </div>
                </div>
            </div>
            <div className="panel agenda-panels hardware-software">
                <p className="hardware-software-text pane text-pane pane-text">AgendaSync is<strong> more</strong><br/> than a taskboard.</p>
                <div className="pane">
                    <img className="pane-image" src="https://images.unsplash.com/photo-1474377207190-a7d8b3334068?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"/>
                </div>
            </div>
            <div className="panel agenda-panels game-changing">
                <img className="panel-image-overlay" src="https://images.unsplash.com/photo-1523634921619-37ce98c1877f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1952&q=80"/>
                <div className="panel-overlay">
                    <div className="game-changing-text-pane">
                        <p className="game-changing-text pane-text" style={{fontSize: "100px"}}/>We have collectively used APIs, chatbot functionality, ReactJS, Python, and to-do list functionalities.<br/><br/>  
                    </div>
                </div>
            </div>
        </div>

        <div className="people">
            <div className="people-panels panel-header">
                <svg className="icon fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 92.33 69.09"><path className="cls-1" d="M263.36,117.25l-18.53-15.82c-0.86.66-2.12,1.59-3.73,2.61l17.69,15.1-0.26.21c-5.83,4.44-16,4.44-19.28,4.44-2.74,0-3.88-1-4.21-1.37v-0.07l-0.37-.47-9-11.42c-1.75.43-3.33,0.79-4.75,1.08l10.33,13.07s2,3.58,8,3.58c3.92,0,14.94,0,22-5.34C265.12,119.86,263.36,117.25,263.36,117.25ZM243.07,97.43l0.12-.08a7.81,7.81,0,0,0,2.87-4.79,6.87,6.87,0,0,0-2.5-6,1.14,1.14,0,0,1-.3-0.3,2.37,2.37,0,0,1,.11-1,6.18,6.18,0,0,0-.62-4.93,6.49,6.49,0,0,0-2.94-2.72,2.4,2.4,0,0,1-1.26-1.06,6,6,0,0,1-.1-1,10.18,10.18,0,0,0-1.1-4.49,6,6,0,0,0-3.9-3l-0.32-.1-0.05-.15A9.35,9.35,0,0,0,231,64.06a7,7,0,0,0-4.88-2.16,9.16,9.16,0,0,0-1.94.24l-0.23,0a5.14,5.14,0,0,0-.62.17,7.23,7.23,0,0,0-4.5-1.64,5.66,5.66,0,0,0-3,.84l-0.08.07a8.65,8.65,0,0,0-4.91-1.44,11.5,11.5,0,0,0-5.66,1.59,7.21,7.21,0,0,0-3.57,4.54A7.76,7.76,0,0,0,198,68.45a10.48,10.48,0,0,0-2.42,4.14,8.61,8.61,0,0,0-4.41,2.89,7.27,7.27,0,0,0-2,4.21,8.91,8.91,0,0,0-3.62,4c-3.08,6.36,3.47,11.28,5.94,13.14l0.36,0.27a19.14,19.14,0,0,0,1.67,1.16l-17.26,14.21c-0.81.53-4.21,2.92-4.8,6.11a5.2,5.2,0,0,0,1,4.17c4.36,5.75,13,6.48,20.13,6.48a12.14,12.14,0,0,0,9.46-4.17l12-12.78,0.14-.16c1.75-2.26,3.08-2.76,9.83-5C232.57,104.33,242.64,97.71,243.07,97.43ZM189.58,85.59c1.12-2.49,3.35-2.54,3.86-3.14s-0.47-2.58,1-4c2.07-2.55,4-1.32,4.46-2,0.89-1.19.43-3,2.29-5a3.43,3.43,0,0,1,2.6-1.08c0.75,0,1.4.18,1.76,0.18a0.49,0.49,0,0,0,.21,0c0.28-.35-1.17-3.45,1.48-4.94a7.12,7.12,0,0,1,3.5-1,4.17,4.17,0,0,1,2.45.69s-2.48,2.29-1.49,3.45a4.36,4.36,0,0,1-.17,5.26l-0.1.1-2.07-2.61A2.18,2.18,0,1,0,206,74.18l2.78,3.52a5.4,5.4,0,0,1-.59,4.32,3.25,3.25,0,0,1-.38.45l-3.92-4.18a2.19,2.19,0,0,0-3.19,3l3.89,4.16c0.74,1.89,1,3.8-.39,4.81a2.42,2.42,0,0,1-1.3.51l0,0-5.39-6.13a2.19,2.19,0,0,0-3.28,2.89l4.39,5a2.63,2.63,0,0,1-.37,1.94,1.66,1.66,0,0,1-1.14.57c-0.6,0-1.31-.44-2.5-1.35C192.5,92.06,187.94,88.9,189.58,85.59Zm21.29,23.79-12,12.78-0.18.21a7.7,7.7,0,0,1-6,2.5c-8.88,0-14.16-1.51-16.62-4.74a0.82,0.82,0,0,1-.21-0.72c0.2-1.08,1.87-2.59,2.94-3.26L179,116l25.65-21.12h0a7.15,7.15,0,0,0,2.11-1.06,6.81,6.81,0,0,0,2.72-4.61,8.65,8.65,0,0,0,0-2.51,6.81,6.81,0,0,0,2.29-2.09l0.07-.11a9.21,9.21,0,0,0,1.49-6.15,8.68,8.68,0,0,0,3.3-9.3l1.92-3.89,0.24,0a2.77,2.77,0,0,1,1.83.75,2.2,2.2,0,0,0,3.2,1.1,3.52,3.52,0,0,1,1-.47l0.27-.05a5.33,5.33,0,0,1,1-.15,2.59,2.59,0,0,1,1.87,1,6.74,6.74,0,0,1,1,2.07,7.56,7.56,0,0,0,.41,1,4.3,4.3,0,0,0,2.81,2,1.75,1.75,0,0,1,1.33.82,6.08,6.08,0,0,1,.59,2.69,6.61,6.61,0,0,0,.51,2.58,6.53,6.53,0,0,0,3.13,3,2.37,2.37,0,0,1,1.21,1,2,2,0,0,1,.16,1.84,6,6,0,0,0,.07,3.54l0.08,0.19a5.16,5.16,0,0,0,1.5,1.91,2.49,2.49,0,0,1,.41.39,2.3,2.3,0,0,1-.56,3.45c-0.93.61-10.3,6.65-17.85,9.17C216,105.22,213.47,106.06,210.87,109.38Z" transform="translate(-171.43 -60.19)"/></svg>
            </div>
            <div className="panel people-panels software-people">
                <img className="panel-image-overlay" src="https://images.unsplash.com/photo-1573166801077-d98391a43199?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1949&q=80"/>
                <div className="panel-overlay">
                    <div className="software-people-text-pane">
                        <p className="software-people-text pane-text">Surindra Boodhoo, Jason Eccles, Zaafira Hasan, and Andre Pugliese are four NJIT students<br/> on a mission to bring you...</p>
                    </div>
                </div>
            </div>
            <div className="panel people-panels panel-header core-competencies-panel">
                <p className="core-competencies-text pane-text white-text">An agenda application<br/> <strong>like no other!</strong> </p>
            </div>
            <div className="panel people-panels thumbs-up-panel">
                <img className="panel-image-overlay" src="https://images.unsplash.com/photo-1602526430780-782d6b1783fa?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"/>
            </div>

        </div>


        <div className="culture">
            <div className="culture-panels panel-header">
                <svg className="icon fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 83.44 79.3"><path d="M56.64,22.25a8.58,8.58,0,1,0-8.58-8.58A8.59,8.59,0,0,0,56.64,22.25Zm0-12.76a4.18,4.18,0,1,1-4.18,4.18A4.18,4.18,0,0,1,56.64,9.49Zm15.9,29.39-5.17-3.4A2.2,2.2,0,0,0,64,37.32V78.58a8.14,8.14,0,0,1-3.88,0V53.92h-4.4V78.46a8.6,8.6,0,0,1-4.16,0V37.32a2.2,2.2,0,1,0-4.4,0V52.4H45.37a1.75,1.75,0,0,1-1.74-1.74V30.82a1.75,1.75,0,0,1,1.74-1.75H66.68l9,6.46a30.43,30.43,0,0,1,3.6-2.83L68.68,25.09a2.2,2.2,0,0,0-1.29-.42h-22a6.15,6.15,0,0,0-6.15,6.15V50.66a6.15,6.15,0,0,0,6.15,6.15h1.75V79.14c0,2.45,2.48,4,6.48,4a9.91,9.91,0,0,0,4.16-.79A9.3,9.3,0,0,0,62,83.2c3.9,0,6.32-1.5,6.32-3.91V41.4l1.73,1.14a6.6,6.6,0,0,1,.74-1.35C71.36,40.38,71.94,39.62,72.53,38.88Zm23.87-7a26.27,26.27,0,1,0,26.27,26.27A26.3,26.3,0,0,0,96.4,31.85Zm-8,5.92a27.74,27.74,0,0,0-2.7,6.39H79.59A22,22,0,0,1,88.45,37.77ZM77,48h7.79a52.64,52.64,0,0,0-.88,8.19H74.63A21.67,21.67,0,0,1,77,48Zm0,20.22A21.67,21.67,0,0,1,74.63,60h9.31a52.74,52.74,0,0,0,.88,8.18H77Zm2.56,3.85h6.16a27.74,27.74,0,0,0,2.7,6.39A21.94,21.94,0,0,1,79.59,72.08Zm14.89,7.52c-1.74-1.15-3.43-3.78-4.67-7.52h4.67v7.52Zm0-11.37H88.77a47.48,47.48,0,0,1-1-8.18h6.68v8.18Zm0-12H87.8a47.52,47.52,0,0,1,1-8.19h5.71v8.19Zm0-12H89.8c1.25-3.74,2.93-6.37,4.67-7.52v7.52ZM115.78,48a21.71,21.71,0,0,1,2.4,8.19h-9.31A52.64,52.64,0,0,0,108,48h7.79Zm-2.56-3.85h-6.16a27.76,27.76,0,0,0-2.7-6.39A22,22,0,0,1,113.22,44.16ZM98.33,36.64c1.74,1.15,3.43,3.78,4.68,7.52H98.33V36.64Zm0,11.37H104a47.62,47.62,0,0,1,1,8.19H98.33V48Zm0,31.59V72.08H103C101.75,75.82,100.07,78.45,98.33,79.59Zm0-11.37V60H105a47.48,47.48,0,0,1-1,8.18H98.33Zm6,10.24a27.73,27.73,0,0,0,2.7-6.39h6.16A22,22,0,0,1,104.36,78.46Zm11.41-10.24H108a52.62,52.62,0,0,0,.88-8.18h9.31A21.67,21.67,0,0,1,115.77,68.23Z" transform="translate(-39.23 -5.09)"/></svg>
            </div>
            <div className="panel culture-panels societal-contribution">
                <div className="societal-contributions-text-pane">
                    <p className="societal-contributions-text pane-text">We wanted to bring an application that is unlike anything seen <strong>in the app store today.</strong></p>
                </div>
            </div>
            <div className="panel culture-panels gavin-panel">
                <img className="panel-image-overlay" src="https://images.unsplash.com/photo-1538673719418-0367029d6f2e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2034&q=80"/>

            </div>
            <div className="panel culture-panels state-of-the-art-facilities">
                <p className="state-of-the-art-facilities-text pane text-pane pane-text">Our application allows you to see your <strong>personalized Google calendar</strong> alongside a taskboard.</p>
                <div className="pane">
                    <img className="pane-image" src="https://images.unsplash.com/photo-1600783245563-16114264a2c8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1567&q=80"/>
                </div>
            </div>
            <div className="panel culture-panels break-down-walls">
                <img className="panel-image-overlay" src="https://images.unsplash.com/photo-1544377165-d1859f53175f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1977&q=80"/>
                <div className="panel-overlay">
                    <div className="break-down-walls-text-pane">
                        <p className="break-down-walls-text pane-text" style={{color:"grey"}}>That lame Agenda. app doesn't let you<br/> <strong> sync </strong>your Google calendar events!</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="mission">
            <div className="mission-panels panel-header">
                <img src="https://cdn3.iconfinder.com/data/icons/small/512/house_key_lock_property_security-128.png"/>
            </div>
            <div className="panel mission-panels changing-the-world">
                <img className="panel-image-overlay" src="https://images.unsplash.com/photo-1468276311594-df7cb65d8df6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"/>
                <div className="panel-overlay">
                    <div className="changing-the-world-text-pane">
                        <p className="changing-the-world-text pane-text"><span>There are seperate apps that show Google calendars and taskboards,<br/> but none to bring these <strong>two useful functionalities TOGETHER</strong>!</span></p>
                    </div>
                </div>
            </div>
            <div className="panel mission-panels bigger-than-our-innovations">
                <img className="panel-image-overlay" src="https://images.unsplash.com/photo-1567177662154-dfeb4c93b6ae?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80"/>
                <div className="panel-overlay">
                    <div className="bigger-than-our-innovations-text-pane center-pane">
                        <p className="bigger-than-our-innovations-text pane-text">This is where AgendaSync comes in as it <strong>functions</strong> as both a calendar application, as well as a task board!</p>
                    </div>
                </div>
            </div>
            <div className="panel missions-panels collective-accolades">
                <img className="panel-image-overlay" src="https://images.unsplash.com/photo-1443397646383-16272048780e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1567&q=80"/>
                <div className="panel-overlay">
                    <div className="collective-accolades-text-pane">
                        <p className="collective-accolades-text pane-text">You can add events to your personalized Google calendar, as well as <strong> personalized </strong>tasks to your to-do list.</p>
                    </div>
                </div>
            </div>
        </div>

      
        <div className="panel agendasync">
            <video autoPlay loop className="mountain-video" poster="https://images.unsplash.com/photo-1520745217265-cc9470b4e39e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2089&q=80">
            </video>
            <div className="panel-overlay">
                <div className="mountain-text-pane">
                <p className="mountain-text pane-text">
                <strong>Neat, </strong> huh!<br/>
                </p>
                </div>
            </div>

        </div>

        

    
    </div>
    
    
    </div>
  );
}
