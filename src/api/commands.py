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
                     is_active=True),
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
                            User_Profile(user=users[0], name="Osián", last_name="Chacho", birthdate=date.today() - timedelta(days=36530), location="Huelva, Spain", description="Passionate about nature and outdoor sports, always seeking new adventures and thrills. A lover of photography and indie music, I savor every moment with intensity and creativity.", profile_image="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1714633687/ai-generated-8710183_1920_w8zhbw.jpg", cover_image="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1713498671/ImageUploaderReact/zilvnxxlvgmzcdmel5gh.jpg"),
                            User_Profile(user=users[1], name="Wander", last_name="Bud", birthdate=date.today() - timedelta(days=36530), location="New York, USA", description="Tireless explorer with a passion for discovering new cultures and flavors. Addicted to coffee and books, I love to get lost in the pages of mystery novels and travel through stories.", profile_image="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1714638637/man-8179421_1920_g47c3m.jpg", cover_image="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1713475838/ImageUploaderReact/bgz8imzxygasqkkwvj02.png"),
                            User_Profile(user=users[2], name="Frank", last_name="Pana", birthdate=date.today() - timedelta(days=36540), location="Madrid, Spain", description="With a restless and curious mind, always seeking intellectual challenges and new experiences. Passionate about technology and video games, I enjoy each day as an opportunity to learn something new.", profile_image="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1714633330/cat-7466429_1920_ixd8kb.jpg", cover_image="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1714594868/fireworks-1953253_1920_lhrgcv.jpg"),
                            User_Profile(user=users[3], name="Bruno", last_name="Cachai", birthdate=date.today() - timedelta(days=36540), location="Barcelona, Spain", description="Lover of good food and a peaceful life, I savor the simple pleasures and deep conversations. Passionate about classic cinema and city walks, I find beauty in everyday details.", profile_image="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1714632825/rabbit-7855464_1920_tzaeye.jpg", cover_image="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1714594869/mobile-phone-1845233_1920_qcjqkz.jpg"),
                            User_Profile(user=users[4], name="Lucia", last_name="Illo", birthdate=date.today() - timedelta(days=36540), location="Cádiz, Spain", description="With an outgoing personality and a contagious sense of humor, I'm always surrounded by friends and laughter. Passionate about live music and cultural events, each day is a new opportunity to enjoy life.", profile_image="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1714632366/fox-7468838_1280_vmawkk.jpg", cover_image="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1714594867/audience-1850119_1920_rb2pdv.jpg"),
                            User_Profile(user=users[5], name="Lavaca", last_name="Paca", birthdate=date.today() - timedelta(days=36540), location="Asturias, Spain", description="Inspired by creativity and artistic expression, I constantly seek new ways to share my vision of the world. Passionate about painting and poetry, I find beauty in small moments and big ideas.", profile_image="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1714638649/woman-5643994_1920_kkh51q.jpg", cover_image="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1714594866/beach-1838501_1920_ymnkzw.jpg"),
                            User_Profile(user=users[6], name="Sito", last_name="System", birthdate=date.today() - timedelta(days=36540), location="Las Palmas of Gran Canaria, Spain", description="Inspired by creativity and artistic expression, I constantly seek new ways to share my vision of the world. Passionate about painting and poetry, I find beauty in small moments and big ideas.", profile_image="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1714638620/ai-generated-8672065_1920_ufxmxh.jpg", cover_image="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1714594866/surf-4087278_1920_rvyjbi.jpg"),
                            User_Profile(user=users[7], name="Cristiano", last_name="Potaldo", birthdate=date.today() - timedelta(days=36540), location="Madeira, Portugal", description="Inspired by creativity and artistic expression, I constantly seek new ways to share my vision of the world. Passionate about painting and poetry, I find beauty in small moments and big ideas.", profile_image="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1714638657/ai-generated-8523328_1920_ajxx3k.jpg", cover_image="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1714594866/surf-4087278_1920_rvyjbi.jpg"),
                            User_Profile(user=users[8], name="Lionel", last_name="Pessi", birthdate=date.today() - timedelta(days=36540), location="Rosario, Argentina", description="Inspired by creativity and artistic expression, I constantly seek new ways to share my vision of the world. Passionate about painting and poetry, I find beauty in small moments and big ideas.", profile_image="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1714638652/ai-generated-8072872_1920_fqlr5h.jpg", cover_image="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1713005613/samples/balloons.jpg"),
                            User_Profile(user=users[9], name="Sócrates", last_name="Sofronisco", birthdate=date.today() - timedelta(days=36540), location="Warsaw, Poland", description="Inspired by creativity and artistic expression, I constantly seek new ways to share my vision of the world. Passionate about painting and poetry, I find beauty in small moments and big ideas.", profile_image="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1714638623/artificial-intelligence-7342613_1920_w6epmb.jpg", cover_image="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1713005599/samples/animals/kitten-playing.gif"),
                            User_Profile(user=users[10], name="Maria", last_name="Salomé", birthdate=date.today() - timedelta(days=365*40), location="Athens, Greece", description="Inspired by creativity and artistic expression, I constantly seek new ways to share my vision of the world. Passionate about painting and poetry, I find beauty in small moments and big ideas.", profile_image="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1714638618/ai-generated-8625127_1920_zymolq.jpg", cover_image="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1713005618/samples/coffee.jpg")
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
                        Event(owner=users[5], name="Popular Race", location="Campo Grande, Valladolid, Spain", start_datetime=datetime.datetime(year=2024, month=5, day=12, hour=9), end_datetime=datetime.datetime(year=2024, month=5, day=12, hour=11), status="Planned", description="5km race for a charitable cause", budget_per_person=10.0, event_type=event_types[0], latitude=41.6525, longitude=-4.7237),
                        Event(owner=users[5], name="Guided Tour of the Prado Museum", location="Prado Museum, Madrid, Spain", start_datetime=datetime.datetime(year=2024, month=6, day=10, hour=11), end_datetime=datetime.datetime(year=2024, month=6, day=10, hour=13), status="Planned", description="Guided tour to discover the secrets of the museum", budget_per_person=20.0, event_type=event_types[13], latitude=40.4138, longitude=-3.6922),
                        Event(owner=users[2], name="Hike in the Sierra de Gredos", location="Sierra de Gredos, Ávila, Spain", start_datetime=datetime.datetime(year=2024, month=7, day=15, hour=8), end_datetime=datetime.datetime(year=2024, month=7, day=17, hour=18), status="Planned", description="Weekend hiking trip in the mountains", budget_per_person=50.0, event_type=event_types[14], latitude=40.2828, longitude=-5.9226),
                        Event(owner=users[9], name="Vetusta Morla Concert", location="Wizink Center, Madrid, Spain", start_datetime=datetime.datetime(year=2024, month=8, day=20, hour=21), end_datetime=datetime.datetime(year=2024, month=8, day=20, hour=23), status="Planned", description="Concert by the indie rock band", budget_per_person=30.0, event_type=event_types[4], latitude=40.4168, longitude=-3.7038),
                        Event(owner=users[4], name="Picasso Exhibition", location="Picasso Museum, Barcelona, Spain", start_datetime=datetime.datetime(year=2024, month=9, day=25, hour=10), end_datetime=datetime.datetime(year=2024, month=9, day=25, hour=12), status="Planned", description="Exhibition of the artist's masterpieces", budget_per_person=15.0, event_type=event_types[13], latitude=41.3851, longitude=2.1734),
                        Event(owner=users[7], name="Football Match", location="Santiago Bernabéu Stadium, Madrid, Spain", start_datetime=datetime.datetime(year=2024, month=10, day=30, hour=19), end_datetime=datetime.datetime(year=2024, month=10, day=30, hour=21), status="Planned", description="League match between Real Madrid and FC Barcelona", budget_per_person=40.0, event_type=event_types[6], latitude=40.4530, longitude=-3.6883),
                        Event(owner=users[7], name="Halloween Party", location="Joy Eslava Nightclub, Madrid, Spain", start_datetime=datetime.datetime(year=2024, month=11, day=30, hour=23), end_datetime=datetime.datetime(year=2024, month=11, day=1, hour=6), status="Planned", description="Halloween-themed party with music and dancing", budget_per_person=25.0, event_type=event_types[7], latitude=40.4150, longitude=-3.7074),
                        Event(owner=users[9], name="Classic Theater Play", location="Teatro Real, Madrid, Spain", start_datetime=datetime.datetime(year=2024, month=12, day=15, hour=20), end_datetime=datetime.datetime(year=2024, month=12, day=15, hour=22), status="Planned", description="Performance of a classic theater play", budget_per_person=35.0, event_type=event_types[8], latitude=40.4180, longitude=-3.7113),
                        Event(owner=users[0], name="Technology Conference", location="Congress Palace, Barcelona, Spain", start_datetime=datetime.datetime(year=2025, month=1, day=20, hour=10), end_datetime=datetime.datetime(year=2025, month=1, day=20, hour=12), status="Planned", description="Conference on the latest technology trends", budget_per_person=20.0, event_type=event_types[9], latitude=41.3851, longitude=2.1734),
                        Event(owner=users[4], name="Italian Cooking Workshop", location="Cooking School, Barcelona, Spain", start_datetime=datetime.datetime(year=2025, month=2, day=25, hour=18), end_datetime=datetime.datetime(year=2025, month=2, day=25, hour=20), status="Planned", description="Hands-on workshop to learn how to cook Italian dishes", budget_per_person=30.0, event_type=event_types[12], latitude=41.3851, longitude=2.1734),
                        Event(owner=users[3], name="Surprise Event", location="Secret Location, Madrid, Spain", start_datetime=datetime.datetime(year=2025, month=3, day=30, hour=19), end_datetime=datetime.datetime(year=2025, month=3, day=30, hour=21), status="Planned", description="Surprise event with special activities and gifts", budget_per_person=25.0, event_type=event_types[7], latitude=40.4168, longitude=-3.7038),
                        Event(owner=users[5], name="Yoga Retreat", location="Finca La Paz, Mallorca, Spain", start_datetime=datetime.datetime(year=2025, month=4, day=5, hour=9), end_datetime=datetime.datetime(year=2025, month=4, day=9, hour=18), status="Planned", description="Rejuvenating yoga and meditation retreat in a peaceful countryside setting", budget_per_person=350.0, event_type=event_types[14], latitude=39.5696, longitude=2.6501),
                        Event(owner=users[7], name="Cooking Class with a Michelin-starred Chef", location="Culinary Institute, Valencia, Spain", start_datetime=datetime.datetime(year=2025, month=5, day=15, hour=17), end_datetime=datetime.datetime(year=2025, month=5, day=15, hour=21), status="Planned", description="Exclusive cooking class led by a renowned Michelin-starred chef", budget_per_person=100.0, event_type=event_types[12], latitude=39.4699, longitude=-0.3763),
                        Event(owner=users[8], name="Outdoor Photography Workshop", location="Sierra Nevada, Granada, Spain", start_datetime=datetime.datetime(year=2025, month=6, day=20, hour=10), end_datetime=datetime.datetime(year=2025, month=6, day=22, hour=16), status="Planned", description="Immersive weekend workshop to improve your outdoor photography skills", budget_per_person=150.0, event_type=event_types[13], latitude=37.0902, longitude=-3.4289),
                        Event(owner=users[9], name="Whisky Tasting Experience", location="Whisky Bar, Edinburgh, Scotland", start_datetime=datetime.datetime(year=2025, month=7, day=1, hour=19), end_datetime=datetime.datetime(year=2025, month=7, day=1, hour=21), status="Planned", description="Guided tasting of rare and exclusive whisky selections", budget_per_person=75.0, event_type=event_types[2], latitude=55.9533, longitude=-3.1883),
                        Event(owner=users[10], name="Sustainable Fashion Pop-up", location="Sustainable Fashion Hub, Berlin, Germany", start_datetime=datetime.datetime(year=2025, month=8, day=10, hour=12), end_datetime=datetime.datetime(year=2025, month=8, day=12, hour=20), status="Planned", description="Showcase of eco-friendly and ethically produced fashion collections", budget_per_person=20.0, event_type=event_types[16], latitude=52.5200, longitude=13.4050)
                    ]
            db.session.add_all(events)
            db.session.commit()
            
            event_member = [
                        Event_Member(user=users[5], event=events[0], member_status="Owner"),
                        Event_Member(user=users[5], event=events[1], member_status="Owner"),
                        Event_Member(user=users[2], event=events[2], member_status="Owner"),
                        Event_Member(user=users[9], event=events[3], member_status="Owner"),
                        Event_Member(user=users[4], event=events[4], member_status="Owner"),
                        Event_Member(user=users[7], event=events[5], member_status="Owner"),
                        Event_Member(user=users[7], event=events[6], member_status="Owner"),
                        Event_Member(user=users[9], event=events[7], member_status="Owner"),
                        Event_Member(user=users[0], event=events[8], member_status="Owner"),
                        Event_Member(user=users[4], event=events[9], member_status="Owner"),
                        Event_Member(user=users[3], event=events[10], member_status="Owner"),
                        # Event_Member(user=users[5], event=events[0], member_status="Accepted"),
                        # Event_Member(user=users[2], event=events[0], member_status="Applied"),
                        # Event_Member(user=users[3], event=events[0], member_status="Applied"),
                        # Event_Member(user=users[4], event=events[0], member_status="Rejected"),
                        # Event_Member(user=users[5], event=events[0], member_status="Applied"),
                        Event_Member(user=users[5], event=events[11], member_status="Owner"),
                        Event_Member(user=users[7], event=events[12], member_status="Owner"),
                        Event_Member(user=users[8], event=events[13], member_status="Owner"),
                        Event_Member(user=users[9], event=events[14], member_status="Owner"),
                        Event_Member(user=users[10], event=events[15], member_status="Owner")
                    ]
            db.session.add_all(event_member)
            db.session.commit()
            
            # private_chat = [
            #     PrivateChat(event=events[0], user=users[2]),
            #     PrivateChat(event=events[0], user=users[3]),
            #     PrivateChat(event=events[0], user=users[4]),
            #     PrivateChat(event=events[0], user=users[5])
            #     ]
            # db.session.add_all(private_chat)
            # db.session.commit()
            
            # user_private_chat = [
            #     UsersPrivateChat(user=users[2], private_chat=private_chat[0]),
            #     UsersPrivateChat(user=users[1], private_chat=private_chat[0]),
            #     UsersPrivateChat(user=users[3], private_chat=private_chat[1]),
            #     UsersPrivateChat(user=users[1], private_chat=private_chat[1]),
            #     UsersPrivateChat(user=users[4], private_chat=private_chat[2]),
            #     UsersPrivateChat(user=users[1], private_chat=private_chat[2]),
            #     UsersPrivateChat(user=users[5], private_chat=private_chat[3]),
            #     UsersPrivateChat(user=users[1], private_chat=private_chat[3]),
            #     ]
            # private_messages = [
            #     Message(sender=users[2], private_chat=private_chat[0], receiver=users[1] ,message="Hola, ¿cómo estás?, Me gustaría unirme a tu evento!" , group_type="Private"),
            #     Message(sender=users[1], private_chat=private_chat[0], receiver=users[2] ,message="¡Claro! Sería genial contar contigo. ¿Has visto a qué hora es?" , group_type="Private"),
            #     Message(sender=users[2], private_chat=private_chat[0], receiver=users[1] ,message="Sí, a las 8 PM. ¡Allí estaré!" , group_type="Private"),
            #     Message(sender=users[1], private_chat=private_chat[0], receiver=users[2] ,message="¡Perfecto! Nos vemos allí entonces." , group_type="Private"),
                
            #     Message(sender=users[3], private_chat=private_chat[1], receiver=users[1] ,message="Hola, ¿cómo estás?, Me gustaría unirme a tu evento!" , group_type="Private"),
            #     Message(sender=users[1], private_chat=private_chat[1], receiver=users[3] ,message="¡Hola! Claro, estás invitado. ¿Has visto a qué hora es?" , group_type="Private"),
            #     Message(sender=users[3], private_chat=private_chat[1], receiver=users[1] ,message="Sí, a las 8 PM. ¡Allí estaré!" , group_type="Private"),
            #     Message(sender=users[1], private_chat=private_chat[1], receiver=users[3] ,message="¡Excelente! Nos vemos allí." , group_type="Private"),
                
            #     Message(sender=users[4], private_chat=private_chat[2], receiver=users[1] ,message="Hola, ¿cómo estás?, Me gustaría unirme a tu evento!" , group_type="Private"),
            #     Message(sender=users[1], private_chat=private_chat[2], receiver=users[4] ,message="¡Hola! Claro, estás invitado. ¿Has visto a qué hora es?" , group_type="Private"),
            #     Message(sender=users[4], private_chat=private_chat[2], receiver=users[1] ,message="Lo siento, no podré asistir" , group_type="Private"),
            #     Message(sender=users[1], private_chat=private_chat[2], receiver=users[4] ,message="Qué lástima, espero verte en el próximo evento." , group_type="Private"),
                
            #     Message(sender=users[5], private_chat=private_chat[3], receiver=users[1] ,message="Hola, ¿cómo estás?, Me gustaría unirme a tu evento!" , group_type="Private"),
            #     Message(sender=users[1], private_chat=private_chat[3], receiver=users[5] ,message="¡Hola! Claro, estás invitado. ¿Has visto a qué hora es?" , group_type="Private"),
            #     Message(sender=users[5], private_chat=private_chat[3], receiver=users[1] ,message="Sí, a las 8 PM. ¡Allí estaré!" , group_type="Private"),
            #     Message(sender=users[1], private_chat=private_chat[3], receiver=users[5] ,message="¡Genial! Nos vemos allí." , group_type="Private"),
                
            #     ]
            # db.session.add_all(user_private_chat)
            # db.session.commit()
            
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
                ]
            
            db.session.add_all(user_group_chat)
            db.session.commit()
            
            # group_messages = [
            #     Message(sender=users[1], group_chat=group_chat[0], message="¡Hola a todos! ¿Están listos para el evento de mañana?" , group_type="Group"),
            #     Message(sender=users[0], group_chat=group_chat[0], message="¡Hola! Sí, estoy emocionado por la carrera." , group_type="Group"),
            #     ]
            # db.session.add_all(group_messages)
            # db.session.commit()

        
            print("Demo database successfully created.")
        except Exception as e:
            db.session.rollback()
            print(f"Error while running the script: {e}")
