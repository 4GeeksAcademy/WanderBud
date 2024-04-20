import React, { useState, useContext } from 'react';
import { Context } from '../store/appContext';
import { useNavigate } from 'react-router-dom';


const CreateUser = () => {
  const { actions } = useContext(Context); // Obtén las acciones desde el contexto
  const navigate = useNavigate();
  const[confirmpassword, setConfirmpassword] = useState("")
  const [userData, setUserData] = useState({
    email: '',
    password: '',
    is_active: true
  });




  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verifica si las contraseñas coinciden
    if (userData.password !== confirmpassword) {
      alert('Error: Las contraseñas no coinciden');
      return;
    }

    try {
      const success = await actions.createUser(userData); // Llama a la acción createUser del contexto
      if (success) {
        navigate("/login")
        alert('Usuario creado correctamente');
        // Aquí puedes redirigir al usuario a otra página, actualizar el estado, etc.
      } else {
        alert('Error al crear el usuario');
      }
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      alert('Error al crear el usuario');
    }
  };

  return (
    <div className="container-fluid" style={{ backgroundColor: '#1a1f25', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="p-4 bg-light rounded shadow" style={{ width: '300px' }}>
        <h2 className="text-center mb-4" style={{ color: '#007bff' }}>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              className="form-control"
              placeholder="Email"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              className="form-control"
              placeholder="Password"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              name="confirmpassword"
              value={confirmpassword}
              onChange={e => setConfirmpassword(e.target.value)}
              className="form-control"
              placeholder="Confirm Password"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">Register</button>
        </form>
      </div>
    </div>
  );
};


export default CreateUser;