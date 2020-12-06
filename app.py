''' app.py '''

import os
from os.path import join, dirname
import calendar
import datetime
from dateutil import parser
from dateutil import tz

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
import calendar_helper_functions as chf
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

GOOGLE_URI_HTTP = os.environ["GOOGLE_URI_HTTP"]
GOOGLE_URI_HTTPS = os.environ["GOOGLE_URI_HTTPS"]

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
    
def update_calendar_event(incoming_msg, email, message):
    person = get_person_object(email)
    cred = person.cred
        
    if not cred or not cred.valid:
        if cred and cred.expired and cred.refresh_token:
            cred.refresh(Request())
            update_tokens_in_db(email, cred)
            
    service = build("calendar", "v3", credentials=cred)
    result = service.events().list(calendarId=email).execute()
    
    msg_array = message.split(" ", 1)
    
    if "event" in incoming_msg:
        msg_array[1] = msg_array[1].split(":")
        
        for item in result["items"]:
            if item['summary'] == msg_array[1][0]:
                try:
                    event = service.events().get(calendarId=email, eventId=item['id']).execute()
                    event['summary'] = msg_array[1][1]
                    service.events().update(calendarId=email, eventId=item['id'], body=event).execute()
                    
                    print("Replaced event")
                    return("completed event")
                except:
                    print("Failed to replace event.")
                
    if "startdate" in incoming_msg:
        msg_array[1] = msg_array[1].split(":", 1)
        
        firstDate = datetime.strptime(msg_array[1][1],'%m/%d/%Y %I:%M%p')
        firstDatePad = datetime.strptime(msg_array[1][1],'%m/%d/%Y %I:%M%p')
        firstDatePad = firstDatePad + timedelta(hours=1)
        
        adjustment = firstDate.strftime('%Y-%m-%d' + 'T' + '%H:%M:%S')
        adjustmentPad = firstDatePad.strftime('%Y-%m-%d' + 'T' + '%H:%M:%S')
        print(adjustmentPad)
        
        for item in result["items"]:
            if item['summary'] == msg_array[1][0]:
                try:
                    event = service.events().get(calendarId=email, eventId=item['id']).execute()
                    event['start']['dateTime'] = adjustment + event['start']['dateTime'][19:]
                    event['end']['dateTime'] = adjustmentPad + event['start']['dateTime'][19:]
                    service.events().update(calendarId=email, eventId=item['id'], body=event).execute()
                    
                    print("Updated date start time")
                    return("completed start date")
                except:
                    print("Failed to replace event start date.")
                    
    if "enddate" in incoming_msg:
        msg_array[1] = msg_array[1].split(":", 1)
        
        secondDate = datetime.strptime(msg_array[1][1],'%m/%d/%Y %I:%M%p')
        adjustmentTwo = secondDate.strftime('%Y-%m-%d' + 'T' + '%H:%M:%S')
        
        for item in result["items"]:
            if item['summary'] == msg_array[1][0]:
                try:
                    event = service.events().get(calendarId=email, eventId=item['id']).execute()
                    event['end']['dateTime'] = adjustmentTwo + event['start']['dateTime'][19:]
                    service.events().update(calendarId=email, eventId=item['id'], body=event).execute()
                    
                    print("Updated date end time")
                    return("completed end date")
                except:
                    print("Failed to replace event end date.")
    

@APP.route("/", methods=["GET", "POST"])
def hello():
    ''' Initialize frontend template index.html '''
    return flask.render_template("index.html")

# twilio
# twilio
# ngrok http 8080

ADD_TODO = "add todo"
ADD_TODO_ENDLESS = "add todo endless"
UPDATE_TODO = 'update todo'
DELETE_TODO = "delete todo"
MARK_COMPLETE = "mark complete"
LIST_TODO = "list todo"
START_DATE = "start date"
DUE_DATE = "due date"
HELP_ME = "help me"
ADD_CALENDAR = "add calendar"
UPDATE_CALENDAR = "update calendar"

start_date = datetime.now()
start_date_est = start_date - timedelta(hours=5)
start_date_iso = start_date_est.isoformat()
end_date_est = start_date_est + timedelta(hours=1)
end_date_iso = end_date_est.isoformat()

