import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Context } from '../store/appContext';
import "../../styles/password.css"

export const PasswordReset = () => {
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [message, setMessage] = useState('');
  const { actions, store } = useContext(Context);
  const { token } = useParams();

  console.log(password1);
  console.log(password2);
  console.log(token);



  useEffect(() => {
    actions.validateToken(token);
  }, [token])




  function handleResetPassword(e) {
    e.preventDefault()
    if (password1 == password2) {
      actions.resetPassword(password1, token);
      setMessage(store.message)
    }
    else {
      setMessage("passwords don't match, try again");
    }
  };

  return (
    <>
    {store.auth ? <div className="recover-page">

      <div className="justify-content-center align-items-center" style={{ height: '100vh' }}>

        <div className="recover-form">
          <h2>Forgot Your Password?</h2>
          <form onSubmit={handleResetPassword}>
            <input
              type="password"
              placeholder="Enter a new password"
              onChange={e => setPassword1(e.target.value)}
              value={password1}
              required
            />
            <input
              type="password"
              placeholder="Repeat your password"
              onChange={e => setPassword2(e.target.value)}
              value={password2}
              required
            />
            <button type="submit">Submit</button>
            {message && <p className="message">{message}</p>}
          </form>
        </div>

      </div>

    </div> : null}
    </>
  );
};
