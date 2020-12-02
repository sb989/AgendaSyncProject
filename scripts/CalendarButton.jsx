import * as React from 'react';
import UserCalendar from './UserCalendar';

export default function CalendarButton(params) {
  const { setSelected } = params;
  const { email } = params;
  function calendar(e) {
    e.preventDefault();
    setSelected(React.createElement(UserCalendar, {email}));
  }
  return (
    <div className="col-4 col-xl-2 mx-xl-5">
      <button 
      type="button" onClick={calendar} 
      className="btn btn-landingPageBlue btn-fullsize"
      >
        <span className="oi oi-calendar" title="calendar" aria-hidden="true"></span>
      </button>
    </div>
    
  );
}
