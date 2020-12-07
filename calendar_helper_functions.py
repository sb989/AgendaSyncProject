'''calendar_helper_functions.py'''
import calendar
from dateutil import parser
from apiclient.discovery import build


def create_update_all_message(cred, start_month, end_month):
    ''' returns the events seperated by month for the timespan specified'''
    service = build("calendar", "v3", credentials=cred)
    result = service.events().list(
        calendarId="primary", timeMin=start_month,
        timeMax=end_month, singleEvents=True,
        orderBy="startTime").execute()
    result = seperate_events_by_month(result["items"], start_month, end_month, result["timeZone"])
    return result

def create_update_month_message(cred, curr_month_date, prev_month_date, padding):
    '''
    creates the message to send to the frontend. contains events for the new month
    and what month to delete.
    curr_month_date and prev_month_date both start counting months at 1. (e.g. january = 1)
    the month in the message starts couting months at 0. (e.g. january = 0)
    '''
    sorted_events = {}
    new_month = 0
    prev_month = prev_month_date.month
    if curr_month_date < prev_month_date:
        delete_month = prev_month + padding
        if delete_month > 12:
            delete_month = delete_month - 12
        sorted_events = create_sorted_events_for_new_month(curr_month_date, -padding, cred)
        new_month = curr_month_date.month
        new_month = new_month - padding
        if new_month < 0:
            new_month = new_month + 12
    elif curr_month_date > prev_month_date:
        delete_month = prev_month - padding
        if delete_month < 0:
            delete_month = 12 + delete_month
        sorted_events = create_sorted_events_for_new_month(curr_month_date, padding, cred)
        new_month = curr_month_date.month
        #print(new_month)
        new_month = new_month + padding
        #print(new_month)
        if new_month > 12:
            new_month = new_month - 12
        #print(new_month)
    message = {
        "addMonth":str(new_month-1),
        "addEvents":sorted_events,
        "deleteMonth":str(delete_month-1),
        }
    return message

def create_sorted_events_for_new_month(curr_month_date, change, cred):
    '''
    returns sorted events dict for month that frontend will add.
    '''
    curr_month = curr_month_date.month
    curr_year = curr_month_date.year
    new_month = curr_month+change
    year_offset = 0
    if new_month > 12:
        new_month = new_month - 12
        year_offset = 1
    elif new_month < 1:
        new_month = 12 + new_month
        year_offset = -1
    new_month_date = curr_month_date.replace(month=new_month)
    new_month_date = new_month_date.replace(year=curr_year+year_offset)
    end_day = (calendar.monthrange(curr_year+year_offset, new_month_date.month))[1]
    new_month_date_end = new_month_date.replace(day=end_day)
    sorted_events = {}
    # new_month-1 is used because javascripts date object starts at 0
    #pythons datetime object starts at 1 when counting months
    sorted_events[str(new_month-1)] = setup_month_dict(new_month, curr_year)
    service = build("calendar", "v3", credentials=cred)
    events = service.events().list(
        calendarId="primary", timeMin=new_month_date.isoformat(),
        timeMax=new_month_date_end.isoformat(), singleEvents=True,
        orderBy="startTime").execute()
    sorted_events = populate_sorted_events(sorted_events, events["items"])
    return sorted_events


def seperate_events_by_month(events, start_month_date, end_month_date, time_zone):
    '''seperates the events into a dict with month indeces as keys'''
    sorted_events = {}
    sorted_events["timeZone"] = time_zone
    start_datetime = parser.isoparse(start_month_date)
    end_datetime = parser.isoparse(end_month_date)
    start_month = start_datetime.month
    end_month = end_datetime.month
    year = start_datetime.year
    if end_datetime.day == 1:
        end_month = end_month -1
    #range of values for the for loops is 0-11
    #javascripts date object starts counting months at 0
    if end_month < start_month:
        for i in range(start_month-1, 12):#loops through the months leading to december
            sorted_events[str(i)] = setup_month_dict(i+1, year)
        for i in range(0, end_month):# loops through january to the last month
            sorted_events[str(i)] = setup_month_dict(i+1, year)
    else:
        for i in range(start_month-1, end_month):
            sorted_events[str(i)] = setup_month_dict(i+1, year)
    sorted_events = populate_sorted_events(sorted_events, events)
    return sorted_events

def setup_month_dict(month, year):
    '''sets up a month dict contains days worth of entries. each entry is a list'''
    days_in_month = (calendar.monthrange(year, month))[1]
    month_dict = {}
    for day in range(1, days_in_month+1):
        month_dict[day] = [] #creates a dict entry for that day;it is a list
    return month_dict

def populate_sorted_events(sorted_events, events):
    '''inserts events into proper month day list'''
    for event in events:
        if "dateTime" in event["start"] and "dateTime" in event["end"]:
            month = event["start"]["dateTime"]
            end = event["end"]["dateTime"]
        elif "date" in event["start"] and "date" in event["end"]:
            month = event["start"]["date"]
            end = event["end"]["date"]
        start = month
        event_id = event["id"]
        summary = event["summary"]
        html_link = event["htmlLink"]
        month = parser.isoparse(month)
        day = month.day
        month = month.month
        month = month-1
        sorted_events[str(month)][day].append({
            "start":start,
            "end":end,
            "summary":summary,
            "id":event_id
        })
    return sorted_events