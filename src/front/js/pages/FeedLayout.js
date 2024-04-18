import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import "../../styles/feed.css"

import { Context } from "../store/appContext";

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
                    <p>Feed content goes here...</p>
                </div>
            </div>
        </div>
    );
};

export const FeedLayout = ({ children }) => {
    const { store, actions } = useContext(Context);

    return (
        <div className="container-fluid">
            <div className="row vh-100">
                <div className="col-md-3 p-0">
                    <div className="w-100 p-0 border border-1 border-light sidenav left">
                        {/* Left Sidebar */}
                        This is the left sidebar
                    </div>
                </div>
                <div className="col-md-6 border border border-1 border-light">
                    {children ? children : <Demo />}
                </div>
                <div className="col-md-3 p-0 border border-1 border-light sidenav rightnav">
                    This is the right sidebar
                </div>
            </div>
        </div>
    );
};
