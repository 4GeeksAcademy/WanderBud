import React, { useState, useContext } from 'react'; // Importa useState para manejar el estado local en React
import { Context } from '../store/appContext';


const CreateUser = () => {
  const [userData, setUserData] = useState({
    email: '',
    password: '',
    confirmpassword:'',
  });
  const { store, actions}= useContext(Context)


  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await actions.createUser(userData); // Llama a la acción createUser del store con los datos del usuario
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
          <label>First Name:</label>
          <input
            type="confirmpassword"
            name="confirmpassword"
            value={userData.password}
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