def check_empty_argument(msg, command, message):
    if message == "":
        msg.body("Please provide an argument to the command: '" + command + "'")
        return(True)

@APP.route("/bot", methods=["POST"])
def bot():
    ''' Initialize and run the bot from mobile inputs via Twilio '''
    incoming_msg_orig = request.values.get("Body", "")
    
    incoming_msg = incoming_msg_orig.lower()
    
    phone = request.form["From"]
    person = get_person_object_phone_number(phone)
    user_email = person.email
    resp = MessagingResponse()
    msg = resp.message()
    check_todo(user_email)
    responded = False
    
    if HELP_ME in incoming_msg:
        msg.body(
            "Hello! I'm the agendasync textbot!"
            + "My know commands are: 'add todo'"
            + ", add todo endless, mark complete"
            + ", 'delete todo, 'list todo' "
            + ",'start date', and 'due date',"
            + "'add calendar', and 'update calendar [event/date]'"
        )
        responded = True

    if ADD_TODO_ENDLESS in incoming_msg:
        message_body = incoming_msg[17:]
        if(check_empty_argument(msg, ADD_TODO_ENDLESS, message_body)):
            responded = True
        else:
            add_new_todo_to_db_endless(message_body, user_email, start_date_est, datetime.max)
            msg.body("Inserted: '" + message_body + "' into your todolist with no due date!")
            responded = True 

    elif ADD_TODO in incoming_msg:
        message_body = incoming_msg[9:]
        if(check_empty_argument(msg, ADD_TODO, message_body)):
            responded = True
        else:
            add_new_todo_to_db(message_body, user_email)
            msg.body("Inserted: '" + message_body + "' into your todolist with a due date of tomorrow")
            responded = True
    
    if DELETE_TODO in incoming_msg:
        if(incoming_msg[12:].isnumeric() == False):
            msg.body("Please reply with a todo id to delete: 'delete todo id'\n")
            msg.body(get_all_todos_values(user_email))
            responded = True
        else:
            delete_todo(int(incoming_msg[12:]), user_email)
            msg.body("Deleting 'id " + incoming_msg[12:] + "' from your todolist!")
            responded = True
    
    if MARK_COMPLETE in incoming_msg:
        if(incoming_msg[14:].isnumeric() == False):
            msg.body("Please reply with a todo id to mark complete: 'mark complete id'\n")
            msg.body(get_all_todos_values(user_email))
            responded = True
        else:
            delete_todo(int(incoming_msg[14:]), user_email)
            msg.body("Marking todo 'id " + incoming_msg[14:] + "' complete")
            responded = True
            
    if UPDATE_TODO in incoming_msg:
        if(incoming_msg[12:].isnumeric() == False):
            msg.body("Please reply with a todo id to update: 'update todo id'\n")
            msg.body(get_all_todos_values(user_email))
            responded = True
        else:
            update_todo(incoming_msg[12:], user_email, start_date_est, end_date_est)
            msg.body("Updating todo id " + incoming_msg[12:] +" from your todolist!")
            responded = True

    if LIST_TODO in incoming_msg:
        msg.body(
            "Your todo list contents are as follows: "
            + get_all_todos_values(user_email)
        )
        responded = True
        
    if ADD_CALENDAR in incoming_msg:
        message_body = incoming_msg[13:]
        if(check_empty_argument(msg, ADD_CALENDAR, message_body)):
            responded = True
        else:
            event = {'title': message_body, 'start': start_date_iso, 'email': user_email, 'end':end_date_iso}
            add_calendar_event(event)
            msg.body("Added " + message_body + " to your calender")
            responded = True
            
    if DUE_DATE in incoming_msg:
        message_body = incoming_msg[9:]
        if(check_empty_argument(msg, DUE_DATE, message_body)):
            responded = True
        else:
            date = due_date_todo(int(incoming_msg[9:]), user_email)
            msg.body("The due date of the event id '" + message_body + "' is " + str(date))
            responded = True
            
    if START_DATE in incoming_msg:
        message_body = incoming_msg[11:]
        if(check_empty_argument(msg, START_DATE, message_body)):
            responded = True
        else:
            date = start_date_todo(int(incoming_msg[11:]), user_email)
            msg.body("The start date of the event id '" + message_body + "' is " + str(date))
            responded = True
        
    if UPDATE_CALENDAR in incoming_msg:    
        message_body = incoming_msg_orig[16:]
        if(update_calendar(incoming_msg, user_email, message_body) == 'completed event'):
            msg_array = message_body.split(" ", 1)
            msg_array[1] = msg_array[1].split(":")
            
            msg.body("Replaced event title '" + msg_array[1][0] + "' with '" + msg_array[1][1] + "' in your calendar!")
            responded = True
        
        elif(update_calendar(incoming_msg, user_email, message_body) == 'completed start date'):
            msg_array = message_body.split(" ", 1)
            msg_array[1] = msg_array[1].split(":", 1)
            
            msg.body("Replaced start date of '" + msg_array[1][0] + "' with '" + msg_array[1][1] + "' in your calendar!")
            responded = True
            
        elif(update_calendar(incoming_msg, user_email, message_body) == 'completed end date'):
            msg_array = message_body.split(" ", 1)
            msg_array[1] = msg_array[1].split(":", 1)
            
            msg.body("Replaced end date of '" + msg_array[1][0] + "' with '" + msg_array[1][1] + "' in your calendar!")
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

    all_todos = DB.session.query(models.Todo).filter_by(person_id=person.id).all()
    for todo in all_todos:
        todos.append({
            "todo":todo.todo,
            "start_todo":str(todo.start_todo),
            "due_date":str(todo.due_date),
            "id":todo.id
            })
        # todos.append(todo.todo)
        # start_todos.append(str(todo.start_todo))
        # due_dates.append(str(todo.due_date))

    message = {"todos":todos}
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
    
