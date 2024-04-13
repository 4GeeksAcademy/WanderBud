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
    ubication = db.Column(db.String(250), nullable=False)

    def __repr__(self):
        return f'<User_Profile ID{self.id} {self.name}>'

    def serialize(self):
        return {
            "name": self.name,
            "last_name": self.last_name,
            "birthdate": self.birthdate,
            "ubication": self.ubication
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
    datetime = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.Enum("Planned","Completed","Canceled","In Progress", name="status"), nullable=False)
    description = db.Column(db.String(250), nullable=True)
    budget_per_person = db.Column(db.Float, nullable=True)
    event_type_id = db.Column(db.Integer, db.ForeignKey('event_type.id'), nullable=False)
    members = db.relationship('Event_Member', backref='event', lazy=True)
    petition_chat = db.relationship('Petition_Chat', backref='event', lazy=True, primaryjoin='Petition_Chat.event_id == Event.id')
    group_chat = db.relationship('Event_Chat', backref='event', lazy=True, primaryjoin='Event_Chat.event_id == Event.id')

    def __repr__(self):
        return f'<Event Id{self.id} {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
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
    status = db.Column(db.String(120), nullable=False)

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
    id_petition = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'))
    message = db.Column(db.String(250), nullable=False)
    def __repr__(self):
        return f'<Petition_Chat {self.id}>'
    def serialize(self):
        return {
            "id": self.id,
            "id_petition": self.id_petition,
            "user_id": self.user_id,
            "event_id": self.event_id,
            "message": self.message
        }
        
class Event_Chat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    message = db.Column(db.String(250), nullable=False)
    def __repr__(self):
        return f'<Event_Chat {self.id}>'
    def serialize(self):
        return {
            "id": self.id,
            "event_id": self.event_id,
            "user_id": self.user_id,
            "message": self.message
        }