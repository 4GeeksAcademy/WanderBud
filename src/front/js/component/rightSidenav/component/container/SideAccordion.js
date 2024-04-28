import React, { useContext } from "react";
import { ApplyCard } from "../cards/ApplyCard";
import { GroupCard } from "../cards/GroupsCard";
import { RequestsCard } from "../cards/RequestCard";
import Spinner from "react-bootstrap/Spinner";
import { Context } from "../../../../store/appContext";

export const SideAccordion = ({ extraClass, title, show, handler, collapsed, scrollbar }) => {
    const { store } = useContext(Context);
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

    const renderUserRequests = () => {
        if (store.userRequest === null) return <div className="d-flex w-100 justify-content-center py-2"><Spinner animation="border" variant="info" /></div>;
        if (store.userRequest.msg === "No applied events found" || store.userRequest.lenght === 0) return <NoRequests title="No has enviado ninguna solicitud" />;
        return store.userRequest.map((item, index) => (
            <ApplyCard key={index} username={`${item.owner_name} ${item.owner_last_name}`} eventname={item.name} img={item.owner_img} owner_id={item.owner_id} chatId={item.private_chat_id} event_id={item.id} />
        ));
    };

    const renderOwnerRequests = () => {
        if (store.ownerRequest === null) return <div className="d-flex w-100 justify-content-center py-2"><Spinner animation="border" variant="info" /></div>;
        if (store.ownerRequest.msg === "No owner request found" || store.ownerRequest.lenght === 0) return <NoRequests title="No te han enviado ninguna solictud" />;
        return store.ownerRequest.map((item, index) => (
            <RequestsCard key={index} username={`${item.member_name} ${item.member_last_name}`} eventname={item.name} img={item.member_img} member_id={item.member_id} chatId={item.private_chat_id} event_id={item.id} />
        ));
    };
    const renderGroupChats = () => {
        if (store.groupChat === null) return <div className="d-flex w-100 justify-content-center py-2"><Spinner animation="border" variant="info" /></div>;
        if (store.groupChat.msg === "No group chat found" || store.groupChat.lenght === 0) return <NoRequests title="No te has unido a ningun grupo" />;
        return store.groupChat.map((item, index) => (
            <GroupCard key={index} eventname={item.event_name} owner_id={item.owner_id} last_message={item.sender_last_message === "System" ? item.last_message : item.sender_last_message + ": " + item.last_message} img={item.owner_img} chatId={item.id} number_messages={item.number_of_messages} />
        ));
    }

    return (
        <div className={`accordion w-100 mt-3 ${scrollbar ? "scrollbar" : ""}`} id="accordionExample">
            <div className={`accordion-item border-0 ${extraClass}`}>
                <h2 className="accordion-header position-sticky top-0">
                    <button className={`accordion-button ${collapsed ? "collapsed" : ""}`} type="button" data-bs-toggle="collapse" data-bs-target={`#${title.replace(" ", "")}`} aria-expanded="true" aria-controls={title.replace(" ", "")}>
                        {title}
                    </button>
                </h2>
                <div id={title.replace(" ", "")} className={`accordion-collapse collapse ${collapsed ? "" : "show"}`} data-bs-parent="#accordionExample">
                    <div className="accordion-body m-0 p-0">
                        {title !== "Solicitudes Owner" ?
                            (title === "Solicitudes Enviadas" ? renderUserRequests() :
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
