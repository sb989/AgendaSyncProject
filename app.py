import os
from os.path import join, dirname
from dateutil import parser
from twilio.rest import Client
import flask
from flask import request
import requests
import flask_socketio
import flask_sqlalchemy
from dotenv import load_dotenv
from twilio.twiml.messaging_response import MessagingResponse
import google.oauth2.credentials
import google_auth_oauthlib.flow

from apiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
USERS_UPDATED_CHANNEL = 'users updated'

app = flask.Flask(__name__)

socketio = flask_socketio.SocketIO(app)
socketio.init_app(app, cors_allowed_origins="*")
dotenv_path = join(dirname(__file__), 'sql.env')
load_dotenv(dotenv_path)

twilio_account_sid = os.environ['TWILIO_ACCOUNT_SID']
twilio_auth_token = os.environ['TWILIO_AUTH_TOKEN']

database_uri = os.environ['DATABASE_URL']
app.config['SQLALCHEMY_DATABASE_URI'] = database_uri

db = flask_sqlalchemy.SQLAlchemy(app)
def init_db(app):
    db.init_app(app)
    db.app = app
    db.create_all()
    db.session.commit()
    
import bot as Bot
import models

def message_emit(channel):
    
    #Pull database updated with new todo list for user
    
    #socketio.emit(channel, {
    #    'updateTodoList': fromDatabase['todoList for user']
    #})
    print("message emitted")

@app.route('/', methods=['GET', 'POST'])
def hello():
    return flask.render_template('index.html')

#twilio

@app.route('/bot', methods=['POST'])
def bot():
    incoming_msg = request.values.get('Body', '').lower()
    resp = MessagingResponse()
    msg = resp.message()
    responded = False
    if 'help me' in incoming_msg:
        msg.body("Hello! I'm the agendasync textbot! My know commands are: 'add todo', 'delete todo, 'list todo', 'start date', and 'due date'")
        responded = True
    if 'add todo' in incoming_msg:
        try:
            if incoming_msg[8] == ' ' and incoming_msg[9] != ' ':
                message_body = incoming_msg[9:]
                
                #Database Insertion Code/Method goes here
                
                message_emit("todolist update")
                
                msg.body("Inserted: '" +  message_body + "' into your todolist!")
                responded = True
            else:
                msg.body("The proper add command is: add todo 'insert event here'")
                responded = True
        except:
            msg.body("The proper add command is: add todo 'insert event here'")
            responded = True
            
    if 'delete todo' in incoming_msg:
        try:
            if incoming_msg[11] == ' ' and incoming_msg[12] != ' ':
                message_body = incoming_msg[12:]
                
                #query for message_body in todolist table
                #if message_body not in table:
                    #msg.body("The event '" + message_body "' cannot be found in your todo list!")
                    #responded = True
                #else:
                    #delete item from db todolist
                
                message_emit("todolist update")
                
                msg.body("Deleted: '" +  message_body + "' from your todolist!")
                responded = True
            else:
                print("dumb")
                msg.body("The proper delete command is: delete todo 'insert event here'")
                responded = True
        except:
            msg.body("The proper delete command is: delete todo 'insert event here'")
            responded = True
            
    if 'list todo' in incoming_msg:
        try:
            msg.body("Your todolsit contents are as follows:")
            todoListString = ""
            
            #query database tables for todolist
            #for item in database:
            #    todoListString += (" * " + db.item + "\n")
            
            msg.body(todoListString)
            responded = True
            
        except:
            msg.body("The proper list command is: list todo")
            responded = True
            
    if 'start date' in incoming_msg:
        try:
            if incoming_msg[10] == ' ' and incoming_msg[11] != ' ':
                message_body = incoming_msg[11:]
                
                # query for message_body in todolist table
                #if message_body not in table:
                    #msg.body("The event '" + message_body "' cannot be found in your todo list!")
                    #responded = True
                
                #dbQuery = db.query
                
                msg.body("The start date of the event '" + message_body + "' is: ") # database query would go here
                responded = True
            else:
                msg.body("The proper start date command is: start date 'insert event here'")
                responded = True
        except:
            msg.body("The proper start date command is: start date 'insert event here'")
            responded = True
    
    if 'due date' in incoming_msg:
        try:
            if incoming_msg[8] == ' ' and incoming_msg[9] != ' ':
                message_body = incoming_msg[9:]
                
                # query for message_body in todolist table
                #if message_body not in table:
                    #msg.body("The event '" + message_body "' cannot be found in your todo list!")
                    #responded = True
                
                #dbQuery = db.query
                
                msg.body("The due date of the event '" + message_body + "' is ") # database query would go here
                responded = True
            else:
                msg.body("The proper due date command is: due date 'insert event here'")
                responded = True
        except:
            msg.body("The proper due date command is: due date 'insert event here'")
            responded = True
    if not responded:
        msg.body("I'm not sure I understand that, could you try again?")
    return str(resp)
    

def add_new_person_to_db(email):
        db.session.add(models.Person(email));
        db.session.commit();

def add_new_todo_to_db(todo, start_todo, due_date):
        db.session.add(models.Todo(todo, start_todo, due_date));
        db.session.commit();


@socketio.on("login with code")
def login(data):
    auth_code = data['code']
    print(auth_code)
    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
        'credentials.json',
        scopes=['openid', 'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/calendar.events',
        'https://www.googleapis.com/auth/calendar'],
        redirect_uri = "https://66b3860890e243e18ab6f0967df663ca.vfs.cloud9.us-east-1.amazonaws.com"
        )

    flow.fetch_token(code=auth_code)
    cred = flow.credentials
    
    service = build("calendar", "v3", credentials=cred)
    result = service.calendarList().list().execute()
    profileurl = "https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token={}".format(cred.token)
    profile = requests.get(profileurl)
    profile = profile.json()
    email = profile["email"]
    profile_id = profile["id"]
    print(email)
    print(profile_id)
    print(profileurl)
    loginUser="https://calendar.google.com/calendar/embed?src={}&ctz=America%2FNew_York".format(email)
    socketio.emit('googleCalendar', {
        'url':loginUser
        })
    calendar_id = result['items'][0]['id']
    result = service.events().list(calendarId=calendar_id).execute()
    
    #print(result['items'])
    add_new_person_to_db(email)

    socketio.emit('connected', {
        'calendarUpdate': result['items']
    })

@socketio.on("login with email")
def loginWithEmail(data):
    email = data['email']
    print(email)
    loginUser="https://calendar.google.com/calendar/embed?src={}&ctz=America%2FNew_York".format(email)
    socketio.emit('googleCalendar', {
        'url':loginUser
        })
    #add_new_person_to_db(email)
    #TODO: use email to retreive user info and tokens from database 
    # send stuff to frontend
    # do google calendar stuff
    

@socketio.on("addCalendarEvent")
def addCalendarEvent(data):
    print(data)
    
@socketio.on("addToDoList")
def addToDoList(data):
    print(data)
    startToDo = data["startDate"] #currently both times are in UTC
    endToDo = data["endDate"]
    desc = data["description"]
    startToDo = parser.isoparse(startToDo)
    endToDo = parser.isoparse(endToDo)
    print(startToDo)
    print(endToDo)
    #add_new_todo_to_db(desc,startToDo,endToDo)
if __name__ == '__main__':
    init_db(app)
    socketio.run(
        app,
        host=os.getenv('IP', '0.0.0.0'),
        port=int(os.getenv('PORT', 8080)),
        debug=True
    )
