import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { NavbarRight } from "../component/NavbarRight";

import { Context } from "../store/appContext";

const Demo = () => {
    return (
        <div className="main-feed">
            <div className="row border border-5  border-danger">
                <div className="col-md-12">
                    <h1 className="text-center">Feed</h1>
                </div>
            </div>
            <div className="row h-100 border border-5  border-danger">
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
                <div className="col-md-3 p-0 border border-5  border-danger">
                    {/* Left Sidebar */}
                    <div>
                        {/* Content */}
                    </div>
                </div>
                <div className="col-md border border-5  border-danger">
                    {children ? children : <Demo />}
                </div>
                <div className="col-md-3 p-0 border border-5  border-danger">
                    <NavbarRight />
                </div>
            </div>
        </div>
    );
};
