''' app.py '''

import os
from os.path import join, dirname

from dateutil import parser
import calendar
import flask
import requests
import flask_socketio
import flask_sqlalchemy

from flask import request

import google_auth_oauthlib.flow

from dotenv import load_dotenv
from twilio.twiml.messaging_response import MessagingResponse

from google.auth.transport.requests import Request
from apiclient.discovery import build

USERS_UPDATED_CHANNEL = "users updated"

APP = flask.Flask(__name__)

SOCKET_IO = flask_socketio.SocketIO(APP)
SOCKET_IO.init_app(APP, cors_allowed_origins="*")

DOTENV_PATH = join(dirname(__file__), "sql.env")
load_dotenv(DOTENV_PATH)
DOTENV_PATH = join(dirname(__file__), "redirect.env")
load_dotenv(DOTENV_PATH)
DOTENV_PATH = join(dirname(__file__), "twilio.env")
load_dotenv(DOTENV_PATH)

TWILIO_ACCOUNT_SID = os.environ["TWILIO_ACCOUNT_SID"]
TWILIO_AUTH_TOKEN = os.environ["TWILIO_AUTH_TOKEN"]

GOOGLE_URI = os.environ["GOOGLE_URI"]

DATABASE_URI = os.environ["DATABASE_URL"]
APP.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URI

DB = flask_sqlalchemy.SQLAlchemy(APP)

import models


def init_db(APP):
    ''' initialize the database '''
    DB.init_app(APP)
    DB.APP = APP
    # models.createModels()
    DB.session.commit()


@APP.route("/", methods=["GET", "POST"])
def hello():
    ''' Initialize frontend template index.html '''
    return flask.render_template("index.html")


# twilio
# twilio
# ngrok http 5000

ADD_TODO = "add todo"
DELETE_TODO = "delete todo"
LIST_TODO = "list todo"
START_TODO = "start date"
DUE_DATE = "due date"
HELP_ME = "help me"


@APP.route("/bot", methods=["POST"])
def bot():
    ''' Initialize and run the bot from mobile inputs via Twilio '''
    incoming_msg = request.values.get("Body", "").lower()
    phone = request.form["From"]
    person = get_person_object_phone_number(phone)
    user_email = person.email
    resp = MessagingResponse()
    msg = resp.message()
    responded = False
    if HELP_ME in incoming_msg:
        msg.body(
            "Hello! I'm the agendasync textbot!"
            + "My know commands are: 'add todo'"
            + ", 'delete todo, 'list todo'"
            + ",'start date', and 'due date'"
        )
        responded = True

    if ADD_TODO in incoming_msg:
        message_body = incoming_msg[9:]
        add_new_todo_to_db(message_body, user_email)
        msg.body("Inserted: '" + message_body + "' into your todolist!")
        responded = True
    # if DELETE_TODO in incoming_msg and incoming_msg[12:].isnumeric():
    #     delete_todo(int(incoming_msg[12:]))
    #     msg.body("Deleting from your todolist!")
    #     responded = True
    # elif DELETE_TODO in incoming_msg:
    #     msg.body("Please reply with a todo id to delete: 'delete todo id'\n")
    #     msg.body(get_all_todos_values())
    #     responded = True

    if LIST_TODO in incoming_msg:
        msg.body(
            "Your todo listt contents are as follows: "
            + get_all_todos_values(user_email)
        )
        responded = True

    if START_TODO in incoming_msg:
        message_body = incoming_msg[11:]
        # query for message_body in todolist table
        # if message_body not in table:
        # msg.body("The event '" + message_body "' cannot be found in your todo list!")
        # responded = True
        # dbQuery = DB.query
        msg.body(
            "The start date of the event '" + message_body + "' is: "
        )  # database query would go here
        responded = True

    if DUE_DATE in incoming_msg:
        message_body = incoming_msg[9:]
        # query for message_body in todolist table
        # if message_body not in table:
        # msg.body("The event '" + message_body "' cannot be found in your todo list!")
        # responded = True
        # dbQuery = DB.query
        msg.body(
            "The due date of the event '" + message_body + "' is "
        )  # database query would go here
        responded = True
    if not responded:
        msg.body("I'm not sure I understand that, could you try again?")
    return str(resp)


