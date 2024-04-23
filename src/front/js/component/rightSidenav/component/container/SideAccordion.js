import React, { useState } from "react";
import { ApplyCard } from "../cards/ApplyCard";
import { RequestsCard } from "../cards/RequestCard";
import { GroupCard } from "../cards/GroupsCard";

export const SideAccordion = ({ extraClass, title, show, handler, collapsed, scrollbar }) => {
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
                        {title !== "Join Requests" ? (
                            title === "Apply Requests" ?
                                <>
                                    <ApplyCard username={"Bruno Murua"} eventname={"Dune 2 at the Cinema"} img={"https://media.licdn.com/dms/image/D4D03AQHepyIMxVGZ6A/profile-displayphoto-shrink_800_800/0/1703165598705?e=1719446400&v=beta&t=G3Qe-5D8glPTTi5Ovn20LKlI4no3y6qNuPucDm6ZaNU"} chatId={1} />
                                    <ApplyCard username={"Osian Lezcano"} eventname={"Alone in my House :("} img={"https://ca.slack-edge.com/T0BFXMWMV-U064ZSVS678-877ce3b7e9a7-512"} chatId={2} />
                                </>
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
                                <RequestsCard username={"Bruno Murua"} eventname={"Dune 2 at the Cinema"} img={"https://media.licdn.com/dms/image/D4D03AQHepyIMxVGZ6A/profile-displayphoto-shrink_800_800/0/1703165598705?e=1719446400&v=beta&t=G3Qe-5D8glPTTi5Ovn20LKlI4no3y6qNuPucDm6ZaNU"} />
                                <RequestsCard username={"Osian Lezcano"} eventname={"Alone in my House :("} img={"https://ca.slack-edge.com/T0BFXMWMV-U064ZSVS678-877ce3b7e9a7-512"} />
                            </>}
                    </div>
                </div>
            </div>
        </div>);
}