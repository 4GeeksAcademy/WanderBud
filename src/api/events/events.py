from enum import Enum
from flask import request, jsonify, Blueprint # type: ignore
from api.models import db, User, Event, Event_Type, Event_Member, User_Profile, Message , GroupChat, UsersGroupChat, PrivateChat, UsersPrivateChat, Favorite
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
        coords = request.json.get("coords", None)
        location_name = request.json.get("location_name", None)
        if location_name != None:
            location = location_name
        '''Check if the event type exists'''
        new_event = Event(
            name=name,
            owner_id=owner_id,
            location=location,
            location_name=location_name,
            latitude=coords["lat"],
            longitude=coords["lng"],
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
        '''Add the welcome message to the group chat'''
        message_created = Message(group_chat_id=group_chat.id, sender_id=1, message="Welcome to "+name+"'s event", group_type="Group")
        db.session.add(message_created)
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
            event_type_name = Event_Type.query.get(event.event_type_id).name
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
                "event_type_name": event_type_name,
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
        members = Event_Member.query.filter_by(event_id=event.id, member_status="Accepted").all()
        members_list = []
        for member in members:
            member_profile = User_Profile.query.get(member.user_id)
            members_list.append({
                "user_id": member.user_id,
                "name": member_profile.name,
                "last_name": member_profile.last_name,
                "profile_image": member_profile.profile_image,
                "status": member.member_status
            })
        
        event_details = {
            "id": event.id,
            "name": event.name,
                "owner": {
                    "name": owner.name if owner else None,  # Handle potential missing owner
                    "last_name": owner.last_name if owner else "",
                    "profile_image": owner.profile_image if owner else None,
                    "user_id": owner.user_id if owner else None
                },
            "members": members_list,
            "location": event.location,
            "location_name": event.location_name if event.location_name else event.location,
            "coordinates": {
                "lat": event.latitude,
                "lng": event.longitude
                },
            "start_date": event.start_datetime,
            "end_date": event.end_datetime,
            "status": event.status,
            "description": event.description,
            "event_type_id": event.event_type_id,
            "event_type_name": Event_Type.query.get(event.event_type_id).name,
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
                    "last_name": owner.last_name if owner else "",
                    "profile_image": owner.profile_image if owner else None,
                    "user_id":owner.user_id if owner else None
                },
                "location": event.location,
                "location_name": event.location_name if event.location_name  else event.location,
                "start_date": event.start_datetime.strftime("%Y-%m-%d"),
                "start_time": event.start_datetime.strftime("%H:%M:%S"),
                "end_date": event.end_datetime.strftime("%Y-%m-%d"),
                "end_time": event.end_datetime.strftime("%H:%M:%S"),
                "status": event.status,
                "description": event.description,
                "event_type_id": event.event_type_id,
                "event_type_name": Event_Type.query.get(event.event_type_id).name,
                "budget_per_person": str(event.budget_per_person)
            })
            
            if events_list == []:
                return jsonify([]), 404
            
        return jsonify(events_list), 200
    except Exception as e:
        return jsonify({"msg": "error retrieving events",
                        "error": str(e)}), 500

@event_bp.route("/get-event-by-radius", methods=["GET"])
@jwt_required()
def get_event_by_radius():
    try:
        user_location = request.args.get("coords")
        radius = float(request.args.get("radius"))
        page = int(request.args.get("page", 1))  # Página predeterminada es 1 si no se proporciona
        
        user_location_coords = user_location.split(",")
        user_location_coords[0] = user_location_coords[0].split(":")[1]
        user_location_coords[1] = user_location_coords[1].split(":")[1].replace("}","")
        user_location = {"lat": float(user_location_coords[0]), "lng": float(user_location_coords[1])}
        
        user = User.query.filter_by(email=get_jwt_identity()).first()
        

        all_events = Event.query.filter(Event.owner_id!=user.id)  # Paginación de 10 eventos por página
        
        events = all_events.paginate(page=page, per_page=100)
        
        
        event_coords = [{"lat": event.latitude, "lng": event.longitude} for event in events.items]
        
        events_list_address = get_address_in_radius(user_location, radius, event_coords)

        events_list = []
        for event in events.items:
            event_coords = {"lat": event.latitude, "lng": event.longitude}
            if event_coords in events_list_address:
                owner = User_Profile.query.get(event.owner_id)
                event_details = {
                    "id": event.id,
                    "name": event.name,
                    "owner": {
                        "name": owner.name if owner else None,  # Handle potential missing owner
                        "last_name": owner.last_name if owner else "",
                        "profile_image": owner.profile_image if owner else None,
                        "user_id": owner.user_id if owner else None
                    },
                    "location": event.location,
                    "location_name": event.location_name if event.location_name else event.location,
                    "coordinates": {
                        "lat": event.latitude,
                        "lng": event.longitude
                    },
                    "start_date": event.start_datetime.strftime("%Y-%m-%d"),
                    "start_time": event.start_datetime.strftime("%H:%M:%S"),
                    "end_date": event.end_datetime.strftime("%Y-%m-%d"),
                    "end_time": event.end_datetime.strftime("%H:%M:%S"),
                    "status": event.status,
                    "description": event.description,
                    "event_type_id": event.event_type_id,
                    "event_type_name": Event_Type.query.get(event.event_type_id).name,
                    "budget_per_person": str(event.budget_per_person)
                }
                events_list.append(event_details)
                
        if not events_list:
            return jsonify({"msg": "No events found in the given radius"}), 404    
        return jsonify(events_list), 200
    except Exception as e:
        return jsonify({"msg": "Error retrieving events", "error": str(e)}), 500

        
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
        
        print(request.json)
        
        event.name = request.json.get("name")
        event.location = request.json.get("location")
        event.location_name = request.json.get("location_name") if request.json.get("location_name") else request.json.get("location")
        event.latitude = request.json.get("coords").get("lat")
        event.longitude = request.json.get("coords").get("lng")
        event.start_datetime = request.json.get("start_datetime")
        event.end_datetime = request.json.get("end_datetime")
        event.description = request.json.get("description")
        event.event_type_id = request.json.get("event_type_id")
        event.budget_per_person = request.json.get("budget_per_person")
        
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
        if event is None:
            return jsonify({"msg": "event does not exist"}), 404
        
        
        # Check if the current user is the owner of the event
        if event.owner_id != user.id:
            return jsonify({"msg": "You are not the owner of this event"}), 403
        event_member = Event_Member.query.filter_by(event_id=event.id).all()
        for member in event_member:
            db.session.delete(member)
        
        private_chat = PrivateChat.query.filter_by(event_id=event.id).all()
        for chat in private_chat:
            messages = Message.query.filter_by(private_chat_id=chat.id).all()
            for message in messages:
                db.session.delete(message)
            user_private_chat = UsersPrivateChat.query.filter_by(chat_id=chat.id).all()
            for user_chat in user_private_chat:
                db.session.delete(user_chat)
            db.session.delete(chat)
        group_chat = GroupChat.query.filter_by(event_id=event.id).first()
        if group_chat != None:
            messages = Message.query.filter_by(group_chat_id=group_chat.id).all()
            for message in messages:
                db.session.delete(message)
            user_group_chat = UsersGroupChat.query.filter_by(chat_id=group_chat.id).all()
            for user_chat in user_group_chat:
                db.session.delete(user_chat)
            db.session.delete(group_chat)
        
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
                    "last_name": owner.last_name if owner else "",
                    "profile_image": owner.profile_image if owner else None,
                    "user_id":owner.user_id if owner else None
                },
                "location": event.location,
                "location_name": event.location_name if event.location_name != "" else event.location,
                "coordinates": {
                    "lat": event.latitude,
                    "lng": event.longitude
                },
                "start_date": event.start_datetime.strftime("%Y-%m-%d"),
                "start_time": event.start_datetime.strftime("%H:%M:%S"),
                "end_date": event.end_datetime.strftime("%Y-%m-%d"),
                "end_time": event.end_datetime.strftime("%H:%M:%S"),
                "timezone": event_timezone,
                "status": event.status,
                "description": event.description,
                "event_type_id": event.event_type_id,
                "event_type_name": Event_Type.query.get(event.event_type_id).name,
                "budget_per_person": str(event.budget_per_person)
            }
            joined_events_list.append(event_details)
            
            if joined_events_list == []:
                return jsonify([]), 404
            
                
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

        Example Response:
            [
                {
                    "id": 1,
                    "name": "My Event",
                    "private_chat_id": 1,
                    "owner_id": 1,
                    "owner_name": "John",
                    "owner_last_name": "Doe",
                    "owner_img": "image.jpg",
                    "location": "New York",
                    "event_type_id": 1
                }
            ]
        """
        current_user = get_jwt_identity()
        user = User.query.filter_by(email=current_user).first()
        applied_events = Event.query.join(Event_Member, Event.id == Event_Member.event_id).filter(Event_Member.user_id == user.id, Event_Member.member_status == "Applied").all()
        applied_events_list = []
        for event in applied_events:
            owner_profile = User_Profile.query.filter_by(user_id=event.owner_id).first()
            private_chat = PrivateChat.query.filter_by(user_id=user.id, event_id=event.id).first()
            private_chat_id = private_chat.id if private_chat else None
            event_details = {
                "id": event.id,
                "name": event.name,
                "private_chat_id": private_chat_id,
                "owner_id": event.owner_id,
                "owner_name": owner_profile.name,
                "owner_last_name": owner_profile.last_name,
                "owner_img": owner_profile.profile_image,
                "location": event.location,
                "event_type_id": event.event_type_id,
            }
            applied_events_list.append(event_details)
        
        if applied_events_list == []:
            return jsonify([]), 202
        
                
        return jsonify(applied_events_list), 200
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

        Example response:
            [
                {
                    "id": 1,
                    "name": "My Event",
                    "private_chat_id": 1,
                    "member_id": 1,
                    "member_name": "John",
                    "member_last_name": "Doe",
                    "member_img": "image.jpg",
                    "location": "New York",
                    "event_type_id": 1
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
            return jsonify([]), 202
        return jsonify(join_requests),200
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
    
@event_bp.route("/leave-event/<int:event_id>", methods=["DELETE"])
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
        private_chat = PrivateChat.query.filter_by(user_id=user.id, event_id=event.id).first()
        user_private_chat = UsersPrivateChat.query.filter_by(chat_id=private_chat.id).all()
        private_chat_messages = Message.query.filter_by(private_chat_id=private_chat.id).all()
        
        event_group_chat = GroupChat.query.filter_by(event_id=event.id).first()
        user_group_chat = None
        if private_chat_messages != None:
            for message in private_chat_messages:
                db.session.delete(message)
        if user_private_chat != None:
            for chat in user_private_chat:
                db.session.delete(chat)
        if event_group_chat != None:
            user_group_chat = UsersGroupChat.query.filter_by(user_id=user.id, chat_id=event_group_chat.id).first()
        if event_member is None:
            return jsonify({"msg": "You are not a member of this event"}), 403
        
        db.session.delete(event_member)
        '''Do it if u want to delete your chats'''
        if user_private_chat is not None:
            for chat in user_private_chat:
                db.session.delete(chat)
        if user_group_chat is not None:
            db.session.delete(user_group_chat)
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
        
        member_id = request.json.get("member_id")
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
        print("Event member status: ", event_member.member_status)
        
        group_chat = GroupChat.query.filter_by(event_id=event.id).first()
        if group_chat is None:
            return jsonify({"msg": "group chat does not exist"}), 404
        
        print("Group chat ID: ", group_chat.id)
        '''Add the user to the group chat'''
        db.session.add(UsersGroupChat(user_id=member_id, chat_id=group_chat.id))
        print("User added to group chat")
        '''Get the user's name and last name to add it to the join message'''
        user_profile = User_Profile.query.filter_by(user_id=member_id).first()
        username = user_profile.name + " " + user_profile.last_name
        '''Add the join message to the group chat'''
        db.session.add(Message(group_chat_id=group_chat.id, sender_id=1,message=username+' has been accepted', group_type="Group"))
        '''Sender ID 1 is the system'''
        db.session.commit()
        
        
        return jsonify({"msg": "member accepted"}), 200
    except Exception as e:
        return jsonify({"msg": "error accepting member ",
                        "error": str(e)}), 500

@event_bp.route("/get-my-groups-chat", methods=["GET"])
@jwt_required()
def get_my_groups_chat():
    try:
        """
        Retrieve the group chats that the current user is a part of.

        This function retrieves the group chats that the current user is a part of from the
        database and returns them as a list of JSON objects.

        Returns:
            A JSON response containing a list of the group chats that the current user is a part of.

        Example JSON response:
            [
                {
                    "id": 1,
                    "event_id": 1,
                    "event_name": "My Event",
                    "event_owner": "John Doe",
                    "event_owner_img": "image.jpg"
                }
            ]
        """
        current_user = get_jwt_identity()
        user = User.query.filter_by(email=current_user).first()
        group_chats = GroupChat.query.join(UsersGroupChat, GroupChat.id == UsersGroupChat.chat_id).filter(UsersGroupChat.user_id == user.id).all()
        group_chats_list = []
        print(group_chats)
        for group_chat in group_chats:
            event = Event.query.filter_by(id=group_chat.event_id).first()
            owner_profile = User_Profile.query.filter_by(user_id=event.owner_id).first()
            last_message = Message.query.filter_by(group_chat_id=group_chat.id).order_by(Message.sentAt.desc()).first()
            if last_message is None:
                last_message_sender = User.query.filter_by(id=1).first()
            else:
                last_message_sender = User.query.filter_by(id=last_message.sender_id).first()
            sender_fullname = ""
            if last_message_sender.id is 1:
                sender_fullname = "System"
            elif last_message_sender.id is not 1:
                sender_profile = User_Profile.query.filter_by(user_id=last_message_sender.id).first()
                sender_fullname = sender_profile.name + " " + sender_profile.last_name
            number_of_messages = Message.query.filter_by(group_chat_id=group_chat.id).count()
            
            group_chat_details = {
                "id": group_chat.id,
                "event_id": event.id,
                "event_name": event.name,
                "owner": owner_profile.name,
                "owner_id": owner_profile.user_id,
                "owner_img": owner_profile.profile_image,
                "sender_last_message": sender_fullname,
                "last_message": last_message.message if last_message else None,
                "number_of_messages": number_of_messages
            }
            print(group_chat_details)
            group_chats_list.append(group_chat_details)
        if group_chats_list == []:
            return jsonify({"msg": "You are not a member of any event"}), 202
        return jsonify(group_chats_list), 200
    except Exception as e:
        return jsonify({"msg": "error retrieving group chats",
                        "error": str(e)}), 500
    

@event_bp.route('/add_favorite', methods=['POST'])
@jwt_required()
def add_favorite():
    user_id = request.json.get('user_id')
    event_id = request.json.get('event_id')

    if not user_id or not event_id:
        return jsonify({'error': 'Faltan datos necesarios'}), 400
    
    favorites = Favorite.query.filter_by(user_id=user_id, event_id=event_id).first()
    if favorites:
        return jsonify({'error': 'El evento ya está en tus favoritos'}), 400
    new_favorite = Favorite(user_id=user_id, event_id=event_id)
    db.session.add(new_favorite)
    try:
        db.session.commit()
        return jsonify(new_favorite.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@event_bp.route('/user_favorites/<int:user_id>', methods=['GET'])
@jwt_required()
def list_favorites(user_id):
    # Obtén el user_id del token JWT
    
    # Busca solo los favoritos del usuario autenticado
    favorites = Favorite.query.filter_by(user_id=user_id).all()
    if favorites is None:
        return jsonify([]), 202
    list_favorites = []
    for favorite in favorites:
        event = Event.query.filter_by(id=favorite.event_id).first()
        owner = User_Profile.query.filter_by(user_id=event.owner_id).first()
        
        event_details = {
            "id": event.id,
            "name": event.name,
                "owner": {
                    "name": owner.name if owner else None,  # Handle potential missing owner
                    "profile_image": owner.profile_image if owner else None,
                    "user_id": owner.user_id if owner else None
                },
            "location": event.location,
            "coordinates": {
                "lat": event.latitude,
                "lng": event.longitude
                },
            "start_date": event.start_datetime,
            "end_date": event.end_datetime,
            "status": event.status,
            "description": event.description,
            "event_type_id": event.event_type_id,
            "budget_per_person": str(event.budget_per_person)
        }
        list_favorites.append(event_details)
        
    return jsonify(list_favorites), 200


@event_bp.route("/remove-favorite/<int:event_id>", methods=["DELETE"])
@jwt_required()
def remove_favorite(event_id):
    """
    Remove a specific event from user's favorites.

    This function removes an event from the list of user's favorites in the database.

    Returns:
        A JSON response indicating the success or failure of the operation.
    """
    email = get_jwt_identity() 
    user=User.query.filter_by(email=email).first() 
    
    
    if not event_id:
        return jsonify({'msg': 'Falta el ID del evento'}), 400

    try:
        # Buscar el registro del favorito en la base de datos
        favorite = Favorite.query.filter_by(user_id=user.id, event_id=event_id).first()
        if not favorite:
            return jsonify({'msg': 'Favorito no encontrado'}), 404
        
        db.session.delete(favorite)
        db.session.commit()
        
        return jsonify({'msg': 'Favorito eliminado con éxito'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'msg': 'Error eliminando el favorito', 'error': str(e)}), 500

