from flask import Blueprint

chat_bp = Blueprint('chat', __name__)

from . import chat