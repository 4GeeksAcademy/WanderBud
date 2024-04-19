import React, { useContext, useEffect, useState, useSyncExternalStore } from "react";
import "../../styles/event.css";
import { Context } from "../store/appContext";





export const EventPublicView = () => {
    const { store, actions } = useContext(Context);
    console.log(store.publicEvents);

    useEffect(() => {
        let token = localStorage.getItem("token")
        actions.getPublicEvents(token);
    }, []);



    return (
        <>
            <div className="row flex-column">
                {store.publicEvents.map((item, index) => {
                    console.log(item); // Aquí agregamos el console.log para ver el contenido de cada item
                    return (
                        <div className="card-event col-12 mb-3" key={index}>
                            <div className="card2-event">
                                <div className="card-body-event">
                                    <div className="card-top d-flex justify-content-between">
                                            
                                        <h3 className="card-title-event col-8">{item.name}</h3>

                                        <button className="boton-join col-2">Join Us!</button>
                                    </div>
                                    <h4 className="card-date-event mt-3">{item.start_date},   {item.start_time}-{item.end_time}</h4>
                                    <h4 className="card-location-event mt-3">{item.location}</h4>
                                </div>
                                <div className="footer-event mt-2 border">
                                </div>
                                <p>{item.description}</p>
                            </div>
                        </div>
                    );
                })}

            </div>

        </>
    );
};
