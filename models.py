''' models.py '''

import datetime
from app import DB

start_date = datetime.datetime.utcnow()
start_date_est = start_date - datetime.timedelta(seconds=18000) #-5 hours
start_date_new = start_date_est.strftime('%m/%d/%Y %I:%M%p') #11/23/2020 05:48AM
end_date = start_date + datetime.timedelta(days=1)
end_date_est = end_date - datetime.timedelta(seconds=18000)
end_date_new = end_date_est.strftime('%m/%d/%Y %I:%M%p')

class Person(DB.Model):
    ''' Initialize Person Table with ID/Email/Todos/Credentials Columns '''
    id = DB.Column(DB.Integer, primary_key=True)
    email = DB.Column(DB.String(120), nullable=False)
    todos = DB.relationship('Todo', backref='person', lazy=True)
    cred = DB.Column(DB.PickleType)
    phone = DB.Column(DB.String(20))
class Todo(DB.Model):
    ''' Initialize Todo Table with person_Id/Todo/StartDate/DueDate Columns '''
    id = DB.Column(DB.Integer, primary_key=True)
    person_id = DB.Column(DB.Integer, DB.ForeignKey('person.id'))
    todo = DB.Column(DB.String(255), nullable=False)
    start_todo = DB.Column(DB.DateTime, default=start_date_new)
    due_date = DB.Column(DB.DateTime, default=end_date_new)
DB.create_all()
    