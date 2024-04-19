import React, { useContext, useEffect, useState, useSyncExternalStore } from "react";
import "../../styles/event.css";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";




export const EventPublicView = () => {
const { store, actions } = useContext(Context);
console.log(store.publicEvents);

	useEffect(() => {
        let token = localStorage.getItem("token")
		actions.getPublicEvents(token);
	}, []);
	


	return (
		<>
			<div className="card-people d-flex">
			{store.publicEvents.map((item, index) => {
    console.log(item); // Aquí agregamos el console.log para ver el contenido de cada item
    return (
        <div className="card-group" key={index}>
            <div className="card">
                {/* <img src={imagePeopleUrls[index % imagePeopleUrls.length]} style={{ objectFit: "cover" }} className="card-img-top" alt="..." /> */}
                <div className="card-body">
                    <h5 className="card-title">{item.name}</h5>
                </div>
                <div className="footer">
                    <Link to={`/people/${item.id}`}>
                        <button className="boton-learn">Learn More!</button>
                    </Link>
                </div>
            </div>
        </div>
    );
})}

			</div>
		
        </>
	);
};
