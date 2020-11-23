''' models.py '''

import datetime
from app import DB

start_date = datetime.datetime.utcnow()
end_date = start_date + datetime.timedelta(days=1)

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
    start_todo = DB.Column(DB.DateTime, default=start_date)
    due_date = DB.Column(DB.DateTime, default=end_date)

def createModels():
    ''' Initialize Person Table with ID/Email/Todos/Credentials Column '''
    
DB.create_all()
    