import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/home";
import { Demo } from "./pages/demo";
import { Single } from "./pages/single";
import Login from "./pages/Login";
import { PasswordReset } from "./pages/password_reset";
import { PasswordRecoveryForm } from "./pages/password_recovery_form"
import injectContext from "./store/appContext";
import Createuser from "./pages/createuser"
import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import { FeedLayout } from "./pages/FeedLayout";
// import { CreateEvent } from "./component/createEvent";



//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";


    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    {/* <Navbar /> */}
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Createuser />} path="/create-user" />
                        <Route element={<PasswordRecoveryForm />} path="/password-recovery" />
                        <Route element={<PasswordReset />} path="/password-reset/:token/*" />
                        <Route element={<Demo />} path="/demo" />
                        <Route element={<FeedLayout />} path="/feed" />
                        {/* <Route element={<FeedLayout children={<CreateEvent />} />} path="/create-event" /> */}
                        <Route element={<Single />} path="/single/:theid" />
                        <Route element={<Login />} path="/login" />
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>
                    {/* <Footer /> */}
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
