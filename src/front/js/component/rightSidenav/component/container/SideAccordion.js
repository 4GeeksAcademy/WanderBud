import React, { useState, useContext, useEffect } from "react";
import { ApplyCard } from "../cards/ApplyCard";
import { RequestsCard } from "../cards/RequestCard";
import { GroupCard } from "../cards/GroupsCard";
import Spinner from "react-bootstrap/Spinner";
import { Context } from "../../../../store/appContext";

export const SideAccordion = ({ extraClass, title, show, handler, collapsed, scrollbar }) => {
    const { store, actions } = useContext(Context);
    const startDate = new Date().toLocaleDateString();
    const endDate = new Date().toLocaleDateString();
    const eventdate = `${startDate}${startDate === endDate ? "" : ` ${endDate}`}`;

    return (
        <div className={"accordion w-100 mt-3 " + (scrollbar ? "scrollbar" : "")} id="accordionExample">
            <div className={"accordion-item border-0 " + extraClass}>
                <h2 className="accordion-header position-sticky top-0">
                    <button className={"accordion-button " + (collapsed ? "collapsed" : "")} type="button" data-bs-toggle="collapse" data-bs-target={"#" + title.replace(" ", "")} aria-expanded="true" aria-controls={title.replace(" ", "")}>
                        {title}
                    </button>
                </h2>
                <div id={title.replace(" ", "")} className={"accordion-collapse collapse " + (collapsed ? "" : "show")} data-bs-parent="#accordionExample">
                    <div className="accordion-body m-0 p-0">
                        {title !== "Solicitudes Owner" ? (
                            title === "Solicitudes Enviadas" ?
                                (store.userRequest.length !== 0 ?
                                    <>(Array.isArray(store.userRequest)  ?
                                        ({store.userRequest.map((item, index) => (
                                            <ApplyCard username={item.member_name + " " + item.member_last_name} eventname={item.name} img={item.member_img} member_id={item.member_id} chatId={item.private_chat_id} />
                                        ))}): <p>No hay Solicitudes</p>
                                        )
                                    </>
                                    : <Spinner animation="border" variant="light" />
                                )
                                :
                                <>
                                    <GroupCard eventname={"Dune 2 at the Cinema"} img={"https://media.licdn.com/dms/image/D4D03AQHepyIMxVGZ6A/profile-displayphoto-shrink_800_800/0/1703165598705?e=1719446400&v=beta&t=G3Qe-5D8glPTTi5Ovn20LKlI4no3y6qNuPucDm6ZaNU"} eventdate={eventdate} />
                                    <GroupCard eventname={"Dune 2 at the Cinema"} img={"https://media.licdn.com/dms/image/D4D03AQHepyIMxVGZ6A/profile-displayphoto-shrink_800_800/0/1703165598705?e=1719446400&v=beta&t=G3Qe-5D8glPTTi5Ovn20LKlI4no3y6qNuPucDm6ZaNU"} eventdate={eventdate} />
                                    <GroupCard eventname={"Dune 2 at the Cinema"} img={"https://media.licdn.com/dms/image/D4D03AQHepyIMxVGZ6A/profile-displayphoto-shrink_800_800/0/1703165598705?e=1719446400&v=beta&t=G3Qe-5D8glPTTi5Ovn20LKlI4no3y6qNuPucDm6ZaNU"} eventdate={eventdate} />
                                    <GroupCard eventname={"Dune 2 at the Cinema"} img={"https://media.licdn.com/dms/image/D4D03AQHepyIMxVGZ6A/profile-displayphoto-shrink_800_800/0/1703165598705?e=1719446400&v=beta&t=G3Qe-5D8glPTTi5Ovn20LKlI4no3y6qNuPucDm6ZaNU"} eventdate={eventdate} />
                                    <GroupCard eventname={"Dune 2 at the Cinema"} img={"https://media.licdn.com/dms/image/D4D03AQHepyIMxVGZ6A/profile-displayphoto-shrink_800_800/0/1703165598705?e=1719446400&v=beta&t=G3Qe-5D8glPTTi5Ovn20LKlI4no3y6qNuPucDm6ZaNU"} eventdate={eventdate} />
                                    <GroupCard eventname={"Dune 2 at the Cinema"} img={"https://media.licdn.com/dms/image/D4D03AQHepyIMxVGZ6A/profile-displayphoto-shrink_800_800/0/1703165598705?e=1719446400&v=beta&t=G3Qe-5D8glPTTi5Ovn20LKlI4no3y6qNuPucDm6ZaNU"} eventdate={eventdate} />
                                </>
                        ) :
                            <>
                                (store.ownerRequest.length !== 0 ?
                                <>
                                    {store.ownerRequest.map((item, index) => (
                                        <ApplyCard username={item.member_name + " " + item.member_last_name} eventname={item.name} img={item.member_img} member_id={item.member_id} chatId={item.private_chat_id} />
                                    ))}

                                </>
                                : <Spinner animation="border" variant="light" />
                                )
                            </>}
                    </div>
                </div>
            </div>
        </div>);
}