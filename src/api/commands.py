
import click
from api.models import db, User
from api.models import Event_Type

"""
In this file, you can add as many commands as you want using the @app.cli.command decorator
Flask commands are usefull to run cronjobs or tasks outside of the API but sill in integration 
with youy database, for example: Import the price of bitcoin every night as 12am
"""
def setup_commands(app):
    
    """ 
    This is an example command "insert-test-users" that you can run from the command line
    by typing: $ flask insert-test-users 5
    Note: 5 is the number of users to add
    """
    @app.cli.command("insert-test-users") # name of our command
    @click.argument("count") # argument of out command
    def insert_test_users(count):
        print("Creating test users")
        for x in range(1, int(count) + 1):
            user = User()
            user.email = "test_user" + str(x) + "@test.com"
            user.password = "123456"
            user.is_active = True
            db.session.add(user)
            db.session.commit()
            print("User: ", user.email, " created.")

        print("All test users created")

    @app.cli.command("insert-test-data")
    def insert_test_data():
        print("Inserting test data for event types.")
        
        event_types = [
            {"name": "Birthday"},
            {"name": "Wedding"},
            {"name": "Graduation"},
            {"name": "Baby Shower"},
            {"name": "Bachelor Party"},
            {"name": "Bachelorette Party"},
            {"name": "Anniversary"},
            {"name": "Retirement Party"},
            {"name": "Engagement Party"},
            {"name": "Reunion"},
            {"name": "Corporate Event"},
            {"name": "Religious Event"},
            {"name": "Holiday Party"},
            {"name": "Sporting Event"},
            {"name": "Concert"},
            {"name": "Festival"},
            {"name": "Fundraiser"},
            {"name": "Expo"},
            {"name": "Conference"},
            {"name": "Seminar"},
            {"name": "Workshop"},
            {"name": "Networking Event"},
            {"name": "Trade Show"},
            {"name": "Product Launch"},
            {"name": "Fashion Show"},
            {"name": "Art Show"},
            {"name": "Film Screening"},
            {"name": "Theater Show"},
            {"name": "Comedy Show"},
            {"name": "Dance Show"},
            {"name": "Magic Show"},
            {"name": "Circus Show"},
            {"name": "Carnival"},
            {"name": "Fair"},
            {"name": "Parade"},
            {"name": "Street Festival"},
            {"name": "Block Party"},
            {"name": "Picnic"},
            {"name": "BBQ"},
            {"name": "Cookout"},
            {"name": "Potluck"},
            {"name": "Dinner Party"},
            {"name": "Brunch"},
            {"name": "Lunch"},
            {"name": "Breakfast"},
            {"name": "Happy Hour"},
            {"name": "Cocktail Party"},
            {"name": "Wine Tasting"},
            {"name": "Beer Tasting"},
            {"name": "Whiskey Tasting"},
            {"name": "Wine and Paint"},
            {"name": "Craft Night"},
            {"name": "DIY Night"},
            {"name": "Game Night"},
            {"name": "Trivia Night"},
            {"name": "Karaoke Night"},
            {"name": "Open Mic Night"},
            {"name": "Poetry Night"},
            {"name": "Book Club"},
            {"name": "Cinema"},
        ]

        for event_type_data in event_types:
            event_type = Event_Type(**event_type_data)
            db.session.add(event_type)
            db.session.commit()

        print("Test data for event types inserted.")