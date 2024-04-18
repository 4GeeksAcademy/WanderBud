from flask import request, jsonify, Blueprint # type: ignore
from api.models import db, User, Event, Event_Type, Event_Member, User_Profile, Event_Chat
from flask_jwt_extended import jwt_required, get_jwt_identity # type: ignore # type: ignore
from datetime import datetime
from flask_cors import CORS # type: ignore
from . import event_bp
import pytz # type: ignore
from api.utils_map import get_address_in_radius, coordinates_to_timezone, get_currency_symbol

CORS(event_bp)

def get_datetime_with_timezone(date_str, time_str, location):
    timezone_str = coordinates_to_timezone(location)
    datetime_str = f"{date_str} {time_str}"
    datetime_without_tz = datetime.strptime(datetime_str, "%Y-%m-%d %H:%M:%S")
    timezone = pytz.timezone(timezone_str['timezone'])
    datetime_with_tz = datetime_without_tz.astimezone(timezone)
    
    return datetime_with_tz
def actualize_event_status():
    events = Event.query.all()
    for event in events:
        if event.end_datetime < datetime.now():
            event.status = "Finished"
        elif event.start_datetime < datetime.now() < event.end_datetime:
            event.status = "In Progress"
        else:
            event.status = "Planned"
    db.session.commit()


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
                "location": "New York",
                "start_date": "2022-12-31",
                "start_time": "23:59:59",
                "end_date": "2023-01-01",
                "end_time": "01:00:00",
                "description": "A description of my event",
                "event_type_id": 1,
                "budget_per_person": 100
            }
        """
        print("Creating event")
        current_user = get_jwt_identity()
        print(current_user)

        querty_results = User.query.filter_by(email=current_user).first()
        print(querty_results)

        if querty_results is None:
            return jsonify({"msg": "user does not exist",
                            "is_logged": False}), 404
        name = request.json.get("name", None)
        owner_id = querty_results.id
        location = request.json.get("location", None)
        start_datetime = get_datetime_with_timezone(request.json.get("start_date", None),request.json.get("start_time", None),location)
        end_datetime = get_datetime_with_timezone(request.json.get("end_date", None), request.json.get("end_time", None),location)
        description = request.json.get("description", None)
        event_type_id = request.json.get("event_type_id", None)
        budget_per_person = request.json.get("budget_per_person", None)
        
        new_event = Event(
            name=name,
            owner_id=owner_id,
            location=location,
            start_datetime=start_datetime,
            end_datetime=end_datetime,
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
                    "start_datetime": "2022-12-31 23:59:59",
                    "end_datetime": "2023-01-01 01:00:00",
                    "status": "Planned",
                    "timezone": "America/New_York",
                    "description": "A description of my event",
                    "event_type_id": 1,
                    "budget_per_person": 100
                }
            ]
        """
        events = Event.query.all()
        events_list = []
        for event in events:
            event_timezone = coordinates_to_timezone(event.location)['timezone']
            
            events_list.append({
                "id": event.id,
                "name": event.name,
                "owner": event.owner_id,
                "location": event.location,
                "start_date": event.start_datetime.strftime("%Y-%m-%d"),
                "start_time": event.start_datetime.strftime("%H:%M:%S"),
                "end_date": event.end_datetime.strftime("%Y-%m-%d"),
                "end_time": event.end_datetime.strftime("%H:%M:%S"),
                "timezone": event_timezone,
                "status": event.status,
                "description": event.description,
                "event_type_id": event.event_type_id,
                "budget_per_person": str(event.budget_per_person) +" "+ str(get_currency_symbol(event.location))
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
                "start_datetime": "2022-12-31 23:59:59",
                "end_datetime": "2023-01-01 01:00:00",
                "status": "Planned",
                "description": "A description of my event",
                "timezone": "America/New_York",
                "event_type_id": 1,
                "budget_per_person": 100
            }
        """
        event = Event.query.filter_by(id=event_id).first()
        event_timezone = coordinates_to_timezone(event.location)['timezone']
        
        event_details = {
            "id": event.id,
            "name": event.name,
            "location": event.location,
            "start_date": event.start_datetime.strftime("%Y-%m-%d"),
            "start_time": event.start_datetime.strftime("%H:%M:%S"),
            "end_date": event.end_datetime.strftime("%Y-%m-%d"),
            "end_time": event.end_datetime.strftime("%H:%M:%S"),
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
                    "start_date": "2022-12-31",
                    "start_time": "23:59:59",
                    "timezone": "America/New_York",
                    "status": "Planned",
                    "description": "A description of my event",
                    "event_type_id": 1,
                    "budget_per_person": "100 USD"
                }
            ]
        """
        current_user = get_jwt_identity()
        user = User.query.filter_by(email=current_user).first()
        events = Event.query.filter_by(owner_id=user.id).all()
        events_list = []
        for event in events:
            event_timezone = coordinates_to_timezone(event.location)['timezone']
            
            events_list.append({
                "id": event.id,
                "name": event.name,
                "owner": event.owner_id,
                "location": event.location,
                "start_date": event.start_datetime.strftime("%Y-%m-%d"),
                "start_time": event.start_datetime.strftime("%H:%M:%S"),
                "end_date": event.end_datetime.strftime("%Y-%m-%d"),
                "end_time": event.end_datetime.strftime("%H:%M:%S"),
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
            event_timezone = coordinates_to_timezone(event.location)['timezone']
            
            events_list.append({
                "id": event.id,
                "name": event.name,
                "owner": event.owner_id,
                "location": event.location,
                "start_date": event.start_datetime.strftime("%Y-%m-%d"),
                "start_time": event.start_datetime.strftime("%H:%M:%S"),
                "end_date": event.end_datetime.strftime("%Y-%m-%d"),
                "end_time": event.end_datetime.strftime("%H:%M:%S"),
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
        
@event_bp.route("/update-event/<int:event_id>", methods=["PUT"])
@jwt_required()
def update_event(event_id):
    try:
        """
        Update a specific event.

        This function updates a specific event in the database with the provided data.

        Args:
            event_id (int): The ID of the event to update.

        Returns:
            A JSON response indicating the success or failure of the event update.

        Example JSON request:
            {
                "name": "My Updated Event",
                "location": "New York",
                "start_date": "2022-12-31",
                "start_time": "23:59:59",
                "end_date": "2023-01-01",
                "end_time": "01:00:00",
                "description": "An updated description of my event",
                "event_type_id": 1,
                "budget_per_person": 100
            }
        """
        event = Event.query.filter_by(id=event_id).first()
        
        # Check if the current user is the owner of the event
        current_user = get_jwt_identity()
        if event.owner_id != current_user:
            return jsonify({"msg": "You are not the owner of this event"}), 403
        
        event.name = request.json.get("name", event.name)
        event.location = request.json.get("location", event.location)
        event.start_datetime = get_datetime_with_timezone(request.json.get("start_date", event.start_datetime.strftime("%Y-%m-%d")), request.json.get("start_time", event.start_datetime.strftime("%H:%M:%S")), event.location)
        event.end_datetime = get_datetime_with_timezone(request.json.get("end_date", event.end_datetime.strftime("%Y-%m-%d")), request.json.get("end_time", event.end_datetime.strftime("%H:%M:%S")), event.location)
        event.description = request.json.get("description", event.description)
        event.event_type_id = request.json.get("event_type_id", event.event_type_id)
        event.budget_per_person = request.json.get("budget_per_person", event.budget_per_person)
        
        db.session.commit()
        
        return jsonify({"msg": "event updated"}), 200
    except Exception as e:
        return jsonify({"msg": "error updating event",
                        "error": str(e)}), 500
        
@event_bp.route("/delete-event/<int:event_id>", methods=["DELETE"])
@jwt_required()
def delete_event(event_id):
    try:
        """
        Delete a specific event.

        This function deletes a specific event from the database.

        Args:
            event_id (int): The ID of the event to delete.

        Returns:
            A JSON response indicating the success or failure of the event deletion.
        """
        event = Event.query.filter_by(id=event_id).first()
        
        # Check if the current user is the owner of the event
        current_user = get_jwt_identity()
        if event.owner_id != current_user:
            return jsonify({"msg": "You are not the owner of this event"}), 403
        
        db.session.delete(event)
        db.session.commit()
        
        return jsonify({"msg": "event deleted"}), 200
    except Exception as e:
        return jsonify({"msg": "error deleting event",
                        "error": str(e)}), 500

@event_bp.route("/get-event-members/<int:event_id>", methods=["GET"])
@jwt_required()
def get_event_members(event_id):
    try:
        """
        Retrieve the members of a specific event.

        This function retrieves the members of a specific event from the database and returns
        them as a list of JSON objects.

        Args:
            event_id (int): The ID of the event to retrieve the members from.

        Returns:
            A JSON response containing a list of the event members.

        Example JSON response:
            [
                {
                    "id": 1,
                    "user_id": 1,
                    "event_id": 1,
                    "status": "accepted"
                }
            ]
        """
        event = Event.query.filter_by(id=event_id).first()
        members = event.members
        members_list = []
        for member in members:
            members_list.append({
                "id": member.id,
                "user_id": member.user_id,
                "event_id": member.event_id,
                "status": member.status
            })
        return jsonify(members_list), 200
    except Exception as e:
        return jsonify({"msg": "error retrieving event members",
                        "error": str(e)}), 500
        
@event_bp.route("/get-joined-events", methods=["GET"])
@jwt_required()
def get_joined_events():
    try:
        """
        Retrieve the events that the current user has joined.

        This function retrieves the events that the current user has joined from the database
        and returns them as a list of JSON objects.

        Returns:
            A JSON response containing a list of the joined events.

        Example JSON response:
            [
                {
                    "id": 1,
                    "name": "My Event",
                    "owner_id": 1,
                    "location": "New York",
                    "start_date": "2022-12-31",
                    "start_time": "23:59:59",
                    "end_date": "2023-01-01",
                    "end_time": "01:00:00",
                    "status": "planned",
                    "timezone": "America/New_York",
                    "description": "A description of my event",
                    "event_type_id": 1,
                    "budget_per_person": 100
                }
            ]
        """
        current_user = get_jwt_identity()
        user = User.query.filter_by(email=current_user).first()
        joined_events = Event.query.join(Event_Member, Event.id == Event_Member.event_id).filter(Event_Member.user_id == user.id).all()
        joined_events_list = []
        for event in joined_events:
            event_timezone = event.start_datetime.strftime("%Z")
            event_details = {
                "id": event.id,
                "name": event.name,
                "owner": event.owner_id,
                "location": event.location,
                "start_date": event.start_datetime.strftime("%Y-%m-%d"),
                "start_time": event.start_datetime.strftime("%H:%M:%S"),
                "end_date": event.end_datetime.strftime("%Y-%m-%d"),
                "end_time": event.end_datetime.strftime("%H:%M:%S"),
                "timezone": event_timezone,
                "status": event.status,
                "description": event.description,
                "event_type_id": event.event_type_id,
                "budget_per_person": str(event.budget_per_person) + get_currency_symbol(event.location)
            }
            joined_events_list.append(event_details)
                
        return jsonify(joined_events_list)
    except Exception as e:
        return jsonify({"error": str(e)})
    
@event_bp.route("/join-event/<int:event_id>", methods=["POST"])
@jwt_required()
def join_event(event_id):
    try:
        """
        Join a specific event.

        This function allows the current user to join a specific event by adding the user
        to the event's members list.

        Args:
            event_id (int): The ID of the event to join.

        Returns:
            A JSON response indicating the success or failure of joining the event.
        """
        current_user = get_jwt_identity()
        user = User.query.filter_by(email=current_user).first()
        event = Event.query.filter_by(id=event_id).first()
        
        event_member = Event_Member(user_id=user.id, event_id=event.id, status="Applied")
        db.session.add(event_member)
        db.session.commit()
        
        return jsonify({"msg": "joined event"}), 200
    except Exception as e:
        return jsonify({"msg": "error joining event",
                        "error": str(e)}), 500
    
@event_bp.route("/leave-event/<int:event_id>", methods=["POST"])
@jwt_required()
def leave_event(event_id):
    try:
        """
        Leave a specific event.

        This function allows the current user to leave a specific event by removing the user
        from the event's members list.

        Args:
            event_id (int): The ID of the event to leave.

        Returns:
            A JSON response indicating the success or failure of leaving the event.
        """
        current_user = get_jwt_identity()
        user = User.query.filter_by(email=current_user).first()
        event = Event.query.filter_by(id=event_id).first()
        
        event_member = Event_Member.query.filter_by(user_id=user.id, event_id=event.id).first()
        db.session.delete(event_member)
        db.session.commit()
        
        return jsonify({"msg": "left event"}), 200
    except Exception as e:
        return jsonify({"msg": "error leaving event",
                        "error": str(e)}), 500

@event_bp.route("/reject-member/<int:event_id>", methods=["POST"])
@jwt_required()
def reject_member(event_id):
    try:
        """
        Reject a member from a specific event.

        This function allows the owner of a specific event to reject a member from the event's
        members list.

        Args:
            event_id (int): The ID of the event to reject the member from.

        Returns:
            A JSON response indicating the success or failure of rejecting the member.
        """
        current_user = get_jwt_identity()
        user = User.query.filter_by(email=current_user).first()
        event = Event.query.filter_by(id=event_id).first()
        
        if event.owner_id != user.id:
            return jsonify({"msg": "You are not the owner of this event"}), 403
        
        member_id = request.json.get("member_id", None)
        event_member = Event_Member.query.filter_by(user_id=member_id, event_id=event.id).first()
        event_member.status = "Rejected"
        
        db.session.commit()
        
        return jsonify({"msg": "member rejected"}), 200
    except Exception as e:
        return jsonify({"msg": "error rejecting member",
                        "error": str(e)}), 500
        
@event_bp.route("/accept-member/<int:event_id>", methods=["POST"])
@jwt_required()
def accept_member(event_id):
    try:
        """
        Accept a member to a specific event.

        This function allows the owner of a specific event to accept a member to the event's
        members list.

        Args:
            event_id (int): The ID of the event to accept the member to.

        Returns:
            A JSON response indicating the success or failure of accepting the member.
        """
        current_user = get_jwt_identity()
        user = User.query.filter_by(email=current_user).first()
        event = Event.query.filter_by(id=event_id).first()
        
        if event.owner_id != user.id:
            return jsonify({"msg": "You are not the owner of this event"}), 403
        
        member_id = request.json.get("member_id", None)
        event_member = Event_Member.query.filter_by(user_id=member_id, event_id=event.id).first()
        event_member.status = "Accepted"
        
        db.session.commit()
        
        return jsonify({"msg": "member accepted"}), 200
    except Exception as e:
        return jsonify({"msg": "error accepting member",
                        "error": str(e)}), 500
