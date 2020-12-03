''' app.py '''

import os
from os.path import join, dirname

from dateutil import parser
from dateutil import tz
import datetime

# from datetime import *

import flask
import requests
import flask_socketio
import flask_sqlalchemy
from datetime import datetime
from datetime import timedelta

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
# ngrok http 8080

ADD_TODO = "add todo"
UPDATE_TODO = 'update todo'
DELETE_TODO = "delete todo"
LIST_TODO = "list todo"
START_DATE = "start date"
DUE_DATE = "due date"
HELP_ME = "help me"
ADD_CALENDAR = "add calendar"
UPDATE_CALENDAR = "update calendar"


@APP.route("/bot", methods=["POST"])
def bot():
    ''' Initialize and run the bot from mobile inputs via Twilio '''
    start_date = datetime.now()
    start_date_est = start_date - timedelta(hours=5)
    start_date_iso = start_date_est.isoformat()
    end_date_est = start_date_est + timedelta(hours=1)
    end_date_iso = end_date_est.isoformat()
    
    incoming_msg_orig = request.values.get("Body", "")
    
    incoming_msg = incoming_msg_orig.lower()
    
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
            + ", 'delete todo, 'list todo' "
            + ",'start date', and 'due date',"
            + "'add calendar', and 'update calendar'"
        )
        responded = True

    if ADD_TODO in incoming_msg:
        message_body = incoming_msg[9:]
        add_new_todo_to_db(message_body, user_email)
        msg.body("Inserted: '" + message_body + "' into your todolist!")
        responded = True
        
    if DELETE_TODO in incoming_msg and incoming_msg[12:].isnumeric():
        delete_todo(int(incoming_msg[12:]), user_email)
        msg.body("Deleting from your todolist!")
        responded = True
        
    elif DELETE_TODO in incoming_msg:
        msg.body("Please reply with a todo id to delete: 'delete todo id'\n")
        msg.body(get_all_todos_values(user_email))
        responded = True

    if LIST_TODO in incoming_msg:
        msg.body(
            "Your todo list contents are as follows: "
            + get_all_todos_values(user_email)
        )
        responded = True
        
    if ADD_CALENDAR in incoming_msg:
        message_body = incoming_msg[13:]
        event = {'title': message_body, 'date': start_date_iso, 'email': user_email}
        msg.body("Added " + message_body + " to your calender")
        add_calendar_event(event)
        responded = True
        
    if UPDATE_CALENDAR in incoming_msg:    
        message_body = incoming_msg_orig[16:]
        
        if "event" in incoming_msg:
            msg_array = message_body.split(" ", 1)
            msg_array[1] = msg_array[1].split(":")
            print(msg_array)
            
            person = get_person_object(user_email)
            cred = person.cred
            
            if not cred or not cred.valid:
                if cred and cred.expired and cred.refresh_token:
                    cred.refresh(Request())
                    update_tokens_in_db(user_email, cred)
                    
                    
            service = build("calendar", "v3", credentials=cred)
            result = service.events().list(calendarId=user_email).execute()
    
            for item in result["items"]:
                if item['summary'] == msg_array[1][0]:
                    
                    event = service.events().get(calendarId=user_email, eventId=item['id']).execute()
                    event['summary'] = msg_array[1][1]
                    service.events().update(calendarId=user_email, eventId=item['id'], body=event).execute()
                    
                    msg.body("Replaced event title '" + msg_array[1][0] + " with " + msg_array[1][1] + "' in your calendar!")
                    responded = True
        
        # if result["items"]['summary'] == 'Dr. Ronald quick appt (Andre Pugliese)':
        #     events = service.events().get(calendarId=user_email, eventId=result["items"]['id']).execute()
        #     print(events)
        
        # for i in :
        #     events = service.events().get(calendarId=user_email, eventId=i['id']).execute()
        #     if
        #     print(events)
        #     print("\n")
            
        
        # if "date" in incoming_msg:
        #     datetimeobject = datetime.strptime(incoming_msg[21:],'%m/%d/%Y %I:%M%p')
        #     newformat = datetimeobject.strftime('%Y-%m-%d' + 'T' + '%H:%m:%s' + 'Z')
        #     print(newformat)
            #event_contents = {'title': message_body[0].strip("'"), 'date': newformat, 'email': message_body[2].strip("'")}
            
            #print(event_contents)
            #add_calendar_event(event_contents)
            #msg.body("Inserted: '" + message_body + "' into your calendar!")
            # responded = True

    if START_DATE in incoming_msg:
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
    print(type(some_person))
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


