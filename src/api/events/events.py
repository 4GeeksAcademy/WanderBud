from flask import request, jsonify, Blueprint
from api.models import db, User, Event, Event_Type
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from flask_cors import CORS
from . import event_bp
import pytz
from api.utils import get_currency_symbol
from api.utils_map import get_address_in_radius, coordinates_to_timezone

CORS(event_bp)

@event_bp.route("/create-event", methods=["POST"])
@jwt_required()
def create_event():
    try:
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
                "location": "New York, NY 10001, USA",
                "date": "2022-12-31",
                "time": "23:59:59",
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
        timezone_str = coordinates_to_timezone(request.json.get("location", None))
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

        db.session.add(new_event)
        db.session.commit()

        return jsonify({"msg": "event created"}), 200
    except Exception as e:
        return jsonify({"msg": "error creating event",
                        "error": str(e)}), 500
        
@event_bp.route("/get-event-types", methods=["GET"])
def get_event_types():
    """
    Retrieve all event types.

    This function retrieves all event types from the database and returns them as a list
    of JSON objects.

    Returns:
        A JSON response containing a list of all event types.

    Example JSON response:
        [
            {
                "id": 1,
                "name": "Birthday"
            },
            {
                "id": 2,
                "name": "Wedding"
            }
        ]
    """
    event_types = Event_Type.query.all()
    event_types_list = []
    for event_type in event_types:
        event_types_list.append({
            "id": event_type.id,
            "name": event_type.name
        })
    return jsonify(event_types_list), 200

@event_bp.route("/get-all-events", methods=["GET"])
@jwt_required()
def get_all_events():
    try:
        """
        Retrieve all events.

        This function retrieves all events from the database and returns them as a list
        of JSON objects.

        Returns:
            A JSON response containing a list of all events.

        Example JSON response:
            [
                {
                    "id": 1,
                    "name": "My Event",
                    "location": "New York",
                    "datetime": "2022-12-31 23:59:59",
                    "status": "planned",
                    "description": "A description of my event",
                    "event_type_id": 1,
                    "budget_per_person": 100
                }
            ]
        Example JSON request:
            {
                "timezone": "America/New_York"
            }
        """
        timezone = request.json.get("timezone", None)
        events = Event.query.all()
        events_list = []
        for event in events:
            event_datetime = event.datetime
            event_datetime = event_datetime.astimezone(pytz.timezone(timezone))
            event_date = event_datetime.strftime("%Y-%m-%d")
            event_time = event_datetime.strftime("%H:%M:%S")
            event_timezone = event_datetime.strftime("%Z")
            
            events_list.append({
                "id": event.id,
                "name": event.name,
                "owner": event.owner_id,
                "location": event.location,
                "date": event_date,
                "time": event_time,
                "timezone": event_timezone,
                "status": event.status,
                "description": event.description,
                "event_type_id": event.event_type_id,
                "budget_per_person": str(event.budget_per_person) + get_currency_symbol(event.location)
            })
            
        return jsonify(events_list), 200
    except Exception as e:
        return jsonify({"msg": "error retrieving events",
                        "error": str(e)}), 500

@event_bp.route("/get-event/<int:event_id>", methods=["GET"])
@jwt_required()
def get_event(event_id):
    try:
        """
        Retrieve a specific event.

        This function retrieves a specific event from the database and returns it as a JSON
        object.

        Args:
            event_id (int): The ID of the event to retrieve.

        Returns:
            A JSON response containing the event details.

        Example JSON response:
            {
                "id": 1,
                "name": "My Event",
                "location": "New York",
                "datetime": "2022-12-31 23:59:59",
                "status": "planned",
                "description": "A description of my event",
                "event_type_id": 1,
                "budget_per_person": 100
            }
        """
        event = Event.query.filter_by(id=event_id).first()
        event_datetime = event.datetime
        event_date = event_datetime.strftime("%Y-%m-%d")
        event_time = event_datetime.strftime("%H:%M:%S")
        event_timezone = event_datetime.strftime("%Z")
        
        event_details = {
            "id": event.id,
            "name": event.name,
            "owner": event.owner_id,
            "location": event.location,
            "date": event_date,
            "time": event_time,
            "timezone": event_timezone,
            "status": event.status,
            "description": event.description,
            "event_type_id": event.event_type_id,
            "budget_per_person": str(event.budget_per_person) + get_currency_symbol(event.location)
        }
        
        return jsonify(event_details), 200
    except Exception as e:
        return jsonify({"msg": "error retrieving event",
                        "error": str(e)}), 500
        
