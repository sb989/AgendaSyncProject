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
    <button type="button" onClick={calendar} className="col-2">
      <img src="https://icons.iconarchive.com/icons/custom-icon-design/pretty-office-7/256/Calendar-icon.png" width="100" height="100" alt="" />
    </button>
  );
}
