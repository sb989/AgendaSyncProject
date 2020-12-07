import * as React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function EditCalendarEvent(params)
{
    const { event } = params;
    const { DateTime } = require("luxon");
    var summary = event["summary"];
    var start = event["start"];
    var end = event["end"];
    start = DateTime.fromISO(start);
    end = DateTime.fromISO(end);
    const [input, setInput] = React.useState(summary);
    const [editStartTime,setEditStartTime] = React.useState(start.toJSDate());
    const [editEndTime,setEditEndTime] = React.useState(end.toJSDate());
    return(
        <div className="container">
            <form>
                <div className="row mb-2">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-addon1">Title</span>
                    </div>
                    <input
                        type="text"
                        className="form-control col-12 ml-sm-0"
                        id="calendarEventTitle"
                        name="calendarEventTitle"
                        onInput={setInput}
                        value={input}
                    />
                </div>
                <div className="row mb-2">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-addon2">Start Date</span>
                    </div>
                    <DatePicker
                    selected={editStartTime}
                    onSelect={setEditStartTime} // when day is clicked
                    onChange={setEditStartTime} // only when value has changed
                    timeIntervals="10"
                    showTimeSelect
                    className="btn btn-light"
                    />
                </div>
                <div className="row mb-2">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-addon2">Start Date</span>
                    </div>
                    <DatePicker
                    selected={editEndTime}
                    onSelect={setEditEndTime} // when day is clicked
                    onChange={setEditEndTime} // only when value has changed
                    timeIntervals="10"
                    showTimeSelect
                    className="btn btn-light"
                    />
                </div>
            </form>
        </div>
    );
}