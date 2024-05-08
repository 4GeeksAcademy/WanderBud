import React from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { jwtDecode } from "jwt-decode";
import { useContext } from "react";
import { Context } from "../store/appContext";
import { Button } from "react-bootstrap";
import { FaGoogle } from "react-icons/fa";
import { auth } from "../firebaseConfig";

function GoogleApp({ width }) {
  const { actions, store } = useContext(Context)

  const handleGoogle = async (e) => {
    e.preventDefault()
    const provider = await new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const user = result.user;
        const token = await user.getIdToken();
        const decoded = jwtDecode(token);
        actions.getGoogleOauth(decoded);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <Button variant="google" className="rounded-pill w-100" onClick={handleGoogle} >
      <span className="me-2">
        <FaGoogle />
      </span>
      Login with Google
    </Button>

  );
}

export default GoogleApp
