import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useContext } from "react";
import { Context } from "../store/appContext";

function GoogleApp(){
const {actions, store} = useContext(Context)

    return(
        <GoogleLogin
    onSuccess={response => {
    const responseDecoded = jwtDecode(response.credential);
    actions.getGoogleOauth(responseDecoded);
    console.log(responseDecoded);
  }}
  onError={() => {
    console.log('Login Failed');
  }}
  useOneTap
/>

    );
}

export default GoogleApp