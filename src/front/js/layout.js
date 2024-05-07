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
import { ChatHandler } from "./component/chats/chatHandler";
import { UpdateProfile } from "./component/profile/updateProfile";
import { UpdateCoverImage } from "./component/profile/UpdateCoverImage";
import NewsContainer from "./component/Settings/news";
import PrivacyContainer from "./component/Settings/privacy";
import AboutUsContainer from "./component/Settings/aboutUs";
import Profile from "./component/profile/profile";

import { Background } from "./pages/backgroundLoading";
import { ModalAlert } from "./component/modalAlert";
import { AccountContainer } from "./component/Settings/account";
import { HandleProfileImages } from "./component/profile/handleProfileImages";
import EventCard from "./component/Events/eventCard";
import EventPage from "./component/mainFeed/component/eventPage";
import { GroupChatView } from "./component/chats/groupChatView";
import { NotificationsView } from "./component/chats/notificationsView";
import SettingsView from "./component/leftSidenav/settingsView";





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
                        <Route element={<UpdateProfile />} path="/update/profile/:user_id" />
                        <Route element={<UpdateCoverImage />} path="/update-cover/:user_id" />
                        <Route element={<HandleProfileImages />} path="/profile-images/:user_id" />
                        <Route element={<FeedLayout children={<Profile />} />} path="/profile/:user_id" />
                        <Route element={<PasswordRecoveryForm />} path="/password-recovery" />
                        <Route element={<PasswordReset />} path="/password-reset/:token" />
                        <Route element={<FeedLayout children={<FeedMain />} />} path="/feed" />
                        <Route element={<FeedLayout children={<AccountContainer />} to={"/settings/account"} />} path="/settings/account" />
                        <Route element={<FeedLayout children={<NewsContainer />} to={"/settings/news"} />} path="/settings/news" />
                        <Route element={<FeedLayout children={<PrivacyContainer />} to={"/settings/privacy"} />} path="/settings/privacy" />
                        <Route element={<FeedLayout children={<AboutUsContainer />} to={"/settings/about"} />} path="/settings/about" />
                        <Route element={<FeedLayout children={<CreateEvent />} />} path="/create-event" />
                        <Route element={<FeedLayout children={<UpdateEvent />} />} path="/update-event/:event_id" />privacy
                        <Route element={<FeedLayout children={<ChatHandler />} />} path="/request-chat/:chat_id" />
                        <Route element={<FeedLayout children={<ChatHandler />} />} path="/event-chat/:chat_id" />
                        <Route element={<FeedLayout children={<GroupChatView />} />} path="/messages" />
                        <Route element={<FeedLayout children={<NotificationsView />} />} path="/notifications" />
                        <Route element={<FeedLayout children={<EventPage />} />} path="/event/:event_id" />
                        <Route element={<FeedLayout children={<SettingsView />} />} path="/settings" />
                        <Route element={<Login />} path="/login" />
                        <Route element={<Background />} path="/googleOAuth" />
                        <Route element={<Background />} path="/*" />
                        <Route element={<Background />} path="/googleOauth" />
                    </Routes>
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);