import React, { useState } from 'react';
import { useContext } from 'react';
import { Context } from '../store/appContext';
import "../../styles/password.css"

export const PasswordRecoveryForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const {actions, store} = useContext(Context); 
  

  async function handleEmailChange (e) {
    e.preventDefault()
    let email_sent = await actions.PasswordRecoverySubmit(email);
    console.log(email_sent);
    if (email_sent){
      setMessage("Check your email inbox");
    }
    else {
      setMessage("Failed to send email, please try again");
    }
  };



  return (
    <div className='container' id='password-container'>
    <form className='recovery-password-form' onSubmit={handleEmailChange}>
      <input
        className='recovery-password-input'
        type="email"
        placeholder="Enter your email"
        onChange={e => setEmail(e.target.value)}
        value={email}
        required
      />
      <button className='recovery-password-button' type="submit">Submit</button>
      {message && <p className="message">{message}</p>} {/* Mensaje en línea */}
    </form>
    </div>
  );
};


