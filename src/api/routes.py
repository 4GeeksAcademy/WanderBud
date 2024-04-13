"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Event, Event_Type, Event_Member, Petition_Chat, Event_Chat
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from datetime import datetime
import pytz


api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200



@api.route("/login", methods=["POST"])
def login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    query_results = User.query.filter_by(email=email).first()

    if query_results is None:
            return jsonify({"msg": "Bad Request"}), 404

    if email == query_results.email and password == query_results.password:
            access_token = create_access_token(identity=email)
            return jsonify(access_token=access_token), 200
    
    else: 
            return jsonify({"msg": "Bad email or password. I am sorry"}), 401


@api.route("/valid-token", methods=["GET"])
@jwt_required()
def valid_token():
     
     current_user = get_jwt_identity()

     querty_results = User.query.filter_by(email=current_user).first()

     if querty_results is None:
            return jsonify({"msg": "user does not exist",
                           "is_logged": False}), 404
     
     return jsonify({"is_logged": True}), 200

@api.route("/create-event", methods=["POST"])
@jwt_required()
def create_event():
    """
    Create a new event.

    This function creates a new event by retrieving the current user's information,
    validating the user's existence, and then creating a new event object with the
    provided data. The event object is then added to the database and committed.

    Returns:
        A JSON response indicating the success or failure of the event creation.

    Example JSON request:
        {
            "name": "My Event",
            "location": "New York",
            "date": "2022-12-31",
            "time": "23:59:59",
            "timezone": "America/New_York",
            "status": "planned",
            "description": "A description of my event",
            "event_type_id": 1,
            "budget_per_person": 100
        }
    """
    current_user = get_jwt_identity()

    querty_results = User.query.filter_by(email=current_user).first()

    if querty_results is None:
        return jsonify({"msg": "user does not exist",
                        "is_logged": False}), 404
    
    date_str = request.json.get("date", None)
    time_str = request.json.get("time", None)
    timezone_str = request.json.get("timezone", None)
    datetime_str = f"{date_str} {time_str}"
    datetime_without_tz = datetime.strptime(datetime_str, "%Y-%m-%d %H:%M:%S")
    
    timezone = pytz.timezone(timezone_str)
    datetime_with_tz = timezone.localize(datetime_without_tz)

    name = request.json.get("name", None)
    owner_id = querty_results.id
    location = request.json.get("location", None)
    date_and_time = datetime_with_tz
    status = request.json.get("status", None)
    description = request.json.get("description", None)
    event_type_id = request.json.get("event_type_id", None)
    budget_per_person = request.json.get("budget_per_person", None)

    new_event = Event(
        name=name,
        owner_id=owner_id,
        location=location,
        datetime=date_and_time,
        status=status,
        description=description,
        event_type_id=event_type_id,
        budget_per_person=budget_per_person
    )
    print(new_event)

    db.session.add(new_event)
    db.session.commit()

    return jsonify({"msg": "event created"}), 200