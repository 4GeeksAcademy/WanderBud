import click
from api.models import db, User, User_Profile, Event, Event_Member, Event_Type, UsersPrivateChat, UsersGroupChat, PrivateChat, GroupChat, Message
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
                     password="Osian42++",
                     is_active=True),
                User(email="wanderbud2024@gmail.com",
                     password="wander52++",
                     is_active=True),
                User(email="frankluis1923@gmail.com",
                     password="Frank32++",
                     is_active=True),
                User(email="b.muruacarreras@gmail.com",
                     password="Bruno22++",
                     is_active=True),
                User(email="lucy_daldeau@outlook.com",
                     password="Lucia30++",
                     is_active=True),
                User(email="lavacapaca@gmail.com",
                    password="Paca62++",
                    is_active=True),
                User(id=1,
                     email="system@system.com",
                     password="system",
                     is_active=True)
                    # Add more users following the same structure
                 User(email="cristianoronaldo@gmail.com",
                     password="Cristiano32++",
                     is_active=True),    
                 User(email="lionelmessi@gmail.com",
                     password="Messi32++",
                     is_active=True),    
                 User(email="socrates@gmail.com",
                     password="Socrates62++",
                     is_active=True),    
                 User(email="curie@gmail.com",
                     password="Curie42++",
                     is_active=True),    
                     ]
            db.session.add_all(users)
            db.session.commit()
            
            user_profiles = [
                User_Profile(user=users[0], name="Osián", last_name="Chacho", birthdate=date.today() - timedelta(days=365*30), location="Huelva ,Spain", description="Apasionado de la naturaleza y los deportes al aire libre, siempre buscando nuevas aventuras y emociones. Amante de la fotografía y la música indie, disfruto de cada momento con intensidad y creatividad.", profile_image="https://res.cloudinary.com/dkfphx3dm/image/upload/v1713952301/ImageUploaderReact/cuv6nypjzdsll5s6iccu.jpg"),
                User_Profile(user=users[1], name="Wander", last_name="Bud", birthdate=date.today() - timedelta(days=365*30), location="New York, USA", description="Explorador incansable con una pasión por descubrir nuevas culturas y sabores. Adicto al café y los libros, me encanta perderme en las páginas de novelas de misterio y viajar a través de las historias.", profile_image="https://res.cloudinary.com/dkfphx3dm/image/upload/v1713982483/ImageUploaderReact/yld55gyvpvcerl5jenco.png"),
                User_Profile(user=users[2], name="Frank", last_name="Pana", birthdate=date.today() - timedelta(days=365*40), location="Madrid, Spain", description="Con una mente inquieta y curiosa, siempre buscando desafíos intelectuales y nuevas experiencias. Apasionado de la tecnología y los videojuegos, disfruto de cada día como una oportunidad para aprender algo nuevo.", profile_image="https://res.cloudinary.com/dkfphx3dm/image/upload/v1713896457/ImageUploaderReact/kblcrkev9sohkufkolav.jpg"),
                User_Profile(user=users[3], name="Bruno", last_name="Cachai", birthdate=date.today() - timedelta(days=365*40), location="Barcelona, Spain", description="Amante de la buena comida y la vida tranquila, disfruto de los placeres simples y las conversaciones profundas. Aficionado al cine clásico y los paseos por la ciudad, encuentro belleza en los detalles cotidianos.", profile_image="https://res.cloudinary.com/dkfphx3dm/image/upload/v1713981094/ImageUploaderReact/cgmvwdsmsshmhn4viqor.png"),
                User_Profile(user=users[4], name="Lucia", last_name="Illo", birthdate=date.today() - timedelta(days=365*40), location="Cádiz, Spain", description="Con una personalidad extrovertida y un sentido del humor contagioso, siempre estoy rodeado de amigos y risas. Apasionado por la música en vivo y los eventos culturales, cada día es una nueva oportunidad para disfrutar de la vida.", profile_image="https://res.cloudinary.com/dkfphx3dm/image/upload/v1713498959/ImageUploaderReact/ky9kzyqaxiohs0z5kwc0.png"),
                User_Profile(user=users[5], name="Sixto", last_name="System", birthdate=date.today() - timedelta(days=365*40), location="Teherán, Spain", description="Inspirado por la creatividad y la expresión artística, busco constantemente nuevas formas de compartir mi visión del mundo. Aficionado a la pintura y la poesía, encuentro belleza en los pequeños momentos y las grandes ideas.", profile_image="https://res.cloudinary.com/dkfphx3dm/image/upload/v1713898041/ImageUploaderReact/nxmnwknjnjwh6nzqqw2h.jpg"),
                User_Profile(user=users[6], name="Lavaca", last_name="Paca", birthdate=date.today() - timedelta(days=365*40), location="Teherán, Spain", description="Inspirado por la creatividad y la expresión artística, busco constantemente nuevas formas de compartir mi visión del mundo. Aficionado a la pintura y la poesía, encuentro belleza en los pequeños momentos y las grandes ideas.", profile_image="https://res.cloudinary.com/dkfphx3dm/image/upload/v1713898041/ImageUploaderReact/nxmnwknjnjwh6nzqqw2h.jpg"),
                User_Profile(user=users[7], name="Lavaca", last_name="Paca", birthdate=date.today() - timedelta(days=365*40), location="Teherán, Spain", description="Inspirado por la creatividad y la expresión artística, busco constantemente nuevas formas de compartir mi visión del mundo. Aficionado a la pintura y la poesía, encuentro belleza en los pequeños momentos y las grandes ideas.", profile_image="https://res.cloudinary.com/dkfphx3dm/image/upload/v1713898041/ImageUploaderReact/nxmnwknjnjwh6nzqqw2h.jpg"),
                User_Profile(user=users[8], name="Lavaca", last_name="Paca", birthdate=date.today() - timedelta(days=365*40), location="Teherán, Spain", description="Inspirado por la creatividad y la expresión artística, busco constantemente nuevas formas de compartir mi visión del mundo. Aficionado a la pintura y la poesía, encuentro belleza en los pequeños momentos y las grandes ideas.", profile_image="https://res.cloudinary.com/dkfphx3dm/image/upload/v1713898041/ImageUploaderReact/nxmnwknjnjwh6nzqqw2h.jpg"),
                User_Profile(user=users[9], name="Lavaca", last_name="Paca", birthdate=date.today() - timedelta(days=365*40), location="Teherán, Spain", description="Inspirado por la creatividad y la expresión artística, busco constantemente nuevas formas de compartir mi visión del mundo. Aficionado a la pintura y la poesía, encuentro belleza en los pequeños momentos y las grandes ideas.", profile_image="https://res.cloudinary.com/dkfphx3dm/image/upload/v1713898041/ImageUploaderReact/nxmnwknjnjwh6nzqqw2h.jpg"),
                User_Profile(user=users[10], name="Lavaca", last_name="Paca", birthdate=date.today() - timedelta(days=365*40), location="Teherán, Spain", description="Inspirado por la creatividad y la expresión artística, busco constantemente nuevas formas de compartir mi visión del mundo. Aficionado a la pintura y la poesía, encuentro belleza en los pequeños momentos y las grandes ideas.", profile_image="https://res.cloudinary.com/dkfphx3dm/image/upload/v1713898041/ImageUploaderReact/nxmnwknjnjwh6nzqqw2h.jpg"),
      # Add more user profiles following the same structure
                ]
            db.session.add_all(user_profiles)
            db.session.commit()
            
            event_types = [
                Event_Type(name="Marathon", image="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1714678244/running-6660185_1920_khdpna.jpg"),
                Event_Type(name="Cine", image="https://res.cloudinary.com/dkfphx3dm/image/upload/v1714594869/movie-1328405_1920_qbluet.jpg"),
                Event_Type(name="Bar", image="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1714594869/pub-2243488_1920_lmbpfo.jpg"),
                Event_Type(name="Surf", image="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1714594866/surfing-926822_1920_gkf5wr.jpg"),
                Event_Type(name="Concert", image="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1714594867/audience-1867754_1920_itdqpm.jpg"),
                Event_Type(name="Exhibition", image="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1714594867/bilbao-3631257_1920_z6hn7g.jpg"),
                Event_Type(name="Sports", image="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1714594868/cycling-8215968_1920_tdxwmf.jpg"),
                Event_Type(name="Party", image="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1714594868/drinks-2578446_1920_hrbze6.jpg"),
                Event_Type(name="Theater", image="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1714594869/movie-theater-4609877_1920_fnekrc.jpg"),
                Event_Type(name="Conference", image="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1714594868/tables-5585970_1920_oy8bey.jpg"),
                Event_Type(name="Workshop", image="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1714594868/conference-1886021_1920_m0k5ny.jpg"),
                Event_Type(name="Music", image="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1714369487/ImageUploaderReact/h9mhxpwtcgqzpu8rhhjn.jpg"),
                Event_Type(name="Food", image="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1714680562/pink-7499159_1920_ux0gim.jpg"),
                Event_Type(name="Art", image="https://res.cloudinary.com/dkfphx3dm/image/upload/v1714594868/man-6477113_1920_zza1s1.jpg"),
                Event_Type(name="Travel", image="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1714594867/backpacker-772991_1920_d2brql.jpg"),
                Event_Type(name="Technology", image="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1714680562/pink-7499159_1920_ux0gim.jpg"),
                Event_Type(name="Fashion", image="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1714680559/catwalk-1840941_1920_gpp6br.jpg"),
                Event_Type(name="Gaming", image="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1714680572/technology-3189176_1920_uecykg.jpg"),
                Event_Type(name="Networking", image="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1714594869/meeting-1015591_1920_gn3lpg.jpg")
                ]
          

        
            for event_type in event_types:
                db.session.add(event_type)
                db.session.commit()

            events = [
                Event(owner=users[1], name="Carrera Popular", location="Campo Grande, Valladolid, Spain", start_datetime=datetime.datetime(year=2024, month=5, day=12, hour=9), end_datetime=datetime.datetime(year=2024, month=5, day=12, hour=11), status="Planned", description="Carrera de 5km por una causa benéfica", budget_per_person=10.0, event_type=event_types[0],latitude=41.6525,longitude=-4.7237),
                Event(owner=users[1], name="Visita guiada al Museo del Prado", location="Museo del Prado, Madrid, Spain", start_datetime=datetime.datetime(year=2024, month=6, day=10, hour=11), end_datetime=datetime.datetime(year=2024, month=6, day=10, hour=13), status="Planned", description="Visita guiada para conocer los secretos del museo", budget_per_person=20.0, event_type=event_types[1], latitude=40.4138,longitude=-3.6922),
                Event(owner=users[2], name="Ruta por la Sierra de Gredos", location="Sierra de Gredos, Ávila, Spain", start_datetime=datetime.datetime(year=2024, month=7, day=15, hour=8), end_datetime=datetime.datetime(year=2024, month=7, day=17, hour=18), status="Planned", description="Fin de semana de senderismo por la sierra", budget_per_person=50.0, event_type=event_types[2],latitude=40.2828,longitude=-5.9226),
                Event(owner=users[3], name="Concierto de Vetusta Morla", location="Wizink Center, Madrid, Spain", start_datetime=datetime.datetime(year=2024, month=8, day=20, hour=21), end_datetime=datetime.datetime(year=2024, month=8, day=20, hour=23), status="Planned", description="Concierto de la banda de rock indie", budget_per_person=30.0, event_type=event_types[3],latitude=40.4168,longitude=-3.7038),
                Event(owner=users[4], name="Exposición de Picasso", location="Museo Picasso, Barcelona, Spain", start_datetime=datetime.datetime(year=2024, month=9, day=25, hour=10), end_datetime=datetime.datetime(year=2024, month=9, day=25, hour=12), status="Planned", description="Exposición de las obras maestras del artista", budget_per_person=15.0, event_type=event_types[4],latitude=41.3851,longitude=2.1734),
                Event(owner=users[5], name="Partido de fútbol", location="Estadio Santiago Bernabéu, Madrid, Spain", start_datetime=datetime.datetime(year=2024, month=10, day=30, hour=19), end_datetime=datetime.datetime(year=2024, month=10, day=30, hour=21), status="Planned", description="Partido de liga entre Real Madrid y FC Barcelona", budget_per_person=40.0, event_type=event_types[5], latitude=40.4530,longitude=-3.6883),
                Event(owner=users[1], name="Fiesta de Halloween", location="Discoteca Joy Eslava, Madrid, Spain", start_datetime=datetime.datetime(year=2024, month=11, day=30, hour=23), end_datetime=datetime.datetime(year=2024, month=11, day=1, hour=6), status="Planned", description="Fiesta temática de Halloween con música y baile", budget_per_person=25.0, event_type=event_types[6],latitude=40.4150,longitude=-3.7074),
                Event(owner=users[2], name="Obra de teatro clásico", location="Teatro Real, Madrid, Spain", start_datetime=datetime.datetime(year=2024, month=12, day=15, hour=20), end_datetime=datetime.datetime(year=2024, month=12, day=15, hour=22), status="Planned", description="Representación de una obra de teatro clásico", budget_per_person=35.0, event_type=event_types[7], latitude=40.4180,longitude=-3.7113),
                Event(owner=users[3], name="Conferencia sobre tecnología", location="Palacio de Congresos, Barcelona, Spain", start_datetime=datetime.datetime(year=2025, month=1, day=20, hour=10), end_datetime=datetime.datetime(year=2025, month=1, day=20, hour=12), status="Planned", description="Conferencia sobre las últimas tendencias tecnológicas", budget_per_person=20.0, event_type=event_types[8], latitude=41.3851,longitude=2.1734),
                Event(owner=users[4], name="Taller de cocina italiana", location="Escuela de Cocina, Barcelona, Spain", start_datetime=datetime.datetime(year=2025, month=2, day=25, hour=18), end_datetime=datetime.datetime(year=2025, month=2, day=25, hour=20), status="Planned", description="Taller práctico para aprender a cocinar platos italianos", budget_per_person=30.0, event_type=event_types[9], latitude=41.3851,longitude=2.1734),
                Event(owner=users[5], name="Otro evento sorpresa", location="Lugar secreto, Madrid, Spain", start_datetime=datetime.datetime(year=2025, month=3, day=30, hour=19), end_datetime=datetime.datetime(year=2025, month=3, day=30, hour=21), status="Planned", description="Evento sorpresa con actividades y regalos especiales", budget_per_person=25.0, event_type=event_types[10], latitude=40.4168,longitude=-3.7038),
                ]
            db.session.add_all(events)
            db.session.commit()
            
            event_member = [
                Event_Member(user=users[1], event=events[0], member_status="Owner"),
                Event_Member(user=users[1], event=events[1], member_status="Owner"),
                Event_Member(user=users[2], event=events[2], member_status="Owner"),
                Event_Member(user=users[3], event=events[3], member_status="Owner"),
                Event_Member(user=users[4], event=events[4], member_status="Owner"),
                Event_Member(user=users[5], event=events[5], member_status="Owner"),
                Event_Member(user=users[1], event=events[6], member_status="Owner"),
                Event_Member(user=users[2], event=events[7], member_status="Owner"),
                Event_Member(user=users[3], event=events[8], member_status="Owner"),
                Event_Member(user=users[4], event=events[9], member_status="Owner"),
                Event_Member(user=users[5], event=events[10], member_status="Owner"),
                Event_Member(user=users[0], event=events[0], member_status="Accepted"),
                Event_Member(user=users[2], event=events[0], member_status="Applied"),
                Event_Member(user=users[3], event=events[0], member_status="Applied"),
                Event_Member(user=users[4], event=events[0], member_status="Rejected"),
                Event_Member(user=users[5], event=events[0], member_status="Applied"),
            ]
            db.session.add_all(event_member)
            db.session.commit()
            
            private_chat = [
                PrivateChat(event=events[0], user=users[2]),
                PrivateChat(event=events[0], user=users[3]),
                PrivateChat(event=events[0], user=users[4]),
                PrivateChat(event=events[0], user=users[5])
                ]
            db.session.add_all(private_chat)
            db.session.commit()
            
            user_private_chat = [
                UsersPrivateChat(user=users[2], private_chat=private_chat[0]),
                UsersPrivateChat(user=users[1], private_chat=private_chat[0]),
                UsersPrivateChat(user=users[3], private_chat=private_chat[1]),
                UsersPrivateChat(user=users[1], private_chat=private_chat[1]),
                UsersPrivateChat(user=users[4], private_chat=private_chat[2]),
                UsersPrivateChat(user=users[1], private_chat=private_chat[2]),
                UsersPrivateChat(user=users[5], private_chat=private_chat[3]),
                UsersPrivateChat(user=users[1], private_chat=private_chat[3]),
                ]
            private_messages = [
                Message(sender=users[2], private_chat=private_chat[0], receiver=users[1] ,message="Hola, ¿cómo estás?, Me gustaría unirme a tu evento!" , group_type="Private"),
                Message(sender=users[1], private_chat=private_chat[0], receiver=users[2] ,message="¡Claro! Sería genial contar contigo. ¿Has visto a qué hora es?" , group_type="Private"),
                Message(sender=users[2], private_chat=private_chat[0], receiver=users[1] ,message="Sí, a las 8 PM. ¡Allí estaré!" , group_type="Private"),
                Message(sender=users[1], private_chat=private_chat[0], receiver=users[2] ,message="¡Perfecto! Nos vemos allí entonces." , group_type="Private"),
                
                Message(sender=users[3], private_chat=private_chat[1], receiver=users[1] ,message="Hola, ¿cómo estás?, Me gustaría unirme a tu evento!" , group_type="Private"),
                Message(sender=users[1], private_chat=private_chat[1], receiver=users[3] ,message="¡Hola! Claro, estás invitado. ¿Has visto a qué hora es?" , group_type="Private"),
                Message(sender=users[3], private_chat=private_chat[1], receiver=users[1] ,message="Sí, a las 8 PM. ¡Allí estaré!" , group_type="Private"),
                Message(sender=users[1], private_chat=private_chat[1], receiver=users[3] ,message="¡Excelente! Nos vemos allí." , group_type="Private"),
                
                Message(sender=users[4], private_chat=private_chat[2], receiver=users[1] ,message="Hola, ¿cómo estás?, Me gustaría unirme a tu evento!" , group_type="Private"),
                Message(sender=users[1], private_chat=private_chat[2], receiver=users[4] ,message="¡Hola! Claro, estás invitado. ¿Has visto a qué hora es?" , group_type="Private"),
                Message(sender=users[4], private_chat=private_chat[2], receiver=users[1] ,message="Lo siento, no podré asistir" , group_type="Private"),
                Message(sender=users[1], private_chat=private_chat[2], receiver=users[4] ,message="Qué lástima, espero verte en el próximo evento." , group_type="Private"),
                
                Message(sender=users[5], private_chat=private_chat[3], receiver=users[1] ,message="Hola, ¿cómo estás?, Me gustaría unirme a tu evento!" , group_type="Private"),
                Message(sender=users[1], private_chat=private_chat[3], receiver=users[5] ,message="¡Hola! Claro, estás invitado. ¿Has visto a qué hora es?" , group_type="Private"),
                Message(sender=users[5], private_chat=private_chat[3], receiver=users[1] ,message="Sí, a las 8 PM. ¡Allí estaré!" , group_type="Private"),
                Message(sender=users[1], private_chat=private_chat[3], receiver=users[5] ,message="¡Genial! Nos vemos allí." , group_type="Private"),
                
                ]
            db.session.add_all(user_private_chat)
            db.session.commit()
            
            group_chat = [
                 GroupChat(event=events[0]),
                 ]
            db.session.add_all(group_chat)
            db.session.commit()
            
            user_group_chat = [
                UsersGroupChat(user=users[1], group_chat=group_chat[0]),
                UsersGroupChat(user=users[0], group_chat=group_chat[0]),
                ]
            
            db.session.add_all(user_group_chat)
            db.session.commit()
            
            group_messages = [
                Message(sender=users[1], group_chat=group_chat[0], message="¡Hola a todos! ¿Están listos para el evento de mañana?" , group_type="Group"),
                Message(sender=users[0], group_chat=group_chat[0], message="¡Hola! Sí, estoy emocionado por la carrera." , group_type="Group"),
                ]
            db.session.add_all(group_messages)
            db.session.commit()

        
            print("Demo database successfully created.")
        except Exception as e:
            db.session.rollback()
            print(f"Error while running the script: {e}")
