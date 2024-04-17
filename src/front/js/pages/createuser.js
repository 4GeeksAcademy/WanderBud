import React, { useState, useContext } from 'react';
import { Context } from '../store/appContext'; // Importa el contexto desde appContext

const CreateUser = () => {
  const { actions } = useContext(Context); // Obtén las acciones desde el contexto

  const [userData, setUserData] = useState({
    email: '',
    password: '',
    confirmpassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verifica si las contraseñas coinciden
    if (userData.password !== userData.confirmpassword) {
      alert('Error: Las contraseñas no coinciden');
      return;
    }

    try {
      const success = await actions.createUser(userData); // Llama a la acción createUser del contexto
      if (success) {
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
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
  <label>Confirm Password:</label>
  <input
    type="password" // Utiliza el tipo "password" para campos de contraseña
    name="confirmpassword"
    value={userData.confirmpassword}
    onChange={handleChange}
    required
  />
</div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};


export default CreateUser;
