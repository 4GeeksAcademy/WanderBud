import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importado una sola vez
import "../styles/index.css"; // Tus estilos personalizados
import { CssVarsProvider } from '@mui/joy';

import { GoogleOAuthProvider } from '@react-oauth/google';
import Layout from './layout'; // Tu componente principal que posiblemente incluye la lógica de inicio de sesión


// Renderizar tu aplicación React
ReactDOM.render(
  <GoogleOAuthProvider clientId={process.env.GOOGLE_OAUTH_ID}>
    <Layout />
  </GoogleOAuthProvider>,
  document.querySelector("#app")
);