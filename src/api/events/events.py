from enum import Enum
from flask import request, jsonify, Blueprint # type: ignore
from api.models import db, User, Event, Event_Type, Event_Member, User_Profile, Message , GroupChat, UsersGroupChat, PrivateChat, UsersPrivateChat
from flask_jwt_extended import jwt_required, get_jwt_identity # type: ignore # type: ignore
from datetime import datetime
from flask_cors import CORS # type: ignore
from . import event_bp
import pytz # type: ignore
from api.utils_map import get_address_in_radius, get_currency_symbol
import time

CORS(event_bp)

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
                "start_datetime": "2022-12-31T23:59:59Z",
                "end_datetime": "2023-01-01T01:00:00Z",
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
        name = request.json.get("name", None)
        owner_id = querty_results.id
        location = request.json.get("location", None)
        start_datetime = request.json.get("start_datetime", None)
        end_datetime = request.json.get("end_datetime", None)
        description = request.json.get("description", None)
        event_type_id = request.json.get("event_type_id", None)
        budget_per_person = request.json.get("budget_per_person", None)
        '''Check if the event type exists'''
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
        
        '''Add the owner to the event members'''
        event = Event.query.filter_by(name=name, owner_id=owner_id, location=location, start_datetime=start_datetime, end_datetime=end_datetime, description=description, event_type_id=event_type_id, budget_per_person=budget_per_person).first()
        db.session.add(Event_Member(user_id=owner_id, event_id=event.id, member_status="Owner"))
        '''Add the group chat to the event'''
        db.session.add(GroupChat(event_id=event.id))
        db.session.commit()
        group_chat = GroupChat.query.filter_by(event_id=event.id).first()
        '''Add the owner to the group chat'''
        db.session.add(UsersGroupChat(user_id=owner_id, chat_id=group_chat.id))
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
    start_time = time.time()  # Registro del tiempo de inicio
    
    
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
            owner = User_Profile.query.get(event.owner_id)
            events_list.append({
                "id": event.id,
                "name": event.name,
                "owner": {
                    "name": owner.name if owner else None,  # Handle potential missing owner
                    "profile_image": owner.profile_image if owner else None,
                    "user_id":owner.user_id if owner else None
                },
                "location": event.location,
                "start_date": event.start_datetime.strftime("%Y-%m-%d"),
                "start_time": event.start_datetime.strftime("%H:%M:%S"),
                "end_date": event.end_datetime.strftime("%Y-%m-%d"),
                "end_time": event.end_datetime.strftime("%H:%M:%S"),
                "status": event.status,
                "description": event.description,
                "event_type_id": event.event_type_id,
                "budget_per_person": str(event.budget_per_person)
            })
        
        # Cálculo del tiempo de ejecución
        end_time = time.time()
        execution_time = end_time - start_time
        print("Tiempo de ejecución:", execution_time, "segundos")
        
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
                "event_type_id": 1,
                "budget_per_person": 100
            }
        """
        event = Event.query.filter_by(id=event_id).first()
        
        if event is None:
            return jsonify({"msg": "event not found"}), 404
        
       

        owner = User_Profile.query.get(event.owner_id)
        
        event_details = {
            "id": event.id,
                "name": event.name,
                "owner": {
                    "name": owner.name if owner else None,  # Handle potential missing owner
                    "profile_image": owner.profile_image if owner else None,
                    "user_id": owner.user_id if owner else None
                },
            "location": event.location,
            "start_date": event.start_datetime.strftime("%Y-%m-%d"),
            "start_time": event.start_datetime.strftime("%H:%M:%S"),
            "end_date": event.end_datetime.strftime("%Y-%m-%d"),
            "end_time": event.end_datetime.strftime("%H:%M:%S"),
            "status": event.status,
            "description": event.description,
            "event_type_id": event.event_type_id,
            "budget_per_person": str(event.budget_per_person)
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
            
            
            owner = User_Profile.query.get(event.owner_id)
            
            events_list.append({
                "id": event.id,
                "name": event.name,
                "owner": {
                    "name": owner.name if owner else None,  # Handle potential missing owner
                    "profile_image": owner.profile_image if owner else None,
                    "user_id":owner.user_id if owner else None
                },
                "location": event.location,
                "start_date": event.start_datetime.strftime("%Y-%m-%d"),
                "start_time": event.start_datetime.strftime("%H:%M:%S"),
                "end_date": event.end_datetime.strftime("%Y-%m-%d"),
                "end_time": event.end_datetime.strftime("%H:%M:%S"),
                "status": event.status,
                "description": event.description,
                "event_type_id": event.event_type_id,
                "budget_per_person": str(event.budget_per_person)
            })
            
            if events_list == []:
                return jsonify({"msg": "You have no events"}), 404
            
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
                    "start_datetime": "2022-12-31 23:59:59",
                    "end_datetime": "2023-01-01 01:00:00",
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
        user_location = request.args.get("location")
        radius = float(request.args.get("radius"))
        print(user_location)
        print(radius)

        events = Event.query.all()
        
        events_address = [event.location for event in events]
        events_list_address = get_address_in_radius(user_location, radius, events_address)

        events_list = []
        for event in events:
            if event.location in events_list_address:
                owner = User_Profile.query.get(event.owner_id)
                print(event.location)
                event_details = {
                    "id": event.id,
                    "name": event.name,
                    "owner": {
                    "name": owner.name if owner else None,  # Handle potential missing owner
                    "profile_image": owner.profile_image if owner else None,
                    "user_id":owner.user_id if owner else None
                },
                    "location": event.location,
                    "start_date": event.start_datetime.strftime("%Y-%m-%d"),
                    "start_time": event.start_datetime.strftime("%H:%M:%S"),
                    "end_date": event.end_datetime.strftime("%Y-%m-%d"),
                    "end_time": event.end_datetime.strftime("%H:%M:%S"),
                    "status": event.status,
                    "description": event.description,
                    "event_type_id": event.event_type_id,
                    "budget_per_person": str(event.budget_per_person)
                }
                events_list.append(event_details)
                
            if events_list == []:
                return jsonify({"msg": "No events found in the given radius"}), 404    
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
                "start_datetime": "2022-12-31T23:59:59Z ",
                "end_datetime": "2023-01-01T01:00:00Z",
                "description": "An updated description of my event",
                "event_type_id": 1,
                "budget_per_person": 100
            }
        """
        current_user = get_jwt_identity()
        event = Event.query.filter_by(id=event_id).first()
        user = User.query.filter_by(email=current_user).first()
        if event is None:
            return jsonify({"msg": "event not found"}), 404
        
        # Check if the current user is the owner of the event
       
        if event.owner_id != user.id:
            return jsonify({"msg": "You are not the owner of this event"}), 403
        
        event.name = request.json.get("name", event.name)
        event.location = request.json.get("location", event.location)
        event.start_datetime = request.json.get("start_datetime", event.start_datetime.strftime("%Y-%m-%d %H:%M:%S"))
        event.end_datetime = request.json.get("end_datetime", event.end_datetime.strftime("%Y-%m-%d %H:%M:%S"))
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
    print(event_id)
    try:
        """
        Delete a specific event.

        This function deletes a specific event from the database.

        Args:
            event_id (int): The ID of the event to delete.

        Returns:
            A JSON response indicating the success or failure of the event deletion.
        """
        current_user = get_jwt_identity()
        event = Event.query.filter_by(id=event_id).first()
        user = User.query.filter_by(email=current_user).first()
        print(event)
        if event is None:
            return jsonify({"msg": "event does not exist"}), 404
        
        
        # Check if the current user is the owner of the event
        if event.owner_id != user.id:
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
        members = Event_Member.query.filter_by(event_id=event.id).all()
        members_list = []
        for member in members:
            member_profile = User_Profile.query.filter_by(user_id=member.user_id).first()
            members_list.append({
                "user_id": member.user_id,
                "name": member_profile.name,
                "last_name": member_profile.last_name,
                "profile_image": member_profile.profile_image,
                "email": User.query.filter_by(id=member.user_id).first().email,
                "event_id": member.event_id,
                "status": member.member_status
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
        joined_events = Event.query.join(Event_Member, Event.id == Event_Member.event_id).filter(Event_Member.user_id == user.id, Event_Member.member_status == "Accepted").all()
        joined_events_list = []
        for event in joined_events:
            owner = User_Profile.query.get(event.owner_id)
            event_timezone = event.start_datetime.strftime("%Z")
            event_details = {
                "id": event.id,
                "name": event.name,
                "owner": {
                    "name": owner.name if owner else None,  # Handle potential missing owner
                    "profile_image": owner.profile_image if owner else None,
                    "user_id":owner.user_id if owner else None
                },
                "location": event.location,
                "start_date": event.start_datetime.strftime("%Y-%m-%d"),
                "start_time": event.start_datetime.strftime("%H:%M:%S"),
                "end_date": event.end_datetime.strftime("%Y-%m-%d"),
                "end_time": event.end_datetime.strftime("%H:%M:%S"),
                "timezone": event_timezone,
                "status": event.status,
                "description": event.description,
                "event_type_id": event.event_type_id,
                "budget_per_person": str(event.budget_per_person)
            }
            joined_events_list.append(event_details)
            
            if joined_events_list == []:
                return jsonify({"msg": "No joined events found"}), 404
            
                
        return jsonify(joined_events_list)
    except Exception as e:
        return jsonify({"error": str(e)})
    
@event_bp.route("/get-user-request", methods=["GET"])
@jwt_required()
def get_applied_events():
    try:
        """
        Retrieve the events that the current user has applied to join.

        This function retrieves the events that the current user has applied to join from the
        database and returns them as a list of JSON objects.

        Returns:
            A JSON response containing a list of the applied events.

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
        applied_events = Event.query.join(Event_Member, Event.id == Event_Member.event_id).filter(Event_Member.user_id == user.id, Event_Member.member_status == "Applied").all()
        applied_events_list = []
        for event in applied_events:
            owner_profile = User_Profile.query.filter_by(user_id=event.owner.id).first()
            private_chat = PrivateChat.query.filter_by(user_id=user.id, event_id=event.id).first()
            private_chat_id = private_chat.id if private_chat else None
            event_details = {
                "id": event.id,
                "name": event.name,
                "private_chat_id": private_chat_id,
                "owner": event.owner_id,
                "owner_name": owner_profile.name,
                "owner_last_name": owner_profile.last_name,
                "owner_img": owner_profile.profile_image,
                "location": event.location,
                "event_type_id": event.event_type_id,
            }
            applied_events_list.append(event_details)
        
        if applied_events_list == []:
            return jsonify({"msg": "No applied events found"}), 404
        
                
        return jsonify(applied_events_list)
    except Exception as e:
        return jsonify({"error": str(e)})
    
@event_bp.route("/get-owner-request", methods=["GET"])
@jwt_required()
def get_owner_requests():
    try:
        """
        Retrieve the events that the current user has applied to join.

        This function retrieves the events that the current user has applied to join from the
        database and returns them as a list of JSON objects.

        Returns:
            A JSON response containing a list of the applied events.

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
        my_events = Event.query.filter_by(owner_id=user.id).all()
        my_events_members = []
        for event in my_events:
            event_members = Event_Member.query.filter_by(event_id=event.id, member_status="Applied").all()
            for member in event_members:
                event_member = {
                    "event_id": event.id,
                    "member_id": member.user_id
                }
                my_events_members.append(event_member)
        join_requests = []
        for event_member in my_events_members:
            event = Event.query.filter_by(id=event_member["event_id"]).first()
            member = User.query.filter_by(id=event_member["member_id"]).first()
            member_profile = User_Profile.query.filter_by(user_id=member.id).first()
            private_chat = PrivateChat.query.filter_by(user_id=member.id, event_id=event.id).first()
            private_chat_id = private_chat.id if private_chat else None
            event_details = {
                "id": event.id,
                "private_chat_id": private_chat_id,
                "name": event.name,
                "member_id": member.id,
                "member_name": member_profile.name,
                "member_last_name": member_profile.last_name,
                "member_img": member_profile.profile_image,
                "location": event.location,
                "event_type_id": event.event_type_id,
            }
            join_requests.append(event_details)
        if join_requests == []:
            return jsonify({"msg": "No join requests found"}), 404
        return jsonify(join_requests)
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
            
        Request JSON:
            {
                "message": "A message to the event owner"
            }

        Returns:
            A JSON response indicating the success or failure of joining the event.
        """
        current_user = get_jwt_identity()
        user = User.query.filter_by(email=current_user).first()
        event = Event.query.filter_by(id=event_id).first()
        event_member = Event_Member.query.filter_by(user_id=user.id, event_id=event.id).first()
        join_message = request.json.get("message", None)
        
        if event_member is not None:
            return jsonify({"msg": "You have already joined this event"}), 403
        
        event_member = Event_Member(user_id=user.id, event_id=event.id, member_status="Applied")
        '''Add the user to the event members'''
        db.session.add(event_member)
        '''Add the private chat between the user and the owner of the event'''
        db.session.add(PrivateChat(user_id=user.id, event_id=event.id))
        db.session.commit()
        
        private_chat = PrivateChat.query.filter_by(user_id=user.id, event_id=event.id).first()
        '''Add the user to the private chat'''
        db.session.add(UsersPrivateChat(user_id=user.id, chat_id=private_chat.id))
        '''Add the owner to the private chat'''
        db.session.add(UsersPrivateChat(user_id=event.owner_id, chat_id=private_chat.id))
        '''Add the join message to the private chat between the user and the owner of the event'''
        db.session.add(Message(private_chat_id=private_chat.id, sender_id=user.id, receiver_id=event.owner_id ,message=join_message, group_type="Private"))
        
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
        '''Do it if u want to delete your chats'''
        # user_private_chat = PrivateChat.query.filter_by(user_id=user.id, event_id=event.id).first()
        # user_group_chat = GroupChat.query.filter_by(user_id=user.id, event_id=event.id).first()
        if event_member is None:
            return jsonify({"msg": "You are not a member of this event"}), 403
        
        db.session.delete(event_member)
        '''Do it if u want to delete your chats'''
        # db.session.delete(user_private_chat)
        # db.session.delete(user_group_chat)
        db.session.commit()
        
        return jsonify({"msg": "left event"}), 200
    except Exception as e:
        return jsonify({"msg": "error leaving event",
                        "error": str(e)}), 500

@event_bp.route("/reject-member/<int:event_id>", methods=["PUT"])
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
        
        if event_member is None:
            return jsonify({"msg": "This user is not a member of the event"}), 403
        elif event_member.member_status == "Rejected":
            return jsonify({"msg": "This user has already been rejected from the event"}), 403
        elif event_member.member_status == "Accepted":
            return jsonify({"msg": "This user has already been accepted to the event"}), 403
        elif event_member.member_status == "Applied":
            event_member.member_status = "Rejected"
            
        
        db.session.commit()
        
        return jsonify({"msg": "member rejected"}), 200
    except Exception as e:
        return jsonify({"msg": "error rejecting member",
                        "error": str(e)}), 500
        
@event_bp.route("/accept-member/<int:event_id>", methods=["PUT"])
@jwt_required()
def accept_member(event_id):
    try:
        """
        Accept a member to a specific event.

        This function allows the owner of a specific event to accept a member to the event's
        members list.

        Args:
            event_id (int): The ID of the event to accept the member to.
            
        Request JSON:
            {
                "member_id": 1
            }

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
        if  event_member.member_status == "Joined":
            return jsonify({"msg": "This user is already a member of the event"}), 403
        elif event_member.member_status == "Rejected":
            return jsonify({"msg": "This user has been rejected from the event"}), 403
        elif event_member.member_status == "Applied":
            event_member.member_status = "Accepted"
        elif event_member is None:
            return jsonify({"msg": "This user has not applied to join the event"}), 403
        
        db.session.commit()
        
        group_chat = GroupChat.query.filter_by(event_id=event.id).first()
        if group_chat is None:
            return jsonify({"msg": "group chat does not exist"}), 404
        '''Add the user to the group chat'''
        db.session.add(UsersGroupChat(user_id=member_id, chat_id=group_chat.id))
        '''Get the user's name and last name to add it to the join message'''
        user_profile = User_Profile.query.filter_by(user_id=member_id).first()
        username = user_profile.name + " " + user_profile.last_name
        '''Add the join message to the group chat'''
        db.session.add(Message(group_chat_id=group_chat.id, sender_id=1,message=username+' has been accepted', group_type="Group"))
        '''Sender ID 1 is the system'''
        db.session.commit()
        
        
        return jsonify({"msg": "member accepted"}), 200
    except Exception as e:
        return jsonify({"msg": "error accepting member",
                        "error": str(e)}), 500
