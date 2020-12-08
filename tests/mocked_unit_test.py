import sys
import os
from os.path import join, dirname
import unittest
import unittest.mock as mock
from unittest.mock import patch
from unittest.mock import MagicMock
sys.path.insert(1, join(dirname(__file__), "../"))
from flask import Flask, session
import app

INPUT = "input"
CODE = "code"
HTTP = "http"
NAME = "name"
PROFILE = "profile"
EMAIL= "email"
TOKEN = "token"
DATE = "2020-11-13 19:08:57.739000"
ID="123"
ADD_TODO = "add todo buy pie"
LIST_TODO = "list todo"
START_TODO = "start date "+DATE
DUE_DATE = "due date "+DATE
HELP_ME = 'help me'
BAD_MESSAGE = "start add list"
RESPONSE = "response"
ADD_RESPONSE = "Inserted: 'buy pie' into your todolist with a due date of tomorrow"
HELP_RESPONSE = "Hello! I'm the agendasync textbot!My know commands are: 'add todo', add todo endless, mark complete, 'delete todo, 'list todo' ,'start date', and 'due date','add calendar', and 'update calendar [event/date]'"
LIST_RESPONSE = "Your todo list contents are as follows: buy shoe"
START_RESPONSE = "The start date of the event '" + DATE + "' is: "
DUE_RESPONSE = "The due date of the event '" + DATE + "' is "
BAD_RESPONSE = "I'm not sure I understand that, could you try again?"
ADD_TODO_ENDLESS = "add todo endless"
RESPONSE_ENDLESS="Please provide an argument to the command: 'add todo endless'"
UPDATE_TODO = 'update todo'
DELETE_TODO = "delete todo"
MARK_COMPLETE = "mark complete"
RESPONSE_COMPLETE = "buy shoe"
RESPONSE_CALENDAR="Please provide an argument to the command: 'add calendar'"
LIST_TODO = "list todo"
START_DATE = "start date"
DUE_DATE = "due date"
HELP_ME = "help me"
ADD_CALENDAR = "add calendar"
UPDATE_CALENDAR = "update calendar"
class MockedUnitTestCase(unittest.TestCase):
    def setUp(self):
         
        self.success_login_with_code = [
                {
                    INPUT:{
                        CODE:"1234",
                        HTTP:"httptest"
                    },
                    PROFILE:{
                        EMAIL:"sb989@njit.edu"
                    }   
                },
                {
                    INPUT:{
                        CODE:"1234",
                        HTTP:"httptest"
                    },
                    PROFILE:{
                        EMAIL:"bobby@njit.edu"
                    }   
                }
            ]
        self.success_login_with_email = [
            {
                INPUT:{
                    EMAIL:"sb989@njit.edu"
                },
                TOKEN:"1234"
            }
            ]
        self.success_test_all_todos = [
            {
                INPUT:{
                    EMAIL:"sb989@njit.edu"
                }
            }
        ]
        self.success_bot = [
            {
                INPUT:ADD_TODO,
                RESPONSE:ADD_RESPONSE
            },
            {
                INPUT:LIST_TODO,
                RESPONSE:LIST_RESPONSE
            },
            {
                INPUT:ADD_TODO_ENDLESS,
                RESPONSE:RESPONSE_ENDLESS
            },
            {
                INPUT:MARK_COMPLETE,
                RESPONSE:RESPONSE_COMPLETE
            },
            {
                INPUT:UPDATE_TODO,
                RESPONSE:RESPONSE_COMPLETE
                
            },
            {
                INPUT:DELETE_TODO,
                RESPONSE:RESPONSE_COMPLETE
            },
            {
                INPUT:HELP_ME,
                RESPONSE:HELP_RESPONSE
            },
            {
                INPUT:ADD_CALENDAR,
                RESPONSE:RESPONSE_CALENDAR
            },
            {
                INPUT: DUE_DATE,
                RESPONSE: "Please provide an argument to the command: 'due date'"
            },
            {
                INPUT: START_DATE,
                RESPONSE: "Please provide an argument to the command: 'start date'"
            },
            {
                INPUT:BAD_MESSAGE,
                RESPONSE:BAD_RESPONSE
            }
            
        ]
        self.success_test_params_months = [
            {
                INPUT: {
                    "currMonth": "Jan",
                    "prevMonth": "Dec",
                    "padding": "done",
                    "email": "zfh4@njit.edu"
                },
                RESPONSE: "done"
            }
            ]
        self.body = ""

    def get_emails(self):
        return ["sb989@njit.edu","surindraboodhoo@gmail.com"]
        
    # def test_send_calendar(self):
    #     for test in self.success_test_params_months:
    #         with patch("app.parser.isoparse") as iso, \
    #         patch("app.get_cred_from_email") as cremail, \
    #         patch("app.get_person_object") as getobj, \
    #         patch("app.datetime") as datetime:
                
    #             app.send_new_calendar_info(test[INPUT])
        
    def test_login_with_code_success(self):
        for test in self.success_login_with_code:
            with patch("google_auth_oauthlib.flow") as flow,\
            patch("app.requests") as requests,\
            patch("googleapiclient.discovery.Resource") as build,\
            patch("app.update_tokens_in_db") as update_tokens,\
            patch("app.get_all_emails") as get_all_emails,\
            patch("app.add_new_person_to_db") as add_person,\
            patch("flask_socketio.emit") as emit:
                
                get_all_emails.side_effect = self.get_emails
                requests.get.return_value.value = test[PROFILE]
                requests.get.return_value.json.return_value = (
                    requests.get.return_value.value
                )
                app.login(test[INPUT])
                if(test[PROFILE][EMAIL] in self.get_emails()):
                    update_tokens.assert_called_once()
                else:
                    add_person.assert_called_once()
    
    # def test_login_with_email_success(self):
    #     for test in self.success_login_with_email:
    #         with patch("flask_socketio.SocketIO.emit") as emit,\
    #         patch("app.get_person_object") as get_person:
    #             get_person.return_value.cred.token = test[TOKEN]
    #             app.login_with_email(test[INPUT])
    #             emit.assert_called_once()
    
    def test_get_all_todos_success(self):
        for test in self.success_test_all_todos:
            with patch("sqlalchemy.orm.session.Session.query") as query,\
            patch("app.get_person_object") as get_person,\
            patch("flask_socketio.emit") as emit:
                Todo = MagicMock()
                Todo.todo = 'buy apples'
                Todo.start_todo.isoformat.return_value = '2020-11-13 19:08:57.739000'
                Todo.due_date.isoformat.return_value = '2020-11-13 19:08:57.739000'
                query.return_value.filter_by.return_value.all.return_value = {
                    Todo
                }
                app.get_all_todos(test[INPUT])
                emit.assert_called_once()
                get_person.assert_called_once()
                
    def setResponseBody(self,body):
        self.body = body
    def mock_get_all_todo_vals(self,email):
        return "buy shoe"
    def test_bot_success(self):
        for test in self.success_bot:
            with patch('app.request') as request,\
            patch("app.get_person_object_phone_number") as get_person,\
            patch("app.add_new_todo_to_db") as add_new_todo,\
            patch("app.get_all_todos_values") as get_all_todo_val,\
            patch("app.check_todo") as get_todo,\
            patch("app.due_date_todo") as dudate,\
            patch("app.start_date_todo") as stdate,\
            patch("app.MessagingResponse") as messResp:
                get_all_todo_val.side_effect = self.mock_get_all_todo_vals
                
                messResp.return_value.message.return_value.body.\
                    side_effect = self.setResponseBody
                # messResp.return_value.__str__.return_value = 
                request.values.get.return_value.lower.return_value = test[INPUT]
                app.bot()
                self.assertEqual(self.body,test[RESPONSE])
                
    def test_call_init_db(self):
        APP=MagicMock()
        with patch("flask_sqlalchemy.SQLAlchemy") as db:
            app.init_db(APP)
            
    def test_update_calendar_with_event(self):
        income_msg="event"
        email=MagicMock()
        mesg=MagicMock()
        
        with patch("app.get_person_object") as pers, \
        patch("googleapiclient.discovery.Resource") as build:
            app.update_calendar_event(income_msg,email,mesg)
    
    def test_update_calendar_start_date(self):
        income_msg="startdate"
        email=MagicMock()
        mesg=MagicMock()
        
        with patch("app.get_person_object") as pers, \
        patch("googleapiclient.discovery.Resource") as build, \
        patch("app.datetime") as datetime:
            app.update_calendar_event(income_msg,email,mesg)
            
    def test_update_calendar_end_date(self):
        income_msg="enddate"
        email=MagicMock()
        mesg=MagicMock()
        
        with patch("app.get_person_object") as pers, \
        patch("googleapiclient.discovery.Resource") as build, \
        patch("app.datetime") as datetime:
            app.update_calendar_event(income_msg,email,mesg)
            
            
    def add_new_to_do_db(self):
        todo=MagicMock()
        user_email=MagicMock()
        start=""
        end=""
        
        with patch("app.get_person_object") as pers, \
        patch("googleapiclient.discovery.Resource") as build, \
        patch("app.datetime") as datetime:
            app.add_new_todo_to_db(todo, user_email, start, end)
        app.add_new_todo_to_db_endless(todo, user_email, start,end)
    
        
if __name__ == "__main__":
    unittest.main
    print("test")
