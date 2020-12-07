import * as React from 'react';
import DatePicker from 'react-datepicker';
import Socket from './Socket';
import 'react-datepicker/dist/react-datepicker.css';

export default function EditCalendarEvent(params)
{
    const { event } = params;
    const { email } = params;
    const { index } = params;
    const { day } = params;
    const { month } = params;
    const { DateTime } = require("luxon");
    var summary = event["summary"];
    var start = event["start"];
    var end = event["end"];
    var id = event["id"];
    start = DateTime.fromISO(start);
    end = DateTime.fromISO(end);
    const [input, setInput] = React.useState(summary);
    const [editStartTime,setEditStartTime] = React.useState(start.toJSDate());
    const [editEndTime,setEditEndTime] = React.useState(end.toJSDate());

    function sendEditCalendarEvent(e)
    {
        e.preventDefault();
        Socket.emit("editCalendarEvent",{
            "summary":input,
            "start":editStartTime.toISOString(),
            "end":editEndTime.toISOString(),
            "eventId":id,
            "email":email,
            "index":index,
            "day":day,
            "month":month,
        });
    }

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
                        onChange={(inp)=>setInput(inp.target.value)}
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

            <div className="row">
                <button className="btn btn-primary ml-3" data-dismiss="modal" type="submit" onClick={sendEditCalendarEvent}>
                    Submit
                </button>
            </div>
            </form>
        </div>
    );
}