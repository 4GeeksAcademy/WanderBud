from flask import Blueprint

event_bp = Blueprint('events', __name__)

from . import events