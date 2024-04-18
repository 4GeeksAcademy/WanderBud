import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa el archivo CSS de Bootstrap



    export const Home = () => {
        const { store, actions } = useContext(Context);
        return (
            <div className="container-fluid" style={{ backgroundColor: '#1a1f25', color: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="row justify-content-center">
                {/* Columna para el texto "WanderBud" */}
                <div className="col-md-6 text-right">
                    <div>
                        {/* Texto "WanderBud" centrado y desplazado hacia la derecha */}
                        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#fff', marginBottom: '20px' }}>WanderBud</h1>


                        {/* Imagen de fondo debajo de "WanderBud" (más pequeña) */}
                        <img src="https://res.cloudinary.com/dkfphx3dm/image/upload/v1713005832/Logo2_t2gs97.jpg" className="img-fluid" alt="Imagen de fondo" style={{ maxWidth: '330px', maxHeight: '330px', objectFit: 'cover' }} />
                    </div>
                </div>


                {/* Columna para el formulario de inicio de sesión */}
                <div className="col-md-4">
                    <div className="card p-4" style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)' }}>
                        <h4 className="text-center mb-4">Connect. Create. Celebrate.</h4>
                        <Link to="/login" className="btn btn-primary btn-block rounded-pill mb-3">
                                Login
                            </Link>
                        {/* Botón de inicio de sesión con Google */}
                        <form>
                            <button type="submit" className="btn btn-danger btn-block rounded-pill mb-3">Google</button>
                        </form>
                        {/* Línea horizontal con texto */}
                        <div className="text-center mb-3" style={{ borderBottom: '1px solid #000', lineHeight: '0.1em' }}>
                            <span style={{ background: '#fff', padding: '0 10px', fontSize: '12px' }}>If you don't have one</span>
                        </div>
                        {/* Botón de registro */}
                        <Link to="/create-user" className="btn btn-light btn-block rounded-pill border" style={{ textDecoration: 'none' }}>
                        Sign Up
                            </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