def get_all_emails():
    ''' Pull emails from database '''
    all_emails = [
        db_emails.email for db_emails in DB.session.query(models.Person).all()
    ]
    return all_emails


# def get_all_todos():
#     # person = get_person_object(user_email)
#     # all_todos = DB.session.query(models.Todo).filter_by(person_id=person.id).all()
#     # # all_todos = [db_todos.todo for db_todos in DB.session.query(models.Person).all()]
#     # return person.todos
#     global user_email
#     person = get_person_object(user_email)
#     all_todos = DB.session.query(models.Todo).filter_by(person_id=person.id).all()
#     for todo in all_todos:
#         print(todo.todo, todo.start_todo, todo.due_date)
#         SOCKET_IO.emit('all todos', todo.todo)
#         SOCKET_IO.emit('start date', str(todo.start_todo))
#         SOCKET_IO.emit('due date', str(todo.due_date))


def get_all_todos_values(user_email):
    ''' Query todolist values from a specific person's table, filter by person ID '''
    person = get_person_object(user_email)
    all_todos = DB.session.query(models.Todo).filter_by(person_id=person.id).all()
    todo_list = []
    for todo in all_todos:
        todo_list.append(
            "Id: "
            + str(todo.id)
            + "\nTodo: "
            + todo.todo
            + "\nstart date: "
            + str(todo.start_todo)
            + "\ndue date: "
            + str(todo.due_date)
            + "\n"
        )
    return " ".join(map(str, todo_list))


#def get_all_todos_ids(user_email):
#    ''' Pull todolist IDs from a specific email's table\ '''
#    person = get_person_object(user_email)
#    all_todos = DB.session.query(models.Todo).filter_by(person_id=person.id).all()
#    todo_list_ids = []
#    for todo in all_todos:
#        todo_list_ids.append(str(todo.id))
#    return todo_list_ids


def get_person_object_phone_number(phone):
    ''' Query phone number from specific person's table, filter by phone number '''
    some_person = (
        DB.session.query(models.Person).filter_by(phone=phone).first()
    )
    return some_person


def get_person_object(email):
    ''' Query person ID from specific person's table, filter by email '''
    some_person = DB.session.query(models.Person).filter_by(email=email).first()
    return some_person


def add_new_person_to_db(email, cred, phone=""):
    ''' Create new person table, identify them by email, login credentials, and phone number '''
    person = models.Person(email=email, cred=cred, phone=phone)
    DB.session.add(person)
    DB.session.commit()


def update_tokens_in_db(email, cred):
    ''' Update person's table with new credentials token, query by email '''
    person = get_person_object(email)
    person.cred = cred
    DB.session.commit()


@SOCKET_IO.on("send todo")
def get_all_todos(data):
    ''' Query todos by person id, emit all found (todos, sds, dds) to client in list format '''
    # person = get_person_object(user_email)
    # all_todos = DB.session.query(models.Todo).filter_by(person_id=person.id).all()
    # # all_todos = [db_todos.todo for db_todos in DB.session.query(models.Person).all()]
    # return person.todos
    user_email = data["email"]
    person = get_person_object(user_email)
    todos = []
    start_todos = []
    due_dates = []

    all_todos = DB.session.query(models.Todo).filter_by(person_id=person.id).all()
    for todo in all_todos:
        todos.append(todo.todo)
        start_todos.append(str(todo.start_todo))
        due_dates.append(str(todo.due_date))

    message = {"Todos": todos, "start_todos": start_todos, "due_dates": due_dates}
    flask_socketio.emit("sending todo info", message)
    print(message)


