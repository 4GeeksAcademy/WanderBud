import React, { useContext, useEffect, useState } from "react";
import { Chats } from "./chats";
import { Context } from "../../store/appContext";
import { useParams } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";

export const ChatHandler = () => {
    const { store, actions } = useContext(Context);
    const [chat, setChat] = useState(null);
    const { chat_id } = useParams();

    useEffect(() => {
        actions.getPrivateChat(3156719575).then((res) => {
            console.log(res);
            setChat(res);
        }
        );
    }
        , []);

    return (chat !== null ? <Chats chatData={chat} /> : <Spinner animation="border" />);


}