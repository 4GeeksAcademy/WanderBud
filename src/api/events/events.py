from flask import request, jsonify, Blueprint
from api.models import db, User, Event
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from flask_cors import CORS
from . import event_bp
import pytz

CORS(event_bp)

@event_bp.route("/create-event", methods=["POST"])
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