def delete_todo(id, user_email):
    some_person = DB.session.query(models.Person).filter_by(email=user_email).first()
    DB.session.query(models.Todo).filter_by(id=id, person=some_person).delete(synchronize_session='evaluate')
    # DB.session.delete(todo_entry);
    DB.session.commit();


@SOCKET_IO.on("login with code")
def login(data):
    ''' On client login, authorize/store google auth token then emit google calendar information '''
    auth_code = data["code"]
    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
        "client_secret.json",
        scopes=[
            "openid",
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/calendar.events",
            "https://www.googleapis.com/auth/calendar",
        ],
        redirect_uri=GOOGLE_URI,
    )

    flow.fetch_token(code=auth_code)

    cred = flow.credentials

    service = build("calendar", "v3", credentials=cred)
    result = service.calendarList().list().execute()

    profileurl = (
        "https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token={}".format(
            cred.token
        )
    )
    profile = requests.get(profileurl)
    profile = profile.json()
    
    profile_picture = profile['picture']
    user_email = profile["email"]

    login_user = "https://calendar.google.com/calendar/embed?src={}&ctz=America%2FNew_York".format(
        user_email
    )
    
    flask_socketio.emit("googleCalendar", {"url": login_user, "email": user_email})
    flask_socketio.emit("profilePicture", {"picture": profile_picture})
    
    calendar_id = result["items"][0]["id"]

    # result = service.events().list(calendarId=calendar_id).execute()
    # for i in result["items"]:
    #     if i['summary'] == 'DANCE!' and i['dateTime'] == '2020-11-29T13:06:19-05:00':
    #         events = service.events().get(calendarId=calendar_id, eventId=i['id']).execute()
    #         print(events)
    #         print("\n")
    
    # get_all_todos()
    # print(result['items'])

    if user_email not in get_all_emails():
        add_new_person_to_db(user_email, cred)
        flask_socketio.emit("getPhoneNumber")
    else:
        print(f"user {user_email} exists")
        update_tokens_in_db(user_email, cred)

    flask_socketio.emit("connected", {"calendarUpdate": result["items"]})


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


@SOCKET_IO.on("login with email")
def login_with_email(data):
    ''' On client email login, retrieve email and update credentials before calendar emit '''
    email = data["email"]
    user_email = email
    print(email)
    login_user = "https://calendar.google.com/calendar/embed?src={}&ctz=America%2FNew_York".format(
        email
    )
    flask_socketio.emit("googleCalendar", {"url": login_user, "email": user_email})
    person = get_person_object(user_email)
    cred = person.cred
    print(cred)
    print(cred.token)
    # get_all_todos()


@SOCKET_IO.on("addCalendarEvent")
def add_calendar_event(data):
    ''' Retrieve calendar event from client, insert it into client's google calendar via API '''
    user_email = data["email"]
    person = get_person_object(user_email)
    cred = person.cred
    if not cred or not cred.valid:
        if cred and cred.expired and cred.refresh_token:
            cred.refresh(Request())
            update_tokens_in_db(user_email, cred)
    print(data)
    title = data["title"]
    date = data["date"]
    event = {
        "summary": title,
        "location": "",
        "description": "",
        "start": {
            "dateTime": date,
            "timeZone": "America/New_York",
        },
        "end": {
            "dateTime": date,
            "timeZone": "America/New_York",
        },
        "attendees": [],
        "reminders": {"useDefault": True},
    }

    service = build("calendar", "v3", credentials=cred)
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
    init_db(APP)
    SOCKET_IO.run(
        APP,
        host=os.getenv("IP", "0.0.0.0"),
        port=int(os.getenv("PORT", 8080)),
        debug=True,
    )