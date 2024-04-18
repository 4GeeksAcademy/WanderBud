import React, { useState } from 'react';
import { useContext } from 'react';
import { Context } from '../store/appContext';
import "../../styles/profile.css"
import ImageUploader from '../component/imageUploader';



export const CreateUserProfile = () => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [location, setLocation] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [message, setMessage] = useState(null);
  const { actions, store } = useContext(Context);
  console.log(name);
  console.log(lastName);
  console.log(location);
  console.log(birthdate);
  console.log(description);
  console.log(image);

  const handleImageChange = (imageUrl) => {
    setImage(imageUrl);
};
  
  async function handleProfileCreation(e) {
    e.preventDefault()
    let accessToken = localStorage.getItem("token")
    let new_profile = await actions.createUserProfile(name, lastName, location, birthdate, description, image, accessToken);
    console.log(new_profile);
    if (new_profile) {
      setMessage(store.message);
    }
    else {
      setMessage("Failed to create profile, please try again");
    }
  };



  return (
    <div className="recover-page">

      <div className="justify-content-center align-items-center" style={{ height: '100vh' }}>

        <div className="recover-form">
          <h2>Create Profile</h2>
          <div className="image" style={{width: "200px", height: "200px"}}>
          <ImageUploader onImageUpload={handleImageChange}/>
          </div>
          <div className='div-form'>
          <form onSubmit={handleProfileCreation}>
            <input
              type="text"
              placeholder="First Name"
              onChange={e => setName(e.target.value)}
              value={name}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              onChange={e => setLastName(e.target.value)}
              value={lastName}
              required
            />
            <input
              type="text"
              placeholder="Country"
              onChange={e => setLocation(e.target.value)}
              value={location}
              required
            />
            <label>Birthdate</label>
            <input
              type="date"
              onChange={e => setBirthdate(e.target.value)}
              value={birthdate}
              required
            />
            <textarea
              type="text"
              placeholder="Let others know about you..."
              onChange={e => setDescription(e.target.value)}
              value={description}
              required
            />
            <button type="submit">Submit</button>
            {message && <p className="message">{message}</p>}
          </form>
          </div>
        </div>

      </div>

    </div>
  );
};
