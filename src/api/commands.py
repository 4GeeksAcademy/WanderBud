import click
from api.models import db, User, User_Profile, Event, Event_Member, Event_Type, UsersPrivateChat, UsersGroupChat, PrivateChat, GroupChat, Message, UserProfileImage
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
                    User(email="victoria@gmail.com",
                     password="Victoria32++",
                     is_active=True),
                    User(email="rose@gmail.com",
                     password="Rose32++",
                     is_active=True),
                    User(email="osianjorge@gmail.com",
                     password="Osian42++",
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
                    User(id=1,
                     email="system@system.com",
                     password="system",
                     is_active=True)    
                    ]
            db.session.add_all(users)
            db.session.commit()
            
            user_profiles = [
                            User_Profile(user=users[0], name="Victoria", last_name="Geek", birthdate=date.today() - timedelta(days=36540), location_name="Madrid, Spain", description="Inspired by creativity and artistic expression, I constantly seek new ways to share my vision of the world. Passionate about painting and poetry, I find beauty in small moments and big ideas.", profile_image="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1714638649/woman-5643994_1920_kkh51q.jpg", cover_image="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1714594866/beach-1838501_1920_ymnkzw.jpg"),
                            User_Profile(user=users[1], name="Rose", last_name="Witness Program", birthdate=date.today() - timedelta(days=36540), location_name="Medellin, Colombia", description="Inspired by creativity and artistic expression, I constantly seek new ways to share my vision of the world. Passionate about painting and poetry, I find beauty in small moments and big ideas.", profile_image="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1714638618/ai-generated-8625127_1920_zymolq.jpg", cover_image="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1714594866/surf-4087278_1920_rvyjbi.jpg"),
                            User_Profile(user=users[2], name="Osián", last_name="ElChacho", birthdate=date.today() - timedelta(days=36530), location_name="Las Palmas of Gran Canaria, Spain", description="Passionate about nature and outdoor sports, always seeking new adventures and thrills. A lover of photography and indie music, I savor every moment with intensity and creativity.", profile_image="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1714321607/ImageUploaderReact/f2uesux6rsxkl7nk03lz.jpg", cover_image="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1713498671/ImageUploaderReact/zilvnxxlvgmzcdmel5gh.jpg"),
                            User_Profile(user=users[3], name="Frank", last_name="MiPana", birthdate=date.today() - timedelta(days=36540), location_name="Caracas, Venezuela", description="With a restless and curious mind, always seeking intellectual challenges and new experiences. Passionate about technology and video games, I enjoy each day as an opportunity to learn something new.", profile_image="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1713896457/ImageUploaderReact/kblcrkev9sohkufkolav.jpg", cover_image="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1714594868/fireworks-1953253_1920_lhrgcv.jpg"),
                            User_Profile(user=users[4], name="Bruno", last_name="Cachai?", birthdate=date.today() - timedelta(days=36540), location_name="Barcelona, Spain", description="Lover of good food and a peaceful life, I savor the simple pleasures and deep conversations. Passionate about classic cinema and city walks, I find beauty in everyday details.", profile_image="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1713603974/ImageUploaderReact/b5zcll9p7f4ferf2mbui.png", cover_image="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1714594869/mobile-phone-1845233_1920_qcjqkz.jpg"),
                            User_Profile(user=users[5], name="Lucia", last_name="killa!", birthdate=date.today() - timedelta(days=36540), location_name="Cádiz, Spain", description="With an outgoing personality and a contagious sense of humor, I'm always surrounded by friends and laughter. Passionate about live music and cultural events, each day is a new opportunity to enjoy life.", profile_image="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1714638640/second-life-1625903_1920_xojejd.jpg", cover_image="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1714594867/audience-1850119_1920_rb2pdv.jpg")
                            
                          ]
            db.session.add_all(user_profiles)
            db.session.commit()
            
            profile_images = [
                            UserProfileImage(user=users[0], image_path="https://res.cloudinary.com/dkfphx3dm/image/upload/v1713005598/samples/food/spices.jpg"),
                            UserProfileImage(user=users[0], image_path="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1713005594/samples/animals/three-dogs.jpg"),
                            UserProfileImage(user=users[0], image_path="https://res.cloudinary.com/dkfphx3dm/image/upload/v1713005613/samples/two-ladies.jpg"),
                            UserProfileImage(user=users[0], image_path="https://res.cloudinary.com/dkfphx3dm/image/upload/v1713897740/ImageUploaderReact/orcynw7vl2oi3mfnlzaj.jpg"),
                            UserProfileImage(user=users[0], image_path="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1714498312/ImageUploaderReact/h9f9jzadlk4e6a3nbdzd.jpg"),
                            UserProfileImage(user=users[0], image_path="https://res.cloudinary.com/dkfphx3dm/image/upload/v1714594866/bar-4656332_1920_rcdddw.jpg"),
                            UserProfileImage(user=users[0], image_path="https://res.cloudinary.com/dkfphx3dm/image/upload/v1714633330/cat-7466429_1920_ixd8kb.jpg"),
                            UserProfileImage(user=users[0], image_path="https://res.cloudinary.com/dkfphx3dm/image/upload/v1714633330/cat-7466429_1920_ixd8kb.jpg")
                             ]
            
            db.session.add_all(profile_images)
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
                        Event(owner=users[5], name="Popular Race", location="Campo Grande, Valladolid, Spain", start_datetime=datetime.datetime(year=2024, month=5, day=12, hour=9), end_datetime=datetime.datetime(year=2024, month=5, day=12, hour=11), status="Planned", description="5km race for a charitable cause", budget_per_person=10.0, event_type=event_types[0], latitude=41.6525, longitude=-4.7237),
                        Event(owner=users[5], name="Guided Tour of the Prado Museum",location="C. de Ruiz de Alarcón, 23, Retiro, 28014 Madrid", location_name="Prado Museum, Madrid, Spain", start_datetime=datetime.datetime(year=2024, month=6, day=10, hour=11), end_datetime=datetime.datetime(year=2024, month=6, day=10, hour=13), status="Planned", description="Guided tour to discover the secrets of the museum", budget_per_person=20.0, event_type=event_types[13], latitude=40.4138, longitude=-3.6922),
                        Event(owner=users[2], name="Hike in the Sierra de Gredos",location="Sierra de Gredos, Ávila, Spain" ,location_name="Sierra de Gredos, Ávila, Spain", start_datetime=datetime.datetime(year=2024, month=7, day=15, hour=8), end_datetime=datetime.datetime(year=2024, month=7, day=17, hour=18), status="Planned", description="Weekend hiking trip in the mountains", budget_per_person=50.0, event_type=event_types[14], latitude=40.2828, longitude=-5.9226),
                        Event(owner=users[0], name="Arsawa Concert", location="Av. de Felipe II, s/n, Salamanca, 28009 Madrid" ,location_name="Wizink Center, Madrid, Spain", start_datetime=datetime.datetime(year=2024, month=8, day=20, hour=21), end_datetime=datetime.datetime(year=2024, month=8, day=20, hour=23), status="Planned", description="Concert by the indie rock band", budget_per_person=30.0, event_type=event_types[4], latitude=40.4168, longitude=-3.7038),
                        Event(owner=users[0], name="Picasso Exhibition", location="C/ de Montcada, 15-23, Ciutat Vella, 08003 Barcelona" ,location_name="Picasso Museum, Barcelona, Spain", start_datetime=datetime.datetime(year=2024, month=9, day=25, hour=10), end_datetime=datetime.datetime(year=2024, month=9, day=25, hour=12), status="Planned", description="Exhibition of the artist's masterpieces", budget_per_person=15.0, event_type=event_types[13], latitude=41.3851, longitude=2.1734),
                        Event(owner=users[0], name="Football Match",location="Av. de Concha Espina, 1, Chamartín, 28036 Madrid" ,location_name="Santiago Bernabéu Stadium, Madrid, Spain", start_datetime=datetime.datetime(year=2024, month=10, day=30, hour=19), end_datetime=datetime.datetime(year=2024, month=10, day=30, hour=21), status="Planned", description="League match between Real Madrid and FC Barcelona", budget_per_person=40.0, event_type=event_types[6], latitude=40.4530, longitude=-3.6883),
                        Event(owner=users[1], name="Halloween Party",location="C. del Arenal, 11, Centro, 28013 Madrid", location_name="Joy Eslava Nightclub, Madrid, Spain", start_datetime=datetime.datetime(year=2024, month=11, day=30, hour=23), end_datetime=datetime.datetime(year=2024, month=11, day=1, hour=6), status="Planned", description="Halloween-themed party with music and dancing", budget_per_person=25.0, event_type=event_types[7], latitude=40.4150, longitude=-3.7074),
                        Event(owner=users[1], name="Classic Theater Play", location="Pl. de Isabel II, s/n, Centro, 28013 Madrid" ,location_name="Teatro Real, Madrid, Spain", start_datetime=datetime.datetime(year=2024, month=12, day=15, hour=20), end_datetime=datetime.datetime(year=2024, month=12, day=15, hour=22), status="Planned", description="Performance of a classic theater play", budget_per_person=35.0, event_type=event_types[8], latitude=40.4180, longitude=-3.7113),
                        Event(owner=users[0], name="Technology Conference", location="Av. de la Reina Maria Cristina, s/n" ,location_name="Congress Palace, Barcelona, Spain", start_datetime=datetime.datetime(year=2025, month=1, day=20, hour=10), end_datetime=datetime.datetime(year=2025, month=1, day=20, hour=12), status="Planned", description="Conference on the latest technology trends", budget_per_person=20.0, event_type=event_types[9], latitude=41.3851, longitude=2.1734),
                        Event(owner=users[4], name="Italian Cooking Workshop", location_name="Cooking School, Barcelona, Spain", start_datetime=datetime.datetime(year=2025, month=2, day=25, hour=18), end_datetime=datetime.datetime(year=2025, month=2, day=25, hour=20), status="Planned", description="Hands-on workshop to learn how to cook Italian dishes", budget_per_person=30.0, event_type=event_types[12], latitude=41.3851, longitude=2.1734),
                        Event(owner=users[3], name="Surprise Event", location_name="Secret Locaion, Madrid, Spain", start_datetime=datetime.datetime(year=2025, month=3, day=30, hour=19), end_datetime=datetime.datetime(year=2025, month=3, day=30, hour=21), status="Planned", description="Surprise event with special activities and gifts", budget_per_person=25.0, event_type=event_types[7], latitude=40.4168, longitude=-3.7038)
                    ]
            db.session.add_all(events)
            db.session.commit()
            
            event_member = [
                        Event_Member(user=users[5], event=events[0], member_status="Owner"),
                        Event_Member(user=users[5], event=events[1], member_status="Owner"),
                        Event_Member(user=users[2], event=events[2], member_status="Owner"),
                        Event_Member(user=users[0], event=events[3], member_status="Owner"),
                        Event_Member(user=users[0], event=events[4], member_status="Owner"),
                        Event_Member(user=users[0], event=events[5], member_status="Owner"),
                        Event_Member(user=users[1], event=events[6], member_status="Owner"),
                        Event_Member(user=users[0], event=events[7], member_status="Owner"),
                        Event_Member(user=users[0], event=events[8], member_status="Owner"),
                        Event_Member(user=users[4], event=events[9], member_status="Owner"),
                        Event_Member(user=users[3], event=events[10], member_status="Owner"),
                        Event_Member(user=users[1], event=events[3], member_status="Accepted"),
                        Event_Member(user=users[2], event=events[3], member_status="Accepted"),
                        Event_Member(user=users[3], event=events[3], member_status="Accepted"),
                    ]
            db.session.add_all(event_member)
            db.session.commit()
            
            private_chat = [
                PrivateChat(event=events[3], user=users[1]),
                PrivateChat(event=events[3], user=users[2]),
                PrivateChat(event=events[3], user=users[3]),
                ]
            db.session.add_all(private_chat)
            db.session.commit()
            
            user_private_chat = [
                UsersPrivateChat(user=users[1], private_chat=private_chat[0]),
                UsersPrivateChat(user=users[0], private_chat=private_chat[0]),
                UsersPrivateChat(user=users[2], private_chat=private_chat[1]),
                UsersPrivateChat(user=users[0], private_chat=private_chat[1]),
                UsersPrivateChat(user=users[3], private_chat=private_chat[2]),
                UsersPrivateChat(user=users[0], private_chat=private_chat[2]),
                ]
            private_messages = [
                Message(sender=users[1], private_chat=private_chat[0], receiver=users[0] ,message="Hola, ¿cómo estás?, Me gustaría unirme a tu evento!" , group_type="Private"),
                Message(sender=users[0], private_chat=private_chat[0], receiver=users[1] ,message="¡Claro! Sería genial contar contigo. ¿Has visto a qué hora es?" , group_type="Private"),
                Message(sender=users[1], private_chat=private_chat[0], receiver=users[0] ,message="Sí, a las 8 PM. ¡Allí estaré!" , group_type="Private"),
                Message(sender=users[0], private_chat=private_chat[0], receiver=users[1] ,message="¡Perfecto! Nos vemos allí entonces." , group_type="Private"),
                
                Message(sender=users[2], private_chat=private_chat[1], receiver=users[0] ,message="Hola, ¿cómo estás?, Me gustaría unirme a tu evento!" , group_type="Private"),
                Message(sender=users[0], private_chat=private_chat[1], receiver=users[2] ,message="¡Hola! Claro, estás invitado. ¿Has visto a qué hora es?" , group_type="Private"),
                Message(sender=users[2], private_chat=private_chat[1], receiver=users[0] ,message="Sí, a las 8 PM. ¡Allí estaré!" , group_type="Private"),
                Message(sender=users[0], private_chat=private_chat[1], receiver=users[2] ,message="¡Excelente! Nos vemos allí." , group_type="Private"),
                
                Message(sender=users[3], private_chat=private_chat[2], receiver=users[0] ,message="Hola, ¿cómo estás?, Me gustaría unirme a tu evento!" , group_type="Private"),
                Message(sender=users[0], private_chat=private_chat[2], receiver=users[3] ,message="¡Hola! Claro, estás invitado. ¿Has visto a qué hora es?" , group_type="Private"),
                Message(sender=users[3], private_chat=private_chat[2], receiver=users[0] ,message="Lo siento, no podré asistir" , group_type="Private"),
                Message(sender=users[0], private_chat=private_chat[2], receiver=users[3] ,message="Qué lástima, espero verte en el próximo evento." , group_type="Private"),
                
                ]
            db.session.add_all(user_private_chat)
            db.session.commit()
            
            db.session.add_all(private_messages)
            db.session.commit()
            
            group_chat = [
                 GroupChat(event=events[0]),
                 GroupChat(event=events[1]),
                 GroupChat(event=events[2]),
                 GroupChat(event=events[3]),
                 GroupChat(event=events[4]),
                 GroupChat(event=events[5]),
                 GroupChat(event=events[6]),
                 GroupChat(event=events[7]),
                 GroupChat(event=events[8]),
                 GroupChat(event=events[9]),
                 GroupChat(event=events[10]),
                 ]
            db.session.add_all(group_chat)
            db.session.commit()
            
            user_group_chat = [
                UsersGroupChat(user=users[5], group_chat=group_chat[0]),
                UsersGroupChat(user=users[5], group_chat=group_chat[1]),
                UsersGroupChat(user=users[2], group_chat=group_chat[2]),
                UsersGroupChat(user=users[0], group_chat=group_chat[3]),
                UsersGroupChat(user=users[0], group_chat=group_chat[4]),
                UsersGroupChat(user=users[0], group_chat=group_chat[5]),
                UsersGroupChat(user=users[1], group_chat=group_chat[6]),
                UsersGroupChat(user=users[0], group_chat=group_chat[7]),
                UsersGroupChat(user=users[0], group_chat=group_chat[8]),
                UsersGroupChat(user=users[4], group_chat=group_chat[9]),
                UsersGroupChat(user=users[3], group_chat=group_chat[10]),
                UsersGroupChat(user=users[1], group_chat=group_chat[3]),
                UsersGroupChat(user=users[2], group_chat=group_chat[3]),
                UsersGroupChat(user=users[3], group_chat=group_chat[3]),
                ]
            
            db.session.add_all(user_group_chat)
            db.session.commit()
            
            group_messages = [
                Message(sender=users[6], group_chat=group_chat[3], message="Welcome to the Event" , group_type="Group"),
                Message(sender=users[0], group_chat=group_chat[3], message="Hi, everyone!! you guys ready for the concert!" , group_type="Group"),
                Message(sender=users[1], group_chat=group_chat[3], message="Hi! Yes, I am so excited" , group_type="Group"),
                ]
            db.session.add_all(group_messages)
            db.session.commit()

        
            print("Demo database successfully created.")
        except Exception as e:
            db.session.rollback()
            print(f"Error while running the script: {e}")
