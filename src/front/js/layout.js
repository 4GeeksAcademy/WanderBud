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
import { UpdateEvent } from "./component/Events/updateEvent";
import { MyEventPrivateView } from "./component/mainFeed/component/myEventPrivateView";
import { EventPrivateView } from "./component/mainFeed/component/eventPrivateView";
import { JoinEventPrivateView } from "./component/mainFeed/component/joinEventPrivateView";
import { ChatHandler } from "./component/chats/chatHandler";

import Profile from "./component/profile/profile";

import { Background } from "./pages/backgroundLoading";
import { ModalAlert } from "./component/modalAlert";
import { AccountContainer } from "./component/Settings/account";





//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ModalAlert />
                <ScrollToTop>
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<SignUp />} path="/signup/user" />
                        <Route element={<SignUpProfile />} path="/signup/profile" />
                        <Route element={<FeedLayout children={<Profile />} />} path="/profile/:user_id" />
                        <Route element={<PasswordRecoveryForm />} path="/password-recovery" />
                        <Route element={<PasswordReset />} path="/password-reset/:token" />
                        <Route element={<FeedLayout children={<FeedMain />} />} path="/feed" />
                        <Route element={<FeedLayout children={<AccountContainer />} to={"/settings/account"} />} path="/settings/account" />
                        <Route element={<FeedLayout children={<CreateEvent />} />} path="/create-event" />
                        <Route element={<FeedLayout children={<UpdateEvent />} />} path="/update-event/:event_id" />
                        <Route element={<FeedLayout children={<ChatHandler />} />} path="/private-chat/:chat_id" />
                        <Route element={<EventPrivateView />} path="/event-view/:event_id/:owner_id" />
                        <Route element={<MyEventPrivateView />} path="/myevent-view/:event_id/:owner_id" />
                        <Route element={<JoinEventPrivateView />} path="/joinevent-view/:event_id/:owner_id" />
                        <Route element={<Login />} path="/login" />
                        <Route element={<Background />} path="/*" />
                    </Routes>
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);