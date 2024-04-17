import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";

export const Home = () => {
    const { store, actions } = useContext(Context);
    useEffect(() => {
        actions.validateToken()
    }, [])

    return (
        <div className="container" style={{ backgroundColor: '#1a1f25', color: '#fff', minHeight: '100vh', paddingTop: '50px', position: 'relative' }}>
            <div className="row justify-content-center">
                {/* Columna para el texto "WanderBud" */}
                <div className="col-md-6">
                    <div style={{ position: 'relative', textAlign: 'right' }}>
                        {/* Texto "WanderBud" centrado y desplazado hacia la derecha */}
                        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#fff' }}>WanderBud</h1>

                        {/* Imagen de fondo debajo de "WanderBud" (más pequeña) */}
                        <img src="https://res.cloudinary.com/dkfphx3dm/image/upload/v1713005832/Logo2_t2gs97.jpg" className="img-fluid" alt="Imagen de fondo" style={{ position: 'absolute', top: '375%', left: '75%', transform: 'translate(-50%, -50%)', maxWidth: '330px', maxHeight: '330px', objectFit: 'cover' }} />
                    </div>
                </div>

                {/* Columna para el formulario de inicio de sesión */}
                <div className="col" style={{ width: '300px' }}>
                    <div className="card p-4 mt-5" style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)', width: '60%' }}>
                        <h4 className="text-center mb-4">Connect. Create. Celebrate.</h4>
                        <form>
                            <button type="submit" className="btn btn-primary btn-block rounded-pill mb-3" style={{ width: '60%' }}>Login</button>
                        </form>
                        {/* Establece la anchura del botón de Google según la anchura del botón de Login */}
                        <button type="submit" className="btn btn-danger rounded-pill mb-3" style={{ width: '60%' }}>Google</button>

                        {/* Línea horizontal con texto y líneas decorativas */}
                        <div className="text-center" style={{ margin: '20px 0', position: 'relative', maxWidth: '200px', width: '80%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div className="line" style={{ flex: '1', height: '1px', backgroundColor: '#000000' }}></div>
                            <div style={{ padding: '0 10px', fontSize: '12px' }}>If you don't have one</div>
                            <div className="line" style={{ flex: '1', height: '1px', backgroundColor: '#000000' }}></div>
                        </div>

                        <button type="submit" className="btn btn-light btn-block rounded-pill mb-3 border" style={{ width: '60%' }}>Sign Up</button>
                    </div>
                </div>
            </div>
        </div>

    );
};