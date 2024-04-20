import React, { useContext } from 'react';
import LeftSidebar from '../component/leftsidebar';
import { Context } from '../store/appContext';
import { NavbarRight } from "../component/NavbarRight";

import { EventPublicView } from "../component/eventPublicView";
import "../../styles/feed.css";
const Demo = () => {
    return (
        <div className="main-feed">
            <div className="row border-1 border-light border-bottom p-0 py-2 title-container">
                <div className="col-md-12">
                    <h1 className="text-center title-feed m-0">Feed</h1>
                </div>
            </div>
            <div className="row vh-100 border-bottom border-1 border-light p-0 px-2">
                <div className="col-md-12">
                    <p></p>
                    <EventPublicView />
                </div>
            </div>
        </div>
    );
};

export const FeedLayout = ({ children }) => {
    const { store, actions } = useContext(Context);

    const changeContent = (option) => {
        // Aquí puedes actualizar el estado o hacer cualquier acción necesaria
        console.log('Changing content to:', option);
    };

    return (
        <div className="container-fluid">
            <div className="row vh-100">
                <div className="col-md-3 p-0">
                    <LeftSidebar changeContent={changeContent} />
                </div>
                <div className="col-md-6 border border border-1 border-light">
                    {children ? children : <Demo />}
                </div>
                <div className="col-md-3 p-0">
                    {<NavbarRight />}

                </div>
            </div>
        </div>
    );
};