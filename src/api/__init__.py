from flask import Flask
from .events import event_bp
from .user import user_bp

def create_app():
    app = Flask(__name__)

    app.register_blueprint(event_bp)
    app.register_blueprint(user_bp)

    return app