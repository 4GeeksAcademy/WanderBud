import React, { useContext, useEffect } from "react";
import { ApplyCard } from "../cards/ApplyCard";
import { GroupCard } from "../cards/GroupsCard";
import { RequestsCard } from "../cards/RequestCard";
import Spinner from "react-bootstrap/Spinner";
import { Context } from "../../../../store/appContext";

export const SideAccordion = ({ extraClass, title, show, handler, collapsed, scrollbar }) => {
    const { store, actions } = useContext(Context);
    const startDate = new Date().toLocaleDateString();
    const endDate = new Date().toLocaleDateString();
    const eventdate = `${startDate}${startDate === endDate ? "" : ` ${endDate}`}`;

    const NoRequests = ({ title }) => {
        return (
            <div className="d-flex justify-content-center align-items-center request-container">
                <h5 className="my-2">{title}</h5>
            </div>
        );
    };
    useEffect(() => {
        const interval = setInterval(() => {
            if (title === "My applications") {
                actions.getAppliedEvents();
            } else if (title === "My event requests") {
                actions.getOwnerRequest();
            } else {
                actions.getGroupChat();
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [store.appliedPublicEvents, store.ownerRequest, store.groupChat]);


    const renderUserRequests = () => {
        if (store.appliedPublicEvents === null) return <div className="d-flex w-100 justify-content-center py-2"><Spinner animation="border" variant="info" /></div>;
        if (store.appliedPublicEvents.msg === "No applied events found" || store.appliedPublicEvents.lenght === 0) return <NoRequests title="No applied events found" />;
        return store.appliedPublicEvents.map((item, index) => (
            <ApplyCard key={index} username={`${item.owner_name} ${item.owner_last_name}`} eventname={item.name} img={item.owner_img} owner_id={item.owner_id} chatId={item.private_chat_id} event_id={item.id} />
        ));
    };

    const renderOwnerRequests = () => {
        if (store.ownerRequest === null) return <div className="d-flex w-100 justify-content-center py-2"><Spinner animation="border" variant="info" /></div>;
        if (store.ownerRequest.msg === "No owner request found" || store.ownerRequest.lenght === 0) return <NoRequests title="You have no requests" />;
        return store.ownerRequest.map((item, index) => (
            <RequestsCard key={index} username={`${item.member_name} ${item.member_last_name}`} eventname={item.name} img={item.member_img} member_id={item.member_id} chatId={item.private_chat_id} event_id={item.id} />
        ));
    };
    const renderGroupChats = () => {
        if (store.groupChat === null) return <div className="d-flex w-100 justify-content-center py-2"><Spinner animation="border" variant="info" /></div>;
        if (store.groupChat.msg === "No group chat found" || store.groupChat.lenght === 0) return <NoRequests title="you haven't joined any groups" />;
        return store.groupChat.map((item, index) => (
            <GroupCard key={index} eventname={item.event_name} owner_id={item.owner_id} last_message={item.sender_last_message === "System" ? item.last_message : item.sender_last_message + ": " + item.last_message} img={item.owner_img} chatId={item.id} number_messages={item.number_of_messages} />
        ));
    }

    return (
        <div className={`accordion w-100 mt-3 ${scrollbar ? "scrollbar" : ""}`} id="accordionExample">
            <div className={`accordion-item border-0 ${extraClass}`}>
                <h2 className="accordion-header position-sticky top-0">
                    <button className={`accordion-button ${collapsed ? "collapsed" : ""}`} type="button" data-bs-toggle="collapse" data-bs-target={`#${title.replaceAll(" ", "-")}`} aria-expanded="true" aria-controls={title.replaceAll(" ", "-")}>
                        {title}
                    </button>
                </h2>
                <div id={title.replaceAll(" ", "-")} className={`accordion-collapse collapse ${collapsed ? "" : "show"}`} data-bs-parent="#accordionExample">
                    <div className="accordion-body m-0 p-0">
                        {title !== "My event requests" ?
                            (title === "My applications" ? renderUserRequests() :
                                renderGroupChats()
                            )
                            :
                            renderOwnerRequests()
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};