def add_new_todo_to_db(todo, user_email, start="", end=""):
    ''' Query person's database, add (start/end date optional) new todos to database from client '''
    some_person = DB.session.query(models.Person).filter_by(email=user_email).first()
    if start == "" and end == "":
        todo_entry = models.Todo(todo=todo, person=some_person)
    else:
        todo_entry = models.Todo(todo=todo, person=some_person, start_todo=start, due_date=end)
    DB.session.add(todo_entry)
    DB.session.commit()


# def delete_todo(id):
#     global user_email
#     some_person = DB.session.query(models.Person).filter_by(email=user_email).first()
#     todo_entry = DB.session.query(models.Todo).filter_by(id=id, person=some_person)
#     DB.session.delete(todo_entry);
#     DB.session.commit();

def get_cred_from_email(email):
    person = get_person_object(email)
    cred = person.cred
    return cred
@SOCKET_IO.on("login with code")
def login(data):
    ''' On client login, authorize/store google auth token then emit google calendar information '''
    start_month = data["startMonth"]
    end_month = data["endMonth"]
    auth_code = data["code"]
    auth_code = data["code"]
    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
        "client_secret.json",
        scopes=[
            "openid",
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/calendar",
        ],
        redirect_uri=GOOGLE_URI,
    )

    flow.fetch_token(code=auth_code)

    cred = flow.credentials

    service = build("calendar", "v3", credentials=cred)
    # result = service.calendarList().list().execute()
    profileurl = (
        "https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token={}".format(
            cred.token
        )
    )
    profile = requests.get(profileurl)
    profile = profile.json()

    user_email = profile["email"]

    result = service.events().list(calendarId="primary", timeMin=start_month, timeMax=end_month, singleEvents=True, orderBy="startTime").execute()
    result = seperate_events_by_month(result["items"], start_month, end_month, result["timeZone"])

    flask_socketio.emit("email", {"email": user_email})
    flask_socketio.emit("calendarInfo", {"events":result})

    if user_email not in get_all_emails():
        add_new_person_to_db(user_email, cred)
        flask_socketio.emit("getPhoneNumber")
    else:
        print(f"user {user_email} exists")
        update_tokens_in_db(user_email, cred)


@SOCKET_IO.on("login with email")
def login_with_email(data):
    ''' On client email login, retrieve email and update credentials before calendar emit '''
    start_month = data["startMonth"]
    end_month = data["endMonth"]
    email = data["email"]
    user_email = email
    cred = get_cred_from_email(user_email)

    service = build("calendar", "v3", credentials=cred)
    result = service.events().list(calendarId="primary", timeMin=start_month, timeMax=end_month, singleEvents=True, orderBy="startTime").execute()
    result = seperate_events_by_month(result["items"], start_month, end_month, result["timeZone"])
    flask_socketio.emit("email", {"email": user_email})
    flask_socketio.emit("calendarInfo", {"events":result})
    # get_all_todos()

@SOCKET_IO.on("currentMonth")
def send_new_calendar_info(data):
    '''tells client what month to delete and sends information on new month'''
    curr_month_date = data["currMonth"]
    prev_month_date = data["prevMonth"]
    email = data["email"]
    curr_month_date = parser.isoparse(curr_month_date)
    prev_month_date = parser.isoparse(prev_month_date)
    
    prev_month = prev_month_date.month
    print(curr_month_date)

    cred = get_cred_from_email(email)
    if not cred or not cred.valid:
        if cred and cred.expired and cred.refresh_token:
            cred.refresh(Request())
            update_tokens_in_db(email, cred)
    sorted_events = {}
    new_month = 0
    if(curr_month_date < prev_month_date):
        delete_month = prev_month
        if(delete_month == 12):
            delete_month = 0
        sorted_events = create_sorted_events_for_new_month(curr_month_date, -1, cred)
        new_month = curr_month_date.month
        new_month = new_month - 2
    elif(curr_month_date > prev_month_date):
        delete_month = prev_month - 2
        if(delete_month < 0):
            delete_month = 12 + delete_month
        sorted_events = create_sorted_events_for_new_month(curr_month_date, 1, cred)
        new_month = curr_month_date.month
    flask_socketio.emit("updateMonth", {
            "addMonth":str(new_month),
            "addEvents":sorted_events,
            "deleteMonth":str(delete_month),
            })
def create_sorted_events_for_new_month(curr_month_date, change, cred):
        '''
        value of prev_month is used instead of prev_month +1 
        to account for javascript month notation; it starts with 0
        '''
        curr_month = curr_month_date.month
        curr_year = curr_month_date.year
        new_month = curr_month+change
        if(new_month > 12):
            new_month = new_month - 12
        elif(new_month < 1):
            new_month = 12 + new_month
        print("curr+change=",curr_month+change)
        new_month_date = curr_month_date.replace(month=new_month)
        end_day = (calendar.monthrange(curr_year, new_month_date.month))[1]
        new_month_date_end = new_month_date.replace(day=end_day)
        sorted_events = {}
        sorted_events[str(new_month-1)] = setup_month_dict(new_month-1, curr_year)
        #-1 for 0 offset
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
    if end_month < start_month:
        for i in range(start_month-1, 12):#loops through the months leading to december
            sorted_events[str(i)] = setup_month_dict(i, year)
        for i in range(0, end_month):# loops through january to the last month
            sorted_events[str(i)] = setup_month_dict(i, year)
    else:
        for i in range(start_month-1, end_month):
            sorted_events[str(i)] = setup_month_dict(i, year)
    sorted_events = populate_sorted_events(sorted_events, events)
    return sorted_events

def setup_month_dict(month, year):
    '''sets up a month dict contains days worth of entries. each entry is a list'''
    days_in_month = (calendar.monthrange(year, month+1))[1]
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
            "html_link":html_link
        })
    return sorted_events

@SOCKET_IO.on("receivePhoneNumber")
def recieve_phone_number(data):
    ''' On client login, retrieve phone number and store it in local database for person '''
    print(data)
    email = data["email"]
    print(email)
    person = get_person_object(data["email"])
    phone = "+"
    phone += data["phone"]
    print(phone)
    person.phone = phone
    DB.session.commit()
    flask_socketio.emit("Server has phone number")

@SOCKET_IO.on("addCalendarEvent")
def add_calendar_event(data):
    ''' Retrieve calendar event from client, insert it into client's google calendar via API '''
    user_email = data["email"]
    cred = get_cred_from_email(user_email)
    if not cred or not cred.valid:
        if cred and cred.expired and cred.refresh_token:
            cred.refresh(Request())
            update_tokens_in_db(user_email, cred)
    print(data)
    service = build("calendar", "v3", credentials=cred)
    calendar = service.calendars.get("primary")
    timeZone = calendar["timeZone"]
    title = data["title"]
    date = data["date"]
    event = {
        "summary": title,
        "location": "",
        "description": "",
        "start": {
            "dateTime": date,
            "timeZone": timeZone,
        },
        "end": {
            "dateTime": date,
            "timeZone": timeZone,
        },
        "attendees": [],
        "reminders": {"useDefault": True},
    }
    event = service.events().insert(calendarId="primary", body=event).execute()


@SOCKET_IO.on("addToDoList")
def add_todo_list(data):
    ''' Retrieve todolist update event from client, insert it into server-side database '''
    print(data)
    user_email = data["email"]
    start_todo = data["startDate"]  # currently both times are in UTC
    end_todo = data["endDate"]
    desc = data["description"]
    start_todo = parser.isoparse(start_todo)
    end_todo = parser.isoparse(end_todo)
    print(start_todo)
    print(end_todo)
    add_new_todo_to_db(desc, user_email, start_todo, end_todo)
    # get_all_todos()


if __name__ == "__main__":
    # init_db(APP)
    SOCKET_IO.run(
        APP,
        host=os.getenv("IP", "0.0.0.0"),
        port=int(os.getenv("PORT", 8080)),
        debug=True,
    )