import React, { useState, useContext } from 'react';
import { Context } from "../store/appContext";
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    onSuccess: tokenResponse => {
      console.log(tokenResponse);
      // Aquí podrías extraer el token y guardar el estado del usuario o hacer una solicitud a tu backend
      // actions.loginWithGoogle(tokenResponse.access_token);
      navigate("/feed");
    },
    onError: error => {
      console.log("Login Failed:", error);
    }
  });

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(email, password);
    let logged = await actions.login(email, password);
    if (logged) {
      navigate("/feed");
      actions.validateUserProfile();
    }
  }

  return (
    <Container fluid className="container-fluid">
      <Row className="vh-100 justify-content-center align-items-center">
        <Col md={5}>
          <Card className="p-4 justify-content-center w-100 card container-card container-shadow">
            <Card.Title className="text-center mb-3 subtitle subtitle-bold"><h4>Log In</h4></Card.Title>
            <Form onSubmit={handleSubmit} className="p-4 py-0">
              <Button variant="google" className="w-100" onClick={() => googleLogin()}>Sign in with Google</Button>
              <hr className="border border-secondary mb-3" />
              <Form.Group controlId="formBasicEmail" className="mb-3">
                <Form.Control type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
              </Form.Group>
              <Form.Group controlId="formBasicPassword" className="mb-3">
                <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
              </Form.Group>
              <Button variant="secondary" type="submit" className="w-100">
                Login
              </Button>
              <Form.Text>
                <Link to="/password-recovery">Forgot Password?</Link>
              </Form.Text>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;



// import React, { useState, useContext, useEffect } from 'react';
// import { Context } from "../store/appContext";
// import { useNavigate } from 'react-router-dom';
// import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
// import GoogleLogin from 'react-google-login';
// import { gapi } from "gapi-script"


// export const Login = () => {

//   // const clientId = "467490747977-ibcvrqifhfoj80vm3j3publt6egneu0s.apps.googleusercontent.com";


//   // useEffect(() => {
//   //   const start = () =>{
//   //     gapi.auth2.init({
//   //       clientId: clientId,
//   //     })
//   //   }
//   //   gapi.load("client:auth2", start)
//   // }, [])

//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const { store, actions } = useContext(Context)
//   const navigate = useNavigate()
//   console.log(email);
//   console.log(password);

//   // const onSuccess = (response) =>{
//   //   console.log(response);
//   // }

//   // const onFailure = () =>{
//   //   console.log("Something went wrong");
//   // }



//   async function handleSubmit(e) {
//     e.preventDefault()
//     console.log(email, password);
//     let logged = await actions.login(email, password)
//     if (logged) {
//       navigate("/feed")
//       actions.validateUserProfile()
//     }
    
//   }

//   return (
//     <Container fluid className="container-fluid">
//       <Row className="vh-100 justify-content-center align-items-center">
//         <Col md={5}>
//           <Card className="p-4 justify-content-center w-100 card container-card container-shadow">
//             <Card.Title className="text-center mb-3 subtitle subtitle-bold"><h4>Log In</h4></Card.Title>
//             <Form onSubmit={handleSubmit} className="p-4 py-0">
//               <Button variant="google" className="w-100">Google</Button>
//               <hr className="border border-secondary mb-3" />
//               <Form.Group controlId="formBasicEmail" className="mb-3">
//                 <Form.Control type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
//               </Form.Group>

//               <Form.Group controlId="formBasicPassword" className="mb-3">
//                 <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
//               </Form.Group>

//               <Button variant="secondary" type="submit" className="w-100">
//                 Login
//               </Button>
//               <Form.Text>
//                 <Link to="/password-recovery">Forgot Password?</Link>
//               </Form.Text>
//             </Form>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };
// export default Login;