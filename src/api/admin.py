  
import os
from flask_admin import Admin
from .models import db, User, User_Profile, Event, Event_Member, Event_Type, UsersPrivateChat, UsersGroupChat, PrivateChat, GroupChat, Message, UserProfileImage
from flask_admin.contrib.sqla import ModelView

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    
    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(ModelView(User, db.session))
    admin.add_view(ModelView(User_Profile, db.session))
    admin.add_view(ModelView(Event, db.session))
    admin.add_view(ModelView(Event_Member, db.session))
    admin.add_view(ModelView(Event_Type, db.session))
    admin.add_view(ModelView(PrivateChat, db.session))
    admin.add_view(ModelView(UsersPrivateChat, db.session))
    admin.add_view(ModelView(GroupChat, db.session))
    admin.add_view(ModelView(UsersGroupChat, db.session))
    admin.add_view(ModelView(Message, db.session))
    admin.add_view(ModelView(UserProfileImage, db.session))

    # You can duplicate that line to add mew models
    # admin.add_view(ModelView(YourModelName, db.session))