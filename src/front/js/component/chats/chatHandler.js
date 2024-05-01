import React, { useContext, useEffect, useState } from "react";
import { Chats } from "./chats";
import { Context } from "../../store/appContext";
import { useParams } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";

export const ChatHandler = () => {
    const { store, actions } = useContext(Context);
    const [chat, setChat] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { chat_id } = useParams();
    const pathname = window.location.pathname;

    useEffect(() => {

        const interval = setInterval(() => {
            if (pathname.includes("request-chat")) {
                actions.getPrivateChat(chat_id)
                    .then((res) => {
                        setChat(res);
                        setLoading(false);
                    })
                    .catch((error) => {
                        setError(error);
                        setLoading(false);
                    });
            } else if (pathname.includes("event-chat")) {
                actions.getEventChat(chat_id)
                    .then((res) => {
                        setChat(res);
                        setLoading(false);
                    })
                    .catch((error) => {
                        setError(error);
                        setLoading(false);
                    });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [chat_id]);

    if (loading) {
        return <Spinner animation="border" />;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return <Chats chatData={chat} />;
}
