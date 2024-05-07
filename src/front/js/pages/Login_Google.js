import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useContext } from "react";
import { Context } from "../store/appContext";

function GoogleApp({ width }) {
  const { actions, store } = useContext(Context)

  return (
    <GoogleLogin
      onSuccess={response => {
        const responseDecoded = jwtDecode(response.credential);
        actions.getGoogleOauth(responseDecoded);
      }}
      theme="filled_black"
      onError={() => {
        console.log('Login Failed');
      }}
      shape="pill"
    />

  );
}

export default GoogleApp
