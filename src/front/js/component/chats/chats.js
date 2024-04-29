import React, { useEffect, useState, useRef, useContext } from "react";
import { Container, Row, Col, Dropdown, Button } from "react-bootstrap";
import { FaArrowLeft, FaEllipsisV } from "react-icons/fa";
import { LeftMessage } from "./component/leftMessage";
import { RightMessage } from "./component/rightMessage";
import { Context } from "../../store/appContext";

export const Chats = ({ chatData }) => {
    const { store, actions } = useContext(Context);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [widht, setWidht] = useState(0);
    const [height, setHeight] = useState(0);
    const messagesEndRef = useRef(null);
    const [chat, setChat] = useState(chatData);
    const [messages, setMessages] = useState(chatData.messages);
    const user_id = store.userAccount.id;
    console.log(user_id);

    const toggleDropdown = (event) => {
        setDropdownOpen(!dropdownOpen);
    };
    const handleTime = (time) => {
        const strHour = `${new Date(time).getHours()}:${new Date(time).getMinutes()}`;
        return strHour;
    }
    const handleLoad = (event) => {
        const width = event.target.offsetWidth;
        console.log(width);
        setWidht(width);
    }


    useEffect(() => {
        const height = document.getElementById("chat-input").offsetHeight;
        const width = document.getElementById("header-chat").offsetWidth;
        setHeight(height);
        setWidht(width);
        scrollToBottom();
        console.log(width);
    }, [widht]);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    const RenderMessages = () => {
        return messages.map((message, index) => {
            if (message.sender_id === user_id) {
                return <RightMessage key={index} message={message.message} hour={handleTime(message.sentAt)} />
            } else {
                return <LeftMessage key={index} member_img={chat.receiver.profile_image} message={message.message} hour={handleTime(message.sentAt)} />
            }
        });
    }



    return (
        <Container fluid className="vh-100">
            <Row className="px-2 py-0">
                <Col md={12} className="row container-card container-shadow justify-content-between align-items-center rounded m-0 p-2 chat-top" onLoad={(e) => { handleLoad(e) }} id="header-chat" >
                    <Col md={1} className="d-flex justify-content-center">
                        <Button variant="request" className="p-0">
                            <h3><FaArrowLeft /></h3>
                        </Button>
                    </Col>
                    <Col md={1} className="p-0">
                        <img src={chat.receiver.profile_image || "https://via.placeholder.com/150"} alt="profile" className="rounded-circle w-100 ratio ratio-1x1" style={{ objectFit: "cover", aspectRatio: "1" }} />
                    </Col>
                    <Col md={8} className="d-flex align-items-center flex-column">
                        <h3 className="m-0">{chat.chat_name}'s Chat</h3>
                        <span className="badge badge-pill badge-primary ml-2 text-muted">{chat.members.length} Members</span>
                    </Col>
                    <Col md={1} className="hidden">
                        .
                    </Col>
                    <Col md={1} className="d-flex justify-content-center">
                        <Dropdown show={dropdownOpen} onToggle={toggleDropdown} className="dropdown-left h-100">
                            <Dropdown.Toggle variant="request" className="h-100 p-0 d-flex justify-content-center" id="dropdown-basic">
                                <h3 ><FaEllipsisV /></h3>
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="container-card dropdown-shadow">
                                <Dropdown.Item>Action</Dropdown.Item>
                                <Dropdown.Item>Another action</Dropdown.Item>
                                <Dropdown.Item>Something else</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                </Col>
                <Col md={12} className="row align-content-start m-0 p-0" style={{ height: "90vh" }}>
                    <RenderMessages />
                    <div ref={messagesEndRef} className="row justify-content-end align-items-center m-0 pe-0 ps-2" style={{ height: `${height}px` }} >
                        .
                    </div>
                </Col>
                <Col md={12} className="row container-card container-shadow justify-content-between align-items-center rounded m-0 p-2 chat-bottom" style={{ width: `${widht}px` }} id="chat-input">
                    <Col md={1} className="d-flex justify-content-center">
                        <Button variant="request" className="p-0">
                            <h3><FaArrowLeft /></h3>
                        </Button>
                    </Col>
                    <Col md={10} className="d-flex align-items-center">
                        <input type="text" className="form-control" placeholder="Escribe un mensaje" />
                    </Col>
                    <Col md={1} className="d-flex justify-content-center">
                        <Button variant="request" className="p-0">
                            <h3><FaArrowLeft /></h3>
                        </Button>
                    </Col>
                </Col>
            </Row>
        </Container>
    );
}