def add_new_todo_to_db_endless(todo, user_email, start, end):
    ''' Query person's database, add (start/end date optional) new todos to database from client '''
    some_person = DB.session.query(models.Person).filter_by(email=user_email).first()
    todo_entry = models.Todo(todo=todo, person=some_person, start_todo=start, due_date=end)
    DB.session.add(todo_entry)
    DB.session.commit()
    
def update_todo(id, user_email, start, end):
    some_person = DB.session.query(models.Person).filter_by(email=user_email).first()
    todo = DB.session.query(models.Todo).filter_by(id=id, person=some_person).first()
    todo.start_todo = start
    todo.due_date = end
    DB.session.commit()

def delete_todo(id, user_email):
    some_person = DB.session.query(models.Person).filter_by(email=user_email).first()
    DB.session.query(models.Todo).filter_by(id=id, person=some_person).delete(synchronize_session='evaluate')
    # DB.session.delete(todo_entry);
    DB.session.commit();

def start_date_todo(id, user_email):
    some_person = DB.session.query(models.Person).filter_by(email=user_email).first()
    todo = DB.session.query(models.Todo).filter_by(id=id, person=some_person).first()
    start = todo.start_todo
    DB.session.commit()
    return(start)
 
def due_date_todo(id, user_email):
    some_person = DB.session.query(models.Person).filter_by(email=user_email).first()
    todo = DB.session.query(models.Todo).filter_by(id=id, person=some_person).first()
    end = todo.due_date
    DB.session.commit()
    return(end)
    
def check_todo(user_email):
    person = get_person_object(user_email)
    all_todos = DB.session.query(models.Todo).filter_by(person_id=person.id).all()
    current_date = datetime.now()
    current_date_est = current_date - timedelta(hours=5)
    for todo in all_todos:
        if todo.due_date < current_date_est:
            delete_todo(todo.id, user_email)
    DB.session.commit();
    print("checked for outdated todos")

def get_cred_from_email(email):
    '''returns cred based on email'''
    person = get_person_object(email)
    cred = person.cred
    return cred

@SOCKET_IO.on("login with code")
def login(data):
    ''' On client login, authorize/store google auth token then emit google calendar information '''
    auth_code = data["code"]
    http_site = data["http"]
    print(http_site)
    print(GOOGLE_URI_HTTP)
    GOOGLE_URI = GOOGLE_URI_HTTPS
    if http_site:
        GOOGLE_URI = GOOGLE_URI_HTTP
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

    profileurl = (
        "https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token={}".format(
            cred.token
        )
    )
    profile = requests.get(profileurl)
    profile = profile.json()
    
    user_email = profile["email"]

            
    flask_socketio.emit("email", {"email": user_email})

    if user_email not in get_all_emails():
        add_new_person_to_db(user_email, cred)
        flask_socketio.emit("getPhoneNumber")
    else:
        print(f"user {user_email} exists")
        update_tokens_in_db(user_email, cred)


@SOCKET_IO.on("allMonths")
def send_initial_calendar_info(data):
    '''sends initial calendar info to the frontend'''
    print('hi')
    start_month = data["startMonth"]
    end_month = data["endMonth"]
    email = data["email"]
    cred = get_cred_from_email(email)
    result = chf.create_update_all_message(cred, start_month, end_month)
    flask_socketio.emit("calendarInfo", {"events":result})

@SOCKET_IO.on("currentMonth")
def send_new_calendar_info(data):
    '''tells client what month to delete and sends information on new month'''
    curr_month_date = data["currMonth"]
    prev_month_date = data["prevMonth"]
    padding = data["padding"]
    email = data["email"]
    curr_month_date = parser.isoparse(curr_month_date)
    prev_month_date = parser.isoparse(prev_month_date)
    print(curr_month_date)
    print(padding)
    cred = get_cred_from_email(email)
    if not cred or not cred.valid:
        if cred and cred.expired and cred.refresh_token:
            cred.refresh(Request())
            update_tokens_in_db(email, cred)
    message = {}
    message_name = ""
    delta = prev_month_date - curr_month_date
    if abs(delta) > timedelta(days=40):
        curr_month = curr_month_date.month
        start_month = curr_month - padding
        end_month = curr_month + padding
        curr_year = curr_month_date.year
        if start_month < 1:
            start_month = start_month + 12
            start_date = curr_month_date.replace(month=start_month, year=curr_year-1)
        else:
            start_date = curr_month_date.replace(month=start_month)
        if end_month > 12:
            end_month = end_month - 12
            end_date = curr_month_date.replace(month=end_month, year=curr_year+1)
            end_day = (calendar.monthrange(curr_year+1, end_month))[1]
            end_date = end_date.replace(day=end_day)
        else:
            end_date = curr_month_date.replace(month=end_month)
            end_day = (calendar.monthrange(curr_year, end_month))[1]
            end_date = end_date.replace(day=end_day)
        print(start_date)
        print(end_date)
        result = chf.create_update_all_message(cred, start_date.isoformat(), end_date.isoformat())
        message = {"events":result}
        message_name = "updateAllMonths"
    else:
        message = chf.create_update_month_message(cred, curr_month_date, prev_month_date, padding)
        message_name = "updateMonth"
    print(message)
    flask_socketio.emit(message_name, message)




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
    calendar = service.calendars().get(calendarId="primary").execute()
    timeZone = calendar["timeZone"]
    title = data["title"]
    start = data["start"]
    end = data["end"]
    event = {
        "summary": title,
        "location": "",
        "description": "",
        "start": {
            "dateTime": start,
            "timeZone": timeZone,
        },
        "end": {
            "dateTime": end,
            "timeZone": timeZone,
        },
        "attendees": [],
        "reminders": {"useDefault": True},
    }
    print(event)
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

@SOCKET_IO.on("sendProfile")
def send_profile(data):
    '''sends profile info'''
    email = data["email"]
    cred = get_cred_from_email(email)
    if not cred or not cred.valid:
        if cred and cred.expired and cred.refresh_token:
            cred.refresh(Request())
            update_tokens_in_db(email, cred)
    profileurl = (
        "https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token={}".format(
            cred.token
        )
    )
    profile = requests.get(profileurl)
    profile = profile.json()
    flask_socketio.emit("profile", {
                "profilePic":profile["picture"],
                "name":profile["name"]})

@SOCKET_IO.on("deleteTodo")
def delete_todo_frontend(data):
    '''deletes todo specified by the frontend'''
    email = data["email"]
    id = data["id"]
    print(data)
    delete_todo(id, email)
if __name__ == "__main__":
    init_db(APP)
    SOCKET_IO.run(
        APP,
        host=os.getenv("IP", "0.0.0.0"),
        port=int(os.getenv("PORT", 8080)),
        debug=True,
    )