@event_bp.route("/get-my-events", methods=["GET"])
@jwt_required()
def get_my_events():
    try:
        """
        Retrieve the current user's events.

        This function retrieves the current user's events from the database and returns them
        as a list of JSON objects.

        Returns:
            A JSON response containing a list of the current user's events.

        Example JSON response:
            [
                {
                    "id": 1,
                    "name": "My Event",
                    "location": "New York",
                    "datetime": "2022-12-31 23:59:59",
                    "status": "planned",
                    "description": "A description of my event",
                    "event_type_id": 1,
                    "budget_per_person": 100
                }
            ]
        """
        current_user = get_jwt_identity()
        user = User.query.filter_by(email=current_user).first()
        events = Event.query.filter_by(owner_id=user.id).all()
        events_list = []
        for event in events:
            event_datetime = event.datetime
            event_date = event_datetime.strftime("%Y-%m-%d")
            event_time = event_datetime.strftime("%H:%M:%S")
            event_timezone = event_datetime.strftime("%Z")
            
            events_list.append({
                "id": event.id,
                "name": event.name,
                "owner": event.owner_id,
                "location": event.location,
                "date": event_date,
                "time": event_time,
                "timezone": event_timezone,
                "status": event.status,
                "description": event.description,
                "event_type_id": event.event_type_id,
                "budget_per_person": str(event.budget_per_person) + get_currency_symbol(event.location)
            })
            
        return jsonify(events_list), 200
    except Exception as e:
        return jsonify({"msg": "error retrieving events",
                        "error": str(e)}), 500

@event_bp.route("/get-event-by-radius", methods=["GET"])
@jwt_required()
def get_event_by_radius():
    try:
        """
        Retrieve events within a given radius.

        This function retrieves events within a given radius of the current user's location
        from the database and returns them as a list of JSON objects.

        Returns:
            A JSON response containing a list of events within the given radius.

        Example JSON response:
            [
                {
                    "id": 1,
                    "name": "My Event",
                    "location": "New York",
                    "datetime": "2022-12-31 23:59:59",
                    "status": "planned",
                    "description": "A description of my event",
                    "event_type_id": 1,
                    "budget_per_person": 100
                }
            ]
        Example JSON request:
            {
                "radius": 100
                "location": "Carrer de Simancas 50, Hospitalet de Llobregat, Spain"
                    
            }
        """
        user_location = request.json.get("location", None)
        radius = request.json.get("radius", None)
        events = Event.query.all()
        events_address = [event.location for event in events]
        events_list_address = get_address_in_radius(user_location, radius, events_address)
        events_list = []
        for event in events:
            if event.location in events_list_address:
                event_datetime = event.datetime
                event_date = event_datetime.strftime("%Y-%m-%d")
                event_time = event_datetime.strftime("%H:%M:%S")
                event_timezone = event_datetime.strftime("%Z")
                
                events_list.append({
                    "id": event.id,
                    "name": event.name,
                    "owner": event.owner_id,
                    "location": event.location,
                    "date": event_date,
                    "time": event_time,
                    "timezone": event_timezone,
                    "status": event.status,
                    "description": event.description,
                    "event_type_id": event.event_type_id,
                    "budget_per_person": str(event.budget_per_person) + get_currency_symbol(event.location)
                })
        
            
        return jsonify(events_list), 200
    except Exception as e:
        return jsonify({"msg": "error retrieving events",
                        "error": str(e)}), 500


@event_bp.route("/get-current-user", methods=["GET"])
@jwt_required()
def get_current_user():
    try:
        """
        Retrieve the current user's information.

        This function retrieves the current user's information from the database and returns
        it as a JSON object.

        Returns:
            A JSON response containing the current user's information.

        Example JSON response:
            {
                "id": 1,
                "email": "
            }
        """
        current_user = get_jwt_identity()
        user = User.query.filter_by(email=current_user).first()
        user_info = {
            "id": user.id,
            "email": user.email
        }
        return jsonify(user_info), 200
    except Exception as e:
        return jsonify({"msg": "error retrieving user",
                        "error": str(e)}), 500
        