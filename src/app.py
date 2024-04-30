from datetime import timedelta
import os
from flask import Flask, jsonify, send_from_directory
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_mail import Mail
import threading
import schedule

from api.utils import APIException, generate_sitemap
from api.models import db, Event
from api.admin import setup_admin
from api.commands import setup_commands
from api import event_bp, user_bp, chat_bp

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
app.url_map.strict_slashes = False
CORS(app)

# database configuration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# jwt_flask_extended
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY").encode('utf-8')
app.config['SECURITY_PASSWORD_SALT'] = os.getenv(
    'SECURITY_PASSWORD_SALT').encode('utf-8')
jwt = JWTManager(app)

# Set JWT token expiration time to 12 hour
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=12)

# Configure Flask-Mail
app.config['MAIL_SERVER'] = 'smtp.fastmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_USERNAME')

mail = Mail(app)

# Add all endpoints from the API with an "api" prefix
app.register_blueprint(event_bp, url_prefix='/api')
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(chat_bp, url_prefix='/api')

# Handle/serialize errors like a JSON object
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# Generate sitemap with all your endpoints
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# Any other endpoint will try to serve it like a static file
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response

'''Solo descomentar cuando se usa en producción'''
# def actualize_status():
#     with app.app_context():
#         events = Event.query.all()
#         for event in events:
#             status = event.actualize_status()
#             event.status = status
#             db.session.commit()
#         db.session.close()

# def actualize_status_loop():
#     actualize_status()
#     schedule.every(1).minutes.do(actualize_status)
    
#     while True:
#         schedule.run_pending()

# t = threading.Thread(target=actualize_status_loop)
# t.start()

# Esto solo se ejecuta si `$ python src/main.py` se ejecuta
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
