from flask import request, jsonify, Blueprint
from api.models import db, User, User_Profile, Message, Event, Event_Member, UsersGroupChat, GroupChat, UsersPrivateChat, PrivateChat
from . import chat_bp
from flask_cors import CORS # type: ignore
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required
from datetime import datetime , timezone


CORS(chat_bp)


@chat_bp.route('/get-private-chat/<int:chat_id>', methods=['GET'])
@jwt_required()
def get_private_chat(chat_id):
    '''
    Get the information of a private chat
    
    Parameters:
    chat_id: int
        The id of the chat
        
    Returns:
    chat: dict
        A dictionary with the information of the chat
        
    Example:
    {
        "chat_id": 1880617169,
        "chat_name": "Frank Pana",
        "event": {
            "budget_per_person": 10.0,
            "date": "2024-05-12 09:00:00",
            "description": "Carrera de 5km por una causa benéfica",
            "event_type_id": 1,
            "id": 4524418169,
            "location": "Campo Grande, Valladolid, Spain",
            "name": "Carrera Popular",
            "owner": 7968294486,
            "status": "Planned"
        },
        "members": [
            {
                "chat_id": 1880617169,
                "id": 1,
                "user_id": 1191637853
            },
            {
                "chat_id": 1880617169,
                "id": 2,
                "user_id": 7968294486
            }
        ],
        "messages": [
            {
                "deliveredAt": null,
                "group_chat_id": null,
                "group_type": "Private",
                "id": 1,
                "message": "Hola, ¿cómo estás?, Me gustaría unirme a tu evento!",
                "private_chat_id": 1880617169,
                "readAt": null,
                "receiver_id": 7968294486,
                "sender_id": 1191637853,
                "sentAt": "2024-04-28 13:50:31"
            },
            {
                "deliveredAt": null,
                "group_chat_id": null,
                "group_type": "Private",
                "id": 2,
                "message": "¡Claro! Sería genial contar contigo. ¿Has visto a qué hora es?",
                "private_chat_id": 1880617169,
                "readAt": null,
                "receiver_id": 1191637853,
                "sender_id": 7968294486,
                "sentAt": "2024-04-28 13:50:31"
            },
            {
                "deliveredAt": null,
                "group_chat_id": null,
                "group_type": "Private",
                "id": 3,
                "message": "Sí, a las 8 PM. ¡Allí estaré!",
                "private_chat_id": 1880617169,
                "readAt": null,
                "receiver_id": 7968294486,
                "sender_id": 1191637853,
                "sentAt": "2024-04-28 13:50:31"
            },
            {
                "deliveredAt": null,
                "group_chat_id": null,
                "group_type": "Private",
                "id": 4,
                "message": "¡Perfecto! Nos vemos allí entonces.",
                "private_chat_id": 1880617169,
                "readAt": null,
                "receiver_id": 1191637853,
                "sender_id": 7968294486,
                "sentAt": "2024-04-28 13:50:31"
            }
        ],
        "receiver": {
            "birthdate": "Tue, 08 May 1984 00:00:00 GMT",
            "cover_image": null,
            "description": "Con una mente inquieta y curiosa, siempre buscando desafíos intelectuales y nuevas experiencias. Apasionado de la tecnología y los videojuegos, disfruto de cada día como una oportunidad para aprender algo nuevo.",
            "last_name": "Pana",
            "location": "Madrid, Spain",
            "name": "Frank",
            "profile_image": "https://res.cloudinary.com/dkfphx3dm/image/upload/v1713896457/ImageUploaderReact/kblcrkev9sohkufkolav.jpg"
        },
        "user_name": "Wander Bud"
    }
    '''
    
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()
    
    chat = PrivateChat.query.get(chat_id)
    if chat is None:
        return jsonify({"msg": "Chat not found"}), 404
    
    members_chat = UsersPrivateChat.query.filter_by(chat_id=chat_id).all()
    if not members_chat:
        return jsonify({"msg": "No members found for this chat"}), 404
    
    receiver = None
    user_name = ""
    for member in members_chat:
        if member.user_id != user.id:
            receiver = User_Profile.query.get(member.user_id)
        elif member.user_id == user.id:
            user_name = User_Profile.query.get(member.user_id).name + " " + User_Profile.query.get(member.user_id).last_name
    
    if user_name == "":
        return jsonify({"msg": "You are not a member of this chat"}), 404
    
    messages = Message.query.filter_by(private_chat_id=chat_id).all()
    messages = sorted(messages, key=lambda x: x.sentAt)
    messages_list = [message.serialize() for message in messages]
    
    
    event = Event.query.get(chat.event_id)
    if event is None:
        return jsonify({"msg": "Event not found"}), 404
    
    chat_data = {
        "chat_name": receiver.name + " " + receiver.last_name if receiver else "",
        "chat_id": chat.id,
        "members": [member.serialize() for member in members_chat],
        "messages": messages_list,
        "receiver": receiver.serialize() if receiver else {},
        "chat_image": receiver.profile_image if receiver else "",
        "event": event.serialize()
    }    
    
    return jsonify(chat_data), 200

@chat_bp.route('/send-private-message/<int:chat_id>', methods=['POST'])
@jwt_required()
def send_private_message(chat_id):
    '''
    Send a message to a private chat
    
    Parameters:
    chat_id: int
        The id of the chat
        
    Returns:
    message: dict
        A dictionary with the information of the message
        
    Example:
    {
        "deliveredAt": null,
        "group_chat_id": null,
        "group_type": "Private",
        "id": 1,
        "message": "Hola, ¿cómo estás?, Me gustaría unirme a tu evento!",
        "private_chat_id": 1880617169,
        "readAt": null,
        "receiver_id": 7968294486,
        "sender_id": 1191637853,
        "sentAt": "2024-04-28 13:50:31"
    }
    '''
    
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()
    
    chat = PrivateChat.query.get(chat_id)
    if chat is None:
        return jsonify({"msg": "Chat not found"}), 404
    
    members_chat = UsersPrivateChat.query.filter_by(chat_id=chat_id).all()
    if not members_chat:
        return jsonify({"msg": "No members found for this chat"}), 404
    
    receiver = None
    for member in members_chat:
        if member.user_id != user.id:
            receiver = member.user_id
    
    if receiver is None:
        return jsonify({"msg": "You are not a member of this chat"}), 404
    
    event_member = Event_Member.query.filter_by(event_id=chat.event_id, user_id=user.id).filter(Event_Member.member_status.in_(['Applied', 'Owner'])).first()
    if event_member is None:
        return jsonify({"msg": "You cant send messages to this chat because you has been already accepted"}), 404
    
    
    message = request.json.get('message')
    if message is None:
        return jsonify({"msg": "Message is required"}), 400
    
    new_message = Message(
        message=message,
        sender_id=user.id,
        receiver_id=receiver,
        private_chat_id=chat_id,
        group_type="Private"
    )
    db.session.add(new_message)
    db.session.commit()
    
    return jsonify(new_message.serialize()), 200

@chat_bp.route('/get-group-chat/<int:chat_id>', methods=['GET'])
@jwt_required()
def get_group_chat(chat_id):
    '''
    Get the information of a group chat
    
    Parameters:
    chat_id: int
        The id of the chat
        
    Returns:
    chat: dict
        A dictionary with the information of the chat
        
    Example:
    {
        "chat_id": 1880617169,
        "chat_name": "Carrera Popular",
        "event": {
            "budget_per_person": 10.0,
            "date": "2024-05-12 09:00:00",
            "description": "Carrera de 5km por una causa benéfica",
            "event_type_id": 1,
            "id": 4524418169,
            "location": "Campo Grande, Valladolid, Spain",
            "name": "Carrera Popular",
            "owner": 7968294486,
            "status": "Planned"
        },
        "members": [
            {
                "chat_id": 1880617169,
                "id": 1,
                "user_id": 1191637853
            },
            {
                "chat_id": 1880617169,
                "id": 2,
                "user_id": 7968294486
            }
        ],
        "messages": [
            {
                "deliveredAt": null,
                "group_chat_id": 1880617169,
                "group_type": "Group",
                "id": 1,
                "message": "Hola, ¿cómo estás?, Me gustaría unirme a tu evento!",
                "private_chat_id": null,
                "readAt": null,
                "receiver_id": null,
                "sender_id": 1191637853,
                "sentAt": "2024-04-28 13:50:31"
            },
            {
                "deliveredAt": null,
                "group_chat_id": 1880617169,
                "group_type": "Group",
                "id": 2,
                "message": "¡Claro! Sería genial contar contigo. ¿Has visto a qué hora es?",
                "private_chat_id": null,
                "readAt": null,
                "receiver_id": null,
                "sender_id": 7968294486,
                "sentAt": "2024-04-28 13:50:31"
            },
            {
                "deliveredAt": null,
                "group_chat_id": 1880617169,
                "group_type": "Group",
                "id": 3,
                "message": "Sí, a las 8 PM. ¡Allí estaré!",
                "private_chat_id": null,
                "readAt": null,
                "receiver_id": null,
                "sender_id": 1191637853,
                "sentAt": "2024-04-28 13:50:31"
            },
            {
                "deliveredAt": null,
                "group_chat_id": 1880617169,
                "group_type": "Group",
                "id": 4,
                "message": "¡Perfecto! Nos vemos allí entonces.",
                "private_chat_id": null,
                "readAt": null,
                "receiver_id": null,
                "sender_id": 7968294486,
                "sentAt": "2024-04-28 13:50:31"
            }
        ],
        "receiver": {},
        "user_name": "Wander Bud"
    }
    '''
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()
    chat = GroupChat.query.get(chat_id)
    if chat is None:
        return jsonify({"msg": "Chat not found"}), 404
    
    user_member = UsersGroupChat.query.filter_by(chat_id=chat_id, user_id=user.id).first()
    if user_member is None:
        return jsonify({"msg": "You are not a member of this chat"}), 404
    
    members = UsersGroupChat.query.filter_by(chat_id=chat_id).all()
    if not members:
        return jsonify({"msg": "No members found for this chat"}), 404
    members_profile = [User_Profile.query.get(member.user_id).serialize() for member in members]
    
    
    messages = Message.query.filter_by(group_chat_id=chat_id).all()    
    messages_list = [message.serialize() for message in messages]
    messages_list = sorted(messages_list, key=lambda x: x['sentAt'])
    for message in messages_list:
        if message['sender_id'] == user.id:
            message['readAt'] = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
            db.session.commit()
        elif message['readAt'] is None:
            message['deliveredAt'] = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
            db.session.commit()
        
    

    event = Event.query.get(chat.event_id)
    if event is None:
        return jsonify({"msg": "Event not found"}), 404

    owner_image = User_Profile.query.get(event.owner_id).profile_image
    
    chat_data = {
        "chat_name": event.name,
        "chat_id": chat.id,
        "members": members_profile,
        "messages": messages_list,
        "chat_image": owner_image,
        "event": event.serialize()
    }
    
    return jsonify(chat_data), 200

@chat_bp.route('/send-group-message/<int:chat_id>', methods=['POST'])
@jwt_required()
def send_group_message(chat_id):
    '''
    Send a message to a group chat
    
    Parameters:
    chat_id: int
        The id of the chat
        
    Returns:
    message: dict
        A dictionary with the information of the message
        
    Example:
    {
        "deliveredAt": null,
        "group_chat_id": 1880617169,
        "group_type": "Group",
        "id": 1,
        "message": "Hola, ¿cómo estás?, Me gustaría unirme a tu evento!",
        "private_chat_id": null,
        "readAt": null,
        "receiver_id": null,
        "sender_id": 1191637853,
        "sentAt": "2024-04-28 13:50:31"
    }
    '''
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()
    
    chat = GroupChat.query.get(chat_id)
    if chat is None:
        return jsonify({"msg": "Chat not found"}), 404
    
    user_member = UsersGroupChat.query.filter_by(chat_id=chat_id, user_id=user.id).first()
    if user_member is None:
        return jsonify({"msg": "You are not a member of this chat"}), 404
    
    message = request.json.get('message')
    if message is None:
        return jsonify({"msg": "Message is required"}), 400
    
    new_message = Message(
        message=message,
        sender_id=user.id,
        group_chat_id=chat_id,
        group_type="Group"
    )
    db.session.add(new_message)
    db.session.commit()
    
    return jsonify(new_message.serialize()), 200
    
    
