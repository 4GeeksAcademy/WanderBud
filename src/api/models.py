import random
import datetime
from flask import current_app # type: ignore
from itsdangerous import URLSafeTimedSerializer as Serializer # type: ignore

from flask_sqlalchemy import SQLAlchemy # type: ignore


db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    user_profile = db.relationship('User_Profile', backref='user', lazy=True)
    user_event = db.relationship('Event', backref='owner', lazy=True)
    event_member = db.relationship('Event_Member', backref='user', lazy=True)
    petition_chat = db.relationship('Petition_Chat', backref='user', lazy=True, primaryjoin='Petition_Chat.user_id==User.id')
    group_chat = db.relationship('Event_Chat', backref='user', lazy=True, primaryjoin='Event_Chat.user_id==User.id')
    
    def generate_reset_token(self):
        serializer = Serializer(secret_key=current_app.config['JWT_SECRET_KEY'], salt=current_app.config['SECURITY_PASSWORD_SALT'])
        return serializer.dumps({'id': self.id})

    @staticmethod
    def verify_reset_token(token):
        s = Serializer(current_app.config['JWT_SECRET_KEY'])
        try:
            data = s.loads(token, salt=current_app.config['SECURITY_PASSWORD_SALT'], max_age=84600)
            user_id = data.get('id')
            if user_id:
                user = User.query.get(user_id)
                return user
        
        except:
            pass
        return None
    
        
    def __repr__(self):
        return f'<User ID {self.id} {self.email}>'

    
    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, it's a security breach
        }


class User_Profile(db.Model):
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    last_name = db.Column(db.String(120), nullable=False)
    birthdate = db.Column(db.Date, nullable=False)
    location = db.Column(db.String(250), nullable=False)
    description = db.Column(db.String(500), nullable=False)
    profile_image = db.Column(db.String(250), nullable=False)
    cover_image = db.Column(db.String(250), nullable=True)

    def __repr__(self):
        return f'<User_Profile ID{self.user_id} {self.name}>'

    def serialize(self):
        return {
            "name": self.name,
            "last_name": self.last_name,
            "birthdate": self.birthdate,
            "location": self.location,
            "description": self.description,
            "profile_image": self.profile_image,
            "cover_image": self.cover_image
        }


class Event_Type(db.Model):
    __tablename__ = 'event_type'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    events = db.relationship('Event', primaryjoin='Event.event_type_id==Event_Type.id', backref='event_type')

    def __repr__(self):
        return f'<Event_Type ID {self.id} {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name
        }


class Event(db.Model):
    __tablename__ = 'event'
     
    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(120), nullable=False)
    location = db.Column(db.String(250), nullable=False)
    start_datetime = db.Column(db.DateTime, nullable=False)
    end_datetime = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.Enum("Planned","Completed","Canceled","In Progress", name="status"), nullable=False, default="Planned")
    description = db.Column(db.String(250), nullable=True)
    budget_per_person = db.Column(db.Float, nullable=True)
    event_type_id = db.Column(db.Integer, db.ForeignKey('event_type.id'), nullable=False)
    members = db.relationship('Event_Member', backref='event', lazy=True)
    petition_chat = db.relationship('Petition_Chat', backref='event', lazy=True, primaryjoin='Petition_Chat.event_id == Event.id')
    group_chat = db.relationship('Event_Chat', backref='event', lazy=True, primaryjoin='Event_Chat.chat_event_id == Event.id')

    def __repr__(self):
        return f'<Event Id{self.id} {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "owner": self.owner_id,
            "name": self.name,
            "location": self.location,
            "date": self.date,
            "status": self.status,
            "description": self.description,
            "budget_per_person": self.budget_per_person,
            "event_type_id": self.event_type_id,
        }


class Event_Member(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    member_status = db.Column(db.Enum("Applied","Owner","Accepted","Rejected", name="member_status"), nullable=False)

    def __repr__(self):
        return f'<Event_Member {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "event_id": self.event_id,
            "user_id": self.user_id,
            "status": self.status
        }

class Petition_Chat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    chat_id_petition = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'))
    message = db.Column(db.String(250), nullable=False)
    def __repr__(self):
        return f'<Petition_Chat {self.id}>'
    def serialize(self):
        return {
            "id": self.id,
            "chat_id_petition": self.chat_id_petition,
            "user_id": self.user_id,
            "event_id": self.event_id,
            "message": self.message
        }
        
class Event_Chat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    chat_event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    message = db.Column(db.String(250), nullable=False)
    def __repr__(self):
        return f'<Event_Chat {self.id}>'
    def serialize(self):
        return {
            "id": self.id,
            "chat_event_id": self.chat_event_id,
            "user_id": self.user_id,
            "message": self.message
        }
