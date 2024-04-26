import click
from api.models import db, User, User_Profile, Event
from api.models import Event_Type
from datetime import date, timedelta
import datetime



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


#This script will add demo data to the database: 
    
    @app.cli.command("insert-test-data")
    def insert_test_data():
        """ Este comando rellenará la base de datos con datos de ejemplo. """
        db.drop_all()
        db.create_all()
        try:
            users = [
                User(email="osianjorge@gmail.com",
                     password="1111",
                     is_active=True),
                User(email="wanderbud2024@gmail.com",
                     password="2222",
                     is_active=True),
                User(email="frank@gmail.com",
                     password="3333",
                     is_active=True),
                User(email="bruno@gmail.com",
                     password="4444",
                     is_active=True),
                User(email="lucia@gmail.com",
                     password="5555",
                     is_active=True),
                User(email="lavacapaca@gmail.com",
                    password="6666",
                    is_active=True)
                    # Add more users following the same structure
                     ]
            db.session.add_all(users)
            db.session.commit()
            
            user_profiles = [
                User_Profile(user=users[0], name="Osián", last_name="Chacho", birthdate=date.today() - timedelta(days=365*30), location="Huelva", description="Apasionado de la naturaleza y los deportes al aire libre, siempre buscando nuevas aventuras y emociones. Amante de la fotografía y la música indie, disfruto de cada momento con intensidad y creatividad.", profile_image="https://res.cloudinary.com/dkfphx3dm/image/upload/v1713952301/ImageUploaderReact/cuv6nypjzdsll5s6iccu.jpg"),
                User_Profile(user=users[1], name="Wander", last_name="Bud", birthdate=date.today() - timedelta(days=365*30), location="NewYork", description="Explorador incansable con una pasión por descubrir nuevas culturas y sabores. Adicto al café y los libros, me encanta perderme en las páginas de novelas de misterio y viajar a través de las historias.", profile_image="https://res.cloudinary.com/dkfphx3dm/image/upload/v1713982483/ImageUploaderReact/yld55gyvpvcerl5jenco.png"),
                User_Profile(user=users[2], name="Frank", last_name="Pana", birthdate=date.today() - timedelta(days=365*40), location="Madrid", description="Con una mente inquieta y curiosa, siempre buscando desafíos intelectuales y nuevas experiencias. Apasionado de la tecnología y los videojuegos, disfruto de cada día como una oportunidad para aprender algo nuevo.", profile_image="https://res.cloudinary.com/dkfphx3dm/image/upload/v1713896457/ImageUploaderReact/kblcrkev9sohkufkolav.jpg"),
                User_Profile(user=users[3], name="Bruno", last_name="Cachai", birthdate=date.today() - timedelta(days=365*40), location="Barcelona", description="Amante de la buena comida y la vida tranquila, disfruto de los placeres simples y las conversaciones profundas. Aficionado al cine clásico y los paseos por la ciudad, encuentro belleza en los detalles cotidianos.", profile_image="https://res.cloudinary.com/dkfphx3dm/image/upload/v1713981094/ImageUploaderReact/cgmvwdsmsshmhn4viqor.png"),
                User_Profile(user=users[4], name="Lucia", last_name="Illo", birthdate=date.today() - timedelta(days=365*40), location="Cádiz", description="Con una personalidad extrovertida y un sentido del humor contagioso, siempre estoy rodeado de amigos y risas. Apasionado por la música en vivo y los eventos culturales, cada día es una nueva oportunidad para disfrutar de la vida.", profile_image="https://res.cloudinary.com/dkfphx3dm/image/upload/v1713498959/ImageUploaderReact/ky9kzyqaxiohs0z5kwc0.png"),
                User_Profile(user=users[5], name="Lavaca", last_name="Paca", birthdate=date.today() - timedelta(days=365*40), location="Teherán", description="Inspirado por la creatividad y la expresión artística, busco constantemente nuevas formas de compartir mi visión del mundo. Aficionado a la pintura y la poesía, encuentro belleza en los pequeños momentos y las grandes ideas.", profile_image="https://res.cloudinary.com/dkfphx3dm/image/upload/v1713898041/ImageUploaderReact/nxmnwknjnjwh6nzqqw2h.jpg"),
      # Add more user profiles following the same structure
                ]
            db.session.add_all(user_profiles)
            db.session.commit()
            
            event_types = [
                Event_Type(name="Cine"),
                Event_Type(name="Bar"),
                Event_Type(name="Surf"),
                Event_Type(name="Concert"),
                Event_Type(name="Exhibition"),
                Event_Type(name="Sports"),
                Event_Type(name="Party"),
                Event_Type(name="Theater"),
                Event_Type(name="Conference"),
                Event_Type(name="Workshop")
                ]
          

        
            for event_type in event_types:
                db.session.add(event_type)
                db.session.commit()

            events = [
                Event(owner=users[1], name="Carrera Popular", location="Campo Grande, Valladolid", start_datetime=datetime.datetime(year=2024, month=5, day=12, hour=9), end_datetime=datetime.datetime(year=2024, month=5, day=12, hour=11), status="Planned", description="Carrera de 5km por una causa benéfica", budget_per_person=10.0, event_type=event_types[0]),
                Event(owner=users[1], name="Visita guiada al Museo del Prado", location="Museo del Prado, Madrid", start_datetime=datetime.datetime(year=2024, month=6, day=10, hour=11), end_datetime=datetime.datetime(year=2024, month=6, day=10, hour=13), status="Planned", description="Visita guiada para conocer los secretos del museo", budget_per_person=20.0, event_type=event_types[1]),
                Event(owner=users[2], name="Ruta por la Sierra de Gredos", location="Sierra de Gredos, Ávila", start_datetime=datetime.datetime(year=2024, month=7, day=15, hour=8), end_datetime=datetime.datetime(year=2024, month=7, day=17, hour=18), status="Planned", description="Fin de semana de senderismo por la sierra", budget_per_person=50.0, event_type=event_types[2]),
                Event(owner=users[5], name="Concierto de Rock", location="Estadio Metropolitano, Madrid", start_datetime=datetime.datetime(year=2024, month=5, day=25, hour=21), end_datetime=datetime.datetime(year=2024, month=5, day=26, hour=1), status="Planned", description="Gran concierto con las mejores bandas del rock nacional", budget_per_person=35.0, event_type=event_types[1]),
                Event(owner=users[3], name="Taller de Cocina Italiana", location="Escuela de Cocina La Cucina, Barcelona", start_datetime=datetime.datetime(year=2024, month=6, day=8, hour=18), end_datetime=datetime.datetime(year=2024, month=6, day=8, hour=21), status="Planned", description="Aprende a elaborar los platos más típicos de la cocina italiana", budget_per_person=25.0, event_type=event_types[3]),
                Event(owner=users[3], name="Charla sobre Inteligencia Artificial", location="Auditorio Universidad Complutense, Madrid", start_datetime=datetime.datetime(year=2024, month=6, day=15, hour=10), end_datetime=datetime.datetime(year=2024, month=6, day=11, hour=12), status="Planned", description="Conoce las últimas novedades en el campo de la IA", budget_per_person=15.0, event_type=event_types[2]),
                Event(owner=users[2], name="Festival de Cine Independiente", location="Teatro Principal, Zaragoza", start_datetime=datetime.datetime(year=2024, month=7, day=3, hour=17), end_datetime=datetime.datetime(year=2024, month=7, day=7, hour=22), status="Planned", description="Disfruta de una selección de las mejores películas independientes", budget_per_person=20.0, event_type=event_types[0]),
                Event(owner=users[4], name="Curso de Fotografía Básica", location="Centro Cultural San Marcos, León", start_datetime=datetime.datetime(year=2024, month=7, day=10, hour=10), end_datetime=datetime.datetime(year=2024, month=7, day=14, hour=13), status="Planned", description="Aprende los fundamentos de la fotografía digital", budget_per_person=40.0, event_type=event_types[3]),
                Event(owner=users[1], name="Excursión a las Islas Baleares", location="Mallorca, España", start_datetime=datetime.datetime(year=2024, month=8, day=1, hour=8), end_datetime=datetime.datetime(year=2024, month=8, day=7, hour=18), status="Planned", description="Disfruta de las playas y la cultura de las Islas Baleares", budget_per_person=150.0, event_type=event_types[0])
                ]            
            db.session.add_all(events)
            db.session.commit()

        
            print("Demo database successfully created.")
        except Exception as e:
            db.session.rollback()
            print(f"Error while running the script: {e}")
