import React, { useEffect, useState, useRef, useContext } from "react";
import { Container, Row, Col, Dropdown, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEllipsisV, FaTelegramPlane } from "react-icons/fa";
import { LeftMessage } from "./component/leftMessage";
import { RightMessage } from "./component/rightMessage";
import { Context } from "../../store/appContext";
import { CenterMessage } from "./component/centerMessage";
import { MembersModal } from "./component/MembersModal";

export const Chats = ({ chatData }) => {
    const { store, actions } = useContext(Context);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [widht, setWidht] = useState(0);
    const [height, setHeight] = useState(0);
    const messagesEndRef = useRef(null);
    const [chat, setChat] = useState(chatData);
    const [modalShow, setModalShow] = useState(false);
    const [messages, setMessages] = useState(chatData.messages);
    const [message, setMessage] = useState("");
    const user_id = store.userAccount.id;
    const navigate = useNavigate();

    const sendMessage = (event) => {
        const path = window.location.pathname;
        let type = ""
        if (path.includes("request-chat")) {
            type = "private"
        } else {
            type = "group"
        }
        event.preventDefault();
        if (event.key === "Enter") {
            console.log(message);
            console.log(chat);
            actions.sendMessage(chat.chat_id, message, type).then((resp) => {
                setMessages([...messages, resp]);
                setMessage("");
            }
            )
        } else if (event.type === "click") {
            console.log(message);
            actions.sendMessage(chat.chat_id, message, "private").then((resp) => {
                setMessages([...messages, resp]);
                setMessage("");
            }
            )


        }
    }
    const handleCloseModal = () => {
        setModalShow(false);
    }




    const toggleDropdown = (event) => {
        setDropdownOpen(!dropdownOpen);
    };
    const handleTime = (time) => {
        const strHour = `${new Date(time).getHours()}:${new Date(time).getMinutes()}`;
        return strHour;
    }
    const handleLoad = (event) => {
        const width = event.target.offsetWidth;
        setWidht(width);
    }


    useEffect(() => {
        const height = document.getElementById("chat-input").offsetHeight;
        const width = document.getElementById("header-chat").offsetWidth;
        setHeight(height);
        setWidht(width);
        scrollToBottom();
    }, [widht]);

    useEffect(() => {
        setChat(chatData);
        setMessages(chatData.messages);
    }, [chatData]);


    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };
    const handleLeave = (event_id) => {
        actions.leaveEvent(event_id);
        navigate("/feed");
    }
    const handleAccept = (member_id, event_id) => {
        actions.acceptMember(event_id, member_id);
        navigate("/feed");
    }
    const handleReject = (member_id, event_id) => {
        actions.rejectMember(event_id, member_id);
        navigate("/feed");
    }



    const RenderSettings = () => {
        const event_id = chat.event.id;
        if (chat.messages[0].group_type === "Private") {
            const receiver_id = chat.receiver.user_id;
            if (chat.event.owner === user_id) {
                return (
                    <>
                        <Dropdown.Item className="p-0"><Button variant="info-chat" className="w-100 rounded-0" onClick={(e) => { navigate("/profile/" + receiver_id) }}>View Profile</Button></Dropdown.Item>
                        <Dropdown.Item className="p-0"><Button variant="accept-chat" className="w-100 rounded-0 " onClick={(e) => { handleAccept(receiver_id, event_id) }}>Accept Member</Button></Dropdown.Item>
                        <Dropdown.Item className="p-0"><Button variant="reject-chat" className="w-100 rounded-0" onClick={(e) => { handleReject(receiver_id, event_id) }}>Reject Member</Button></Dropdown.Item>
                    </>
                )
            } else {
                return (
                    <>
                        <Dropdown.Item className="p-0"><Button variant="info-chat" className="w-100 rounded-0" onClick={(e) => { navigate("/profile/" + receiver_id) }}>View Profile</Button></Dropdown.Item>
                        <Dropdown.Item className="p-0"><Button variant="reject-chat" className="w-100 rounded-0" onClick={(e) => { handleLeave(event_id) }}>Leave</Button></Dropdown.Item>
                    </>
                )
            }
        } else {
            console.log(chat.members);
            return (
                <>
                    <Dropdown.Item className="p-0"><Button variant="info-chat" className="w-100 rounded-0" onClick={(e) => { setModalShow(true) }}>More...</Button></Dropdown.Item>
                    {/* <Dropdown.Item className="p-0"><Button variant="reject-chat" className="w-100 rounded-0" onClick={(e) => { handleLeave(event_id) }}>Leave</Button></Dropdown.Item> */}
                </>
            )
        }
    }



    const RenderMessages = () => {
        const messagesPerDay = [];
        let messagesDay = {
            day: null,
            messages: []
        };
        messages.forEach((message, index) => {
            const date = new Date(message.sentAt).toLocaleDateString();
            if (messagesDay.day === null) {
                messagesDay.day = date;
                messagesDay.messages.push(message);
            } else if (messagesDay.day === date) {
                messagesDay.messages.push(message);
            } else {
                messagesPerDay.push(messagesDay);
                messagesDay = {
                    day: date,
                    messages: [message]
                }
            }
            if (index === messages.length - 1) {
                messagesPerDay.push(messagesDay);
            }
        });


        return (
            messagesPerDay.map((day, index) => {
                return (
                    <div key={index} className="p-0">
                        <CenterMessage day={day.day} />
                        {day.messages.map((message, index) => {
                            if (message.sender_id === user_id) {
                                return (
                                    <>
                                        <RightMessage key={index} message={message.message} hour={handleTime(message.sentAt)} member_img={message.sender_img} />
                                    </>
                                )
                            } else if (message.sender_id === 1) {
                                return (
                                    <CenterMessage key={index} day={message.message} />
                                )
                            } else {
                                return (
                                    <LeftMessage key={index} member_img={message.sender_img} message={message.message} hour={handleTime(message.sentAt)} />
                                )
                            }
                        })}
                    </div>
                )
            })
        )
    }



    return (
        <Container fluid className="vh-100">
            <Row className="px-2 py-0">
                <Col md={12} className="d-flex justify-content-center align-items-center">
                    <MembersModal handleClose={handleCloseModal} show={modalShow} members={chat.members} />
                </Col>
                <Col md={12} className="row container-card container-shadow justify-content-between align-items-center rounded m-0 p-2 chat-top" onLoad={(e) => { handleLoad(e) }} id="header-chat" >
                    <Col md={1} className="d-flex justify-content-center">
                        <Button variant="request" className="p-0" onClick={(e) => { navigate(-1) }}>
                            <h3><FaArrowLeft /></h3>
                        </Button>
                    </Col>
                    <Col md={1} className="p-0">
                        <img src={chat.chat_image !== undefined ? chat.chat_image : "https://via.placeholder.com/150"} alt="profile" className="rounded-circle w-100 ratio ratio-1x1" style={{ objectFit: "cover", aspectRatio: "1" }} />
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

                            <Dropdown.Menu className="container-card dropdown-shadow py-1 rounded">
                                <RenderSettings />
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
                    <Col md={11} className="d-flex align-items-center">
                        <input type="text" className="form-control" placeholder="Escribe un mensaje" value={message} onChange={(e) => { setMessage(e.target.value) }} onKeyUp={(e) => { sendMessage(e) }} />
                    </Col>
                    <Col md={1} className="d-flex justify-content-center">
                        <Button variant="request" className="p-0" onClick={(e) => { sendMessage(e) }}>
                            <h3><FaTelegramPlane /></h3>
                        </Button>
                    </Col>
                </Col>
            </Row>
        </Container>
    );
}