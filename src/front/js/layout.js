import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";

import { Home } from "./pages/home";
import Login from "./pages/Login";
import { PasswordReset } from "./pages/password_reset";
import { PasswordRecoveryForm } from "./pages/password_recovery_form"
import injectContext from "./store/appContext";
import SignUp from "./pages/signUp/signUp"
import { FeedLayout } from "./pages/FeedLayout";
import { CreateEvent } from "./component/Events/createEvent";
import { SignUpProfile } from "./pages/signUp/signUpProfile";
import { FeedMain } from "./component/mainFeed/feedMain";
import UserProfile from "./pages/profile";
import Profile from "./pages/profile";



//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<SignUp />} path="/signup/user" />
                        <Route element={<SignUpProfile />} path="/signup/profile" />
                        <Route element={<Profile />} path="/profile" />
                        <Route element={<PasswordRecoveryForm />} path="/password-recovery" />
                        <Route element={<PasswordReset />} path="/password-reset/:token" />
                        <Route element={<FeedLayout children={<FeedMain />} />} path="/feed" />
                        <Route element={<FeedLayout children={<CreateEvent />} />} path="/create-event" />
                        <Route element={<Login />} path="/login" />
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);