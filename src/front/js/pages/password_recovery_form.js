import React, { useState } from 'react';
import { useContext } from 'react';
import { Context } from '../store/appContext';
import "../../styles/password.css"

export const PasswordRecoveryForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const { actions, store } = useContext(Context);


  async function handleEmailChange(e) {
    e.preventDefault()
    let email_sent = await actions.PasswordRecoverySubmit(email);
    console.log(email_sent);
    if (email_sent) {
      setMessage("Check your email inbox");
    }
    else {
      setMessage("Failed to send email, please try again");
    }
  };

  return (
    <div className="recover-page">

      <div className="justify-content-center align-items-center" style={{ height: '100vh' }}>

        <div className="recover-form">
          <h2>Forgot Your Password?</h2>
          <form onSubmit={handleEmailChange}>
            <input
              type="email"
              placeholder="Enter your email"
              onChange={e => setEmail(e.target.value)}
              value={email}
              required
            />
            <button type="submit">Submit</button>
            {message && <p className="message">{message}</p>}
          </form>
        </div>

      </div>

    </div>
  );
